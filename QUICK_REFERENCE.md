# Obsidian Code Runner - Quick Reference

## 🚀 Quick Start

**Backend:** `cd runner && python -m uvicorn main:app --port 8000 --reload`  
**Plugin:** `cd obsidian-code-runner && npm run dev`

## ⌨️ Hotkeys

- **Run Current Block:** `Cmd+Shift+Enter` (Mac) / `Ctrl+Shift+Enter` (Windows)

## 📝 Supported Code Blocks

### Python
````markdown
```python
print("Hello World")
```
````

### JavaScript
````markdown
```javascript
console.log("Hello World");
```
````

### LLM (AI Prompts)
````markdown
```llm
What is the meaning of life?
```
````

### Agent (AI Tasks)
````markdown
```agent
Create a plan to learn Python in 30 days
```
````

## ⚙️ Features

| Feature | Description | How to Use |
|---------|-------------|------------|
| **Reading Mode** | Run buttons on code blocks | Click ▶ Run |
| **Editor Mode** | Execute from edit view | `Cmd/Ctrl+Shift+Enter` |
| **Kernel Mode** | Persistent Python sessions | Enable in settings |
| **LLM Blocks** | AI prompt execution | Enable in settings |
| **Settings Tab** | Configure all options | Settings → Code Runner |

## 🧪 Testing Kernel Mode

````markdown
```python
x = 42
```

```python
print(x)  # Works if kernel mode is ON
```
````

## 📦 File Structure

```
obsidian-code-runner/
  main.ts          # Plugin with all features
  main.js          # Built output
  styles.css       # UI styling
  manifest.json    # Plugin metadata

runner/
  main.py          # Backend with kernel + LLM
  requirements.txt # Python dependencies
```

## 🔗 Endpoints

- `POST /run` - Execute code (Python/JS)
- `POST /llm` - Execute LLM/Agent prompts

## 💡 Tips

1. **Kernel mode** only works for Python
2. **Output blocks** auto-update in editor mode
3. **LLM endpoint** is a placeholder - hook up your own AI
4. **Backend auto-reloads** when you edit `main.py`
5. **Plugin auto-rebuilds** when you edit `main.ts`
