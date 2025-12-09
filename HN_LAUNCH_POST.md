# Hacker News "Show HN" Post

**Title:**
Show HN: Obsidian Code Runner – Jupyter-style notebooks in your notes

**URL:**
https://github.com/yourusername/obsidian-code-runner

**Text:**

---

I built a plugin that lets you run Python, JavaScript, and LLM prompts directly in Obsidian notes.

It's like Jupyter notebooks, but integrated into your note-taking workflow. Variables persist across code blocks (kernel mode), and you can hook up ChatGPT/Claude for AI assistance.

**Main use cases:**
- Quick Python experiments while taking notes
- Teaching (code + explanations in one place)
- Data exploration with context
- AI-assisted coding in your vault

**How it works:**
- Obsidian plugin (TypeScript) provides UI
- FastAPI backend (Python) executes code locally
- All execution happens on your machine

**Current features:**
- Python & JavaScript execution
- Persistent kernel sessions
- LLM integration (OpenAI/Ollama)
- Output saved as markdown
- Full settings UI

**Still early (v1.0):**
- Text output only (working on plots/images)
- Requires local backend
- Desktop only

Built with TypeScript (plugin) + FastAPI (execution backend). Free & open source (MIT).

**Roadmap:** Matplotlib support, DataFrame rendering, export to Jupyter, more languages.

Would love feedback on what features to prioritize!

---

**Remember to:**
1. Update GitHub URL
2. Post during HN active hours (9am-12pm PT)
3. Engage with comments quickly
