
# ✅ **Obsidian Code Runner – Quickstart Guide**

Copy/paste the entire section below into a new Obsidian note.

---

# 🚀 Obsidian Code Runner – Quickstart

## 0️⃣ Install the Plugin

Extract `release.zip` into:

```
YourVault/.obsidian/plugins/obsidian-code-runner/
```

Then enable it in:

**Settings → Community Plugins**

---

## 1️⃣ Test Python Execution

Switch to **Reading Mode**, then click ▶ Run:
1. test
```python
print("hello world")
```

```output
hello world

```


---

## 2️⃣ If You See This Error:

```
Error contacting backend:
TypeError: Failed to fetch
```

Make sure you started the backend manually:

```
cd path/to/obsidian-code-runner/runner
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Leave this window running.

---

## 3️⃣ Test JavaScript Execution (Editor Mode)

Return to **Edit Mode**.

Put your cursor inside the block below and press:

**Cmd/Ctrl + Shift + Enter**

````markdown
```javascript
console.log("Hello from JS");
console.log(1 + 2 + 3);
```

```output
Hello from JS
6

```
````

Expected output:

```
Hello from JS
6
```

---

## 4️⃣ Test LLM Integration

(Enable LLM support in Code Runner settings)

````markdown
```llm
hello who are you
```
````

Expected output (may vary):

```
Hello! I am an AI assistant here to help.
```

---

## 5️⃣ You're Ready! 🎉

You can now run:

- 🐍 Python (with optional kernel mode)
    
- 🛠️ JavaScript
    
- 🤖 LLM prompts (ChatGPT, Claude, Ollama)
    
- 🧠 Agent tasks
    

All directly inside Obsidian.

Happy coding! 💻✨

