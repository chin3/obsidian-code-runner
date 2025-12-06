from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
from typing import Optional
import threading
import queue
import requests
import json

app = FastAPI()

# Add CORS middleware to allow requests from Obsidian
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Obsidian runs locally)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all headers
    allow_headers=["*"],  # Allow all headers
)

#
# MODELS
#

class RunRequest(BaseModel):
    language: str
    code: str
    kernel: Optional[bool] = False

class RunResponse(BaseModel):
    stdout: str
    stderr: str
    exitCode: int

class LLMRequest(BaseModel):
    mode: str  # "llm" or "agent"
    prompt: str
    model: Optional[str] = None
    # Settings from plugin
    provider: Optional[str] = "auto"  # "auto", "ollama", "openai"
    openai_api_key: Optional[str] = None
    ollama_model: Optional[str] = None
    ollama_url: Optional[str] = None

class LLMResponse(BaseModel):
    output: str

#
# LLM CONFIGURATION
#

# Try Ollama first (local), fallback to placeholder
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama2"  # Change to your installed model

def check_ollama_available():
    """Check if Ollama is running and accessible"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=2)
        return response.status_code == 200
    except:
        return False

OLLAMA_AVAILABLE = check_ollama_available()

#
# PYTHON KERNEL (PERSISTENT)
#

class PythonKernel:
    def __init__(self):
        self.globals = {}
        self.locals = {}

    def run(self, code: str):
        import io
        import sys
        from contextlib import redirect_stdout, redirect_stderr
        
        # Convert tabs to spaces
        code = code.replace('\t', '    ')
        
        # Capture stdout and stderr
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        try:
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                # Execute code in persistent namespace
                exec(code, self.globals, self.locals)
            
            stdout = stdout_capture.getvalue()
            stderr = stderr_capture.getvalue()
            
        except Exception as e:
            # Capture exceptions as stderr
            import traceback
            stdout = stdout_capture.getvalue()
            stderr = stderr_capture.getvalue() + traceback.format_exc()
        
        return stdout, stderr


kernel = PythonKernel()

#
# HELPER: ONE-SHOT EXECUTION (NON-KERNEL)
#

def execute_once(language: str, code: str) -> RunResponse:
    if language == "python":
        ext = ".py"
        cmd = ["python", ""]
    elif language == "javascript":
        ext = ".js"
        cmd = ["node", ""]
    else:
        return RunResponse(stdout="", stderr=f"Unsupported language: {language}", exitCode=1)

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(code.encode("utf-8"))
        tmp.flush()
        filepath = tmp.name

    cmd[1] = filepath

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=10
        )
        stdout = result.stdout
        stderr = result.stderr
        exit_code = result.returncode
    except subprocess.TimeoutExpired:
        stdout = ""
        stderr = "Execution timed out."
        exit_code = 1
    finally:
        os.remove(filepath)

    return RunResponse(stdout=stdout, stderr=stderr, exitCode=exit_code)

#
# LLM HELPERS
#

def call_ollama(prompt: str, model: str = OLLAMA_MODEL) -> str:
    """Call Ollama local LLM"""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("response", "No response from model")
        else:
            return f"Error: Ollama returned status {response.status_code}"
    except requests.exceptions.Timeout:
        return "Error: Request timed out (60s)"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Is it running on localhost:11434?"
    except Exception as e:
        return f"Error calling Ollama: {str(e)}"

def call_openai(prompt: str, model: str = "gpt-3.5-turbo") -> str:
    """Call OpenAI API - requires OPENAI_API_KEY environment variable"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "Error: OPENAI_API_KEY environment variable not set"
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"]
        else:
            return f"Error: OpenAI returned status {response.status_code}: {response.text}"
    except Exception as e:
        return f"Error calling OpenAI: {str(e)}"

