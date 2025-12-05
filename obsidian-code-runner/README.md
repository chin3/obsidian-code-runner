# Obsidian Code Runner 🚀

**Transform your Obsidian vault into a computational notebook with Jupyter-style code execution.**

Execute Python and JavaScript code blocks directly in your notes with persistent sessions, inline results, and AI integration readiness.

---

## ✨ Features

### Core Execution
- ✅ **Python & JavaScript** - Run code blocks in reading and editor mode
- ✅ **Kernel Mode** - Persistent Python sessions (variables survive across blocks) - **ENABLED BY DEFAULT**
- ✅ **Editor Mode** - Execute with `Cmd/Ctrl+Shift+Enter` hotkey
- ✅ **Floating Run Button** - Hover over code blocks in edit mode to see run button
- ✅ **Inline Output** - Results appear directly below code blocks
- ✅ **Error Handling** - Visual feedback for failures

### Advanced Features
- ✅ **Settings Tab** - Configure everything in Obsidian UI (no environment variables!)
- ✅ **LLM Blocks** - Execute AI prompts with ` ```llm` and ` ```agent`
- ✅ **LLM Configuration UI** - Choose provider (Ollama/OpenAI), set API keys, select models
- ✅ **Real AI Integration** - Ollama (local, private) or OpenAI (cloud) support
- ✅ **Reading Mode** - Click Run buttons on code blocks
- ✅ **Auto Output Blocks** - Editor mode writes ` ```output` to markdown

---

## 🚀 Quick Start

### 1. Start Backend

```powershell
cd runner
python -m uvicorn main:app --port 8000 --reload
```

Backend runs at `http://localhost:8000`

### 2. Build Plugin

```powershell
cd obsidian-code-runner
npm install  # First time only
npm run dev  # Watch mode
```

###  3. Install in Obsidian

1. Copy `obsidian-code-runner/` to your vault's `.obsidian/plugins/`
2. **Settings → Community Plugins** → Enable "Obsidian Code Runner"
3. Done! 🎉

---

## 📖 Usage

### Reading Mode

Create a code block:
````markdown
```python
x = 5
print(x + 2)
```
````

1. Switch to **Reading View**
2. Click **▶ Run** button
3. Output appears below

### Editor Mode (Recommended)

1. Create code block in **Edit mode**
2. Place cursor inside block
3. Press `Cmd+Shift+Enter` (Mac) or `Ctrl+Shift+Enter` (Windows)
4. ` ```output` block created/updated automatically

### Kernel Mode - Persistent Variables

**Enabled by default!** Variables survive across blocks:

````markdown
```python
name = "Alice"
age = 30
```

```python
print(f"{name} is {age} years old")
# Output: Alice is 30 years old
```
````

---

## ⚙️ Settings

Access: **Settings → Community Plugins → Obsidian Code Runner**

### Basic Settings
- **Backend URL** - Where code execution requests are sent
- **Use Kernel Mode** - Persistent Python sessions (default: ON)
- **Enable Python** - Toggle Python execution
- **Enable JavaScript** - Toggle JavaScript execution
- **Enable LLM/Agent blocks** - Toggle AI prompt execution

### LLM Configuration (when LLM blocks enabled)
- **LLM Provider** - Choose `Auto`, `Ollama` (local), or `OpenAI` (cloud)
- **OpenAI API Key** - Your OpenAI API key (stored securely in vault)
- **Ollama Model** - Which model to use (e.g., llama2, mistral, codellama)
- **Ollama URL** - Where Ollama is running (default: http://localhost:11434)

**No environment variables needed!** Configure everything in the UI.

---

## 🎯 Supported Languages

| Language | Syntax | Kernel Support |
|----------|--------|----------------|
| Python | ` ```python` | ✅ Yes |
| JavaScript/Node.js | ` ```javascript` or ` ```js` | ❌ No |
| LLM Prompts | ` ```llm` | N/A |
| Agent Tasks | ` ```agent` | N/A |

---

## 🧪 Testing

### Test Kernel Mode
````markdown
```python
x = 42
```

```python
print(x)  # Should output: 42
```
````

### Test Editor Mode Hotkey
1. Create Python block in edit mode
2. Put cursor inside
3. Press `Cmd+Shift+Enter`
4. Verify ` ```output` block appears

---

## 🔧 Development

### Plugin
```powershell
npm run dev     # Watch mode (auto-rebuild)
npm run build   # Production build
```

### Backend
```powershell
python -m uvicorn main:app --port 8000 --reload
```
Auto-reloads on code changes.

---

## 📁 Project Structure

```
obsidian-code-runner/
  ├── main.ts              # Plugin source
  ├── main.js              # Built output
  ├── styles.css           # Styling
  ├── manifest.json        # Metadata
  └── package.json         # Dependencies

runner/
  ├── main.py              # FastAPI backend
  ├── requirements.txt     # Python deps
  └── test_backend.py      # Tests
```

---

## 🔌 Backend API

### POST `/run` - Execute Code

**Request:**
```json
{
  "language": "python",
  "code": "print('hello')",
  "kernel": true
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

### POST `/llm` - LLM/Agent (Placeholder)

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

## 💡 Tips & Tricks

- **Kernel mode is ON by default** - Variables persist automatically
- **Use editor mode hotkey** - Faster than switching to reading view
- **Output blocks update** - Run again to replace existing output
- **Backend auto-reloads** - Edit `main.py` without manual restart
- **Plugin auto-rebuilds** - `npm run dev` watches for changes

---

## 🚧 Roadmap

### Recently Added ✅
- ✅ Real LLM integration (Ollama/OpenAI)
- ✅ LLM Configuration UI (no env vars needed!)
- ✅ Floating run button in edit mode
- ✅ Kernel mode enabled by default

### Coming Soon
- Kernel restart button
- Additional languages (Ruby, Go, Rust, R)
- Rich output (images, plots, tables)

### Future
- Per-note kernel sessions
- Cell execution controls (run all, run above/below)
- Docker sandboxing for security
- Mobile support (if feasible)

---

## 📚 Documentation

- [CHANGELOG.md](../CHANGELOG.md) - Development history
- [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Quick reference
- [summary.md](../.gemini/antigravity/brain/.../summary.md) - Current status

---

## 🤝 Contributing

Contributions welcome! Areas to help:
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

**Nathan Chin**

---

## 🙏 Acknowledgments

Built with:
- [Obsidian API](https://docs.obsidian.md/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)

---

## ⚡ Quick Example

````markdown
# My Note

Some text here...

```python
# This runs with kernel mode (persistent session)
import math
radius = 5
area = math.pi * radius ** 2
print(f"Area: {area:.2f}")
```

```python
# This remembers 'radius' and 'math' from above!
circumference = 2 * math.pi * radius
print(f"Circumference: {circumference:.2f}")
```

More text...
````

**Press `Cmd/Ctrl+Shift+Enter` in each block** → Output appears inline!

---

**Status:** ✅ **Production Ready** - All core features working!

Transform your Obsidian notes into executable notebooks today. 🎉
