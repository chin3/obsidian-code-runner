from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
from typing import Optional
import threading
import queue

app = FastAPI()

# Add CORS middleware to allow requests from Obsidian
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Obsidian runs locally)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
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

class LLMResponse(BaseModel):
    output: str

#
# PYTHON KERNEL (PERSISTENT)
#

class PythonKernel:
    def __init__(self):
        self.process = subprocess.Popen(
            ["python", "-q", "-i", "-u"],  # -q suppresses startup banner
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        self.output_queue = queue.Queue()
        threading.Thread(target=self._read_stdout, daemon=True).start()
        threading.Thread(target=self._read_stderr, daemon=True).start()

    def _read_stdout(self):
        for line in self.process.stdout:
            self.output_queue.put(("stdout", line))

    def _read_stderr(self):
        for line in self.process.stderr:
            self.output_queue.put(("stderr", line))

    def run(self, code: str):
        if self.process.poll() is not None:
            # restarted if dead
            self.__init__()

        self.process.stdin.write(code + "\n")
        self.process.stdin.flush()

        stdout = ""
        stderr = ""

        # Best-effort: read whatever comes in for a short time
        while True:
            try:
                typ, line = self.output_queue.get(timeout=0.05)
                if typ == "stdout":
                    stdout += line
                else:
                    stderr += line
            except queue.Empty:
                break

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
    Placeholder LLM endpoint.

    TODO: Plug in OpenAI, local Ollama, or your agent framework.
    For now, we just echo back the prompt with a header so you can debug wiring.
    """
    mode = req.mode.lower()
    header = "[LLM]" if mode == "llm" else "[AGENT]"
    output = f"{header} (placeholder)\n\nPrompt:\n{req.prompt}"
    return LLMResponse(output=output)