def agent_execute(prompt: str) -> str:
    """
    Agent mode: Enhanced prompt for task-oriented responses
    This uses the same LLM but with a system-like prefix
    """
    agent_prompt = f"""You are a helpful AI agent. The user has given you a task.
Please provide a clear, actionable response.

Task: {prompt}

Response:"""
    
    if OLLAMA_AVAILABLE:
        return call_ollama(agent_prompt)
    else:
        # Try OpenAI if Ollama not available
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            return call_openai(agent_prompt)
        else:
            return f"[AGENT MODE - No LLM Available]\n\nTask: {prompt}\n\nTo enable AI responses:\n1. Install Ollama (https://ollama.ai) and run 'ollama pull llama2'\n2. Or set OPENAI_API_KEY environment variable"

#
# ROUTES
#

@app.post("/run", response_model=RunResponse)
def run(req: RunRequest):
    if req.language == "python" and req.kernel:
        stdout, stderr = kernel.run(req.code)
        # kernel doesn't expose exit code easily, we treat as 0 unless we want to parse
        return RunResponse(stdout=stdout, stderr=stderr, exitCode=0)

    # fallback: one-shot execution
    return execute_once(req.language, req.code)

@app.post("/llm", response_model=LLMResponse)
def llm(req: LLMRequest):
    """
    LLM endpoint with real AI integration
    
    Supports provider selection from plugin settings
    """
    mode = req.mode.lower()
    
    # Use settings from request, fallback to defaults
    provider = req.provider or "auto"
    ollama_url = req.ollama_url or OLLAMA_URL
    ollama_model = req.ollama_model or OLLAMA_MODEL
    openai_key = req.openai_api_key or os.getenv("OPENAI_API_KEY")
    
    # Agent mode
    if mode == "agent":
        agent_prompt = f"""You are a helpful AI agent. The user has given you a task.
Please provide a clear, actionable response.

Task: {req.prompt}

Response:"""
        
        if provider == "ollama" or (provider == "auto" and OLLAMA_AVAILABLE):
            output = call_ollama_custom(agent_prompt, ollama_model, ollama_url)
        elif provider == "openai" or (provider == "auto" and openai_key):
            output = call_openai_custom(agent_prompt, openai_key, req.model or "gpt-3.5-turbo")
        else:
            output = f"[AGENT - No LLM Available] Configure in settings."
        
        return LLMResponse(output=output)
    
    # LLM mode
    if provider == "ollama" or (provider == "auto" and OLLAMA_AVAILABLE):
        output = call_ollama_custom(req.prompt, ollama_model, ollama_url)
    elif provider == "openai" or (provider == "auto" and openai_key):
        output = call_openai_custom(req.prompt, openai_key, req.model or "gpt-3.5-turbo")
    else:
        output = f"""[LLM - Not Configured]

Enable in Settings → Code Runner → LLM Configuration:
1. Choose provider (Ollama or OpenAI)
2. Set API key (OpenAI) or install Ollama locally
3. Select model

Prompt: {req.prompt}"""
    
    return LLMResponse(output=output)

def call_ollama_custom(prompt: str, model: str, url: str) -> str:
    """Call Ollama with custom URL and model"""
    try:
        response = requests.post(
            f"{url}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("response", "No response from model")
        else:
            return f"Error: Ollama returned status {response.status_code}"
    except requests.exceptions.ConnectionError:
        return f"Error: Could not connect to Ollama at {url}"
    except Exception as e:
        return f"Error calling Ollama: {str(e)}"

def call_openai_custom(prompt: str, api_key: str, model: str) -> str:
    """Call OpenAI with custom key and model"""
    if not api_key:
        return "Error: OpenAI API key not provided"
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"]
        else:
            return f"Error: OpenAI returned status {response.status_code}"
    except Exception as e:
        return f"Error calling OpenAI: {str(e)}"

@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "ollama_available": OLLAMA_AVAILABLE,
        "openai_configured": bool(os.getenv("OPENAI_API_KEY"))
    }
