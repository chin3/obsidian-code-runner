# Obsidian Code Runner

**Run code blocks (Python/JS) and LLM prompts directly inside Obsidian, Jupyter-style.**

Transform your Obsidian vault into a computational notebook with persistent Python sessions, inline execution, and AI integration.

---

## ✨ Features

### Core Execution
- ✅ **Python & JavaScript** - Run code blocks in reading and editor mode
- ✅ **Kernel Mode** - Persistent Python sessions (variables survive across blocks)
- ✅ **Editor Mode** - Execute with `Cmd/Ctrl+Shift+Enter` hotkey
- ✅ **Inline Output** - Results appear directly below code blocks
- ✅ **Error Handling** - Visual feedback for failures

### Advanced Features
- ✅ **Settings Tab** - Configure backend URL, languages, and options
- ✅ **LLM Blocks** - Execute AI prompts with ` ```llm` and ` ```agent`
- ✅ **Reading Mode** - Click Run buttons on code blocks
- ✅ **Auto Output Blocks** - Editor mode writes ` ```output` to markdown

---

## 🚀 Quick Start

### 1. Install Backend

```bash
cd runner
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
```

Backend runs at `http://localhost:8000`

### 2. Build Plugin

```bash
cd obsidian-code-runner
npm install
npm run dev
```

### 3. Install in Obsidian

Copy `obsidian-code-runner/` to your vault's `.obsidian/plugins/` and enable in settings.

---

## 📖 Usage

### Basic Execution (Reading Mode)

Create a code block:
````markdown
```python
x = 5
print(x + 2)
```
````

Switch to **Reading View** → Click **▶ Run** → Output appears below

### Editor Mode (Hotkey)

Put cursor inside any code block and press:
- **Mac:** `Cmd+Shift+Enter`
- **Windows:** `Ctrl+Shift+Enter`

An ` ```output` block is created/updated automatically.

### Kernel Mode (Persistent Sessions)

Enable "Use Kernel Mode" in settings:

````markdown
```python
x = 42
y = 10
```

```python
print(f"Sum: {x + y}")  # Works! Remembers variables
```
````

Variables persist across blocks in the same session.

### LLM Blocks

Enable "LLM / Agent blocks" in settings:

````markdown
```llm
What is the capital of France?
```
````

Click **💬 Run LLM** or use hotkey. (Placeholder backend - ready for OpenAI/Ollama)

---

## ⚙️ Settings

Access: **Settings → Community Plugins → Obsidian Code Runner**

- **Backend URL** - Where code execution requests are sent
- **Use Kernel Mode** - Persistent Python sessions
- **Enable Python** - Toggle Python execution
- **Enable JavaScript** - Toggle JavaScript execution
- **Enable LLM/Agent blocks** - Toggle AI prompt execution

---

## 🎯 Supported Languages

| Language | Syntax | Mode | Kernel Support |
|----------|--------|------|----------------|
| Python | ` ```python` | Both | ✅ Yes |
| JavaScript | ` ```javascript` or ` ```js` | Both | ❌ No |
| LLM Prompts | ` ```llm` | Both | N/A |
| Agent Tasks | ` ```agent` | Both | N/A |

---

## 🔧 Development

### Plugin Build

```bash
npm run dev     # Watch mode
npm run build   # Production build
```

### Backend Development

```bash
python -m uvicorn main:app --port 8000 --reload
```

Auto-reloads on code changes.

### Project Structure

```
obsidian-code-runner/
  ├── main.ts              # Plugin source
  ├── main.js              # Built output
  ├── styles.css           # UI styling
  ├── manifest.json        # Plugin metadata
  └── package.json         # Dependencies

runner/
  ├── main.py              # FastAPI backend
  ├── requirements.txt     # Python deps
  └── test_backend.py      # Tests
```

---

## 🧪 Testing

### Test Kernel Mode
````markdown
```python
test_var = "Hello from kernel!"
```

```python
print(test_var)  # Should print the message
```
````

### Test Editor Mode
1. Create Python block
2. Put cursor inside
3. Press `Cmd/Ctrl+Shift+Enter`
4. Verify ` ```output` block appears

### Test LLM (Placeholder)
````markdown
```llm
Explain quantum computing in one sentence.
```
````

Should return placeholder response.

---

## 🔌 Backend API

### POST `/run`

Execute code.

**Request:**
```json
{
  "language": "python",
  "code": "print('hello')",
  "kernel": false
}
```

**Response:**
```json
{
  "stdout": "hello\n",
  "stderr": "",
  "exitCode": 0
}
```

### POST `/llm`

Execute LLM/Agent prompt (placeholder).

**Request:**
```json
{
  "mode": "llm",
  "prompt": "What is AI?"
}
```

**Response:**
```json
{
  "output": "[LLM] (placeholder)\n\nPrompt:\nWhat is AI?"
}
```

---

## 📚 Documentation

- [CHANGELOG.md](CHANGELOG.md) - Development history
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference guide
- [runner/README.md](runner/README.md) - Backend documentation

---

## 🚧 Roadmap

### Coming Soon
- Real LLM integration (OpenAI/Ollama)
- Kernel restart button
- Additional languages (Ruby, Go, Rust, R)
- Rich output (images, plots, tables)
- Security improvements (Docker sandboxing)

### Future
- Per-note kernel sessions
- Cell execution controls (run all, run above/below)
- Syntax highlighting for outputs
- Mobile support (if feasible)

---

## 🤝 Contributing

This is an early-stage project. Contributions welcome!

**Areas to help:**
- LLM integration (OpenAI, Anthropic, Ollama)
- Additional language support
- Security hardening
- Rich output rendering
- Documentation

---

## 📄 License

MIT

---

## 👤 Author

Nathan Chin

---

## 🙏 Acknowledgments

Built with:
- [Obsidian API](https://docs.obsidian.md/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)

---

**Status:** ✅ MVP Complete - All core features working!

Transform your Obsidian vault into a computational notebook today. 🚀
