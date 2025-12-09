# Reddit Launch Post - /r/ObsidianMD

**Title:**
[Plugin Release] Code Runner - Full Python kernel + ChatGPT in Obsidian (NOT sandboxed)

**Post:**

---

Hey everyone! 👋

I built a plugin for **real** Python execution in Obsidian - with persistent kernel sessions and ChatGPT integration.

## Why another code plugin?

I know there's Code Emitter, but I needed:
- **Full Python packages** (pandas, scikit-learn, etc.) - not WebAssembly
- **Persistent sessions** - variables that survive between blocks
- **ChatGPT integration** - LLM prompts as code blocks
- **100% local** - code never leaves my machine

## What it does

**Core features:**
- Execute Python & JavaScript code blocks with a hotkey (`Cmd/Ctrl+Shift+Enter`)
- Variables persist across blocks (kernel mode - like Jupyter)
- ChatGPT 3.5 Turbo/Ollama integration for AI prompts
- Output appears as markdown (saved with your notes!)
- Full settings UI - no config files needed

**Example:**

````markdown
```python
x = 42
print(x * 2)
```

```output
84
```
````

## Why I built this

I wanted to mix code experiments, data exploration, and AI prompts *directly in my notes* without switching to Jupyter or VS Code.

Use cases I've found:
- Quick Python snippets while learning
- Data analysis with context
- ChatGPT as a "code block" (brilliant for research notes)
- Teaching tutorials with live code

## How it works

- **Plugin** (TypeScript) runs in Obsidian
- **Backend** (FastAPI/Python) executes code locally
- Everything stays on your machine

**5-minute setup:**
1. Install plugin
2. Start backend: `python -m uvicorn main:app --port 8000`
3. Done!

## Current state

**v1.0** - Free & open source

What works:
- ✅ Python/JS execution
- ✅ Kernel mode (persistent variables)
- ✅ LLM integration (your API keys)
- ✅ Settings UI
- ✅ Scrollable outputs

What's rough:
- ❌ Text-only output (plots coming in v1.2)
- ❌ Requires local backend running
- ❌ Desktop only

## Roadmap

**v1.2:** Matplotlib plots, DataFrame tables, export to Jupyter
**v2.0:** More languages (Ruby, Go, SQL), rich output, templates

## Links

📦 **GitHub:** [github.com/yourusername/obsidian-code-runner]https://github.com/chin3/obsidian-plugins-obsidian-code-runner)
📖 **Docs:** See README for setup
☕ **Support:** [ko-fi.com/nathandavies](https://ko-fi.com/crimsundev)

---

**Feedback wanted!**
- What features would make this Pro-tier worthy?
- What other languages should I prioritize?
- Any rough edges I should smooth before wider release?

This is v1.0 - lots more planned. If you try it, let me know what breaks! 😅

---

**Update your Ko-fi and GitHub username before posting!**
