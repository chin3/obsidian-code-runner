# LLM Integration Setup Guide

## 🚀 **NEW: UI-Based Configuration Available!**

**You can now configure LLM settings directly in Obsidian!**

1. **Settings → Community Plugins → Obsidian Code Runner**
2. **Enable "LLM / Agent blocks"**  
3. **Configure in "LLM Configuration" section:**
   - Choose provider (Auto/Ollama/OpenAI)
   - Add API key (for OpenAI)
   - Select model

**No environment variables or command-line setup needed!**

See the [LLM Settings Guide](file:///C:/Users/Natha/.gemini/antigravity/brain/86ce3e46-a6b9-43db-aef5-8e43aa8413d0/llm_settings_guide.md) for UI configuration details.

---

## 🤖 Manual Setup (Alternative Method)

The information below is for manual/advanced setup. **Most users should use the UI settings above.**

---

## AI-Powered Code Blocks

Your Obsidian Code Runner now supports real LLM and Agent blocks! Choose between:
- **Ollama** (local, private, free)
- **OpenAI** (cloud, API key required)

---

## Option 1: Ollama (Recommended for Local/Private)

### Install Ollama

1. **Download & Install:**
   - Visit [https://ollama.ai](https://ollama.ai)
   - Download for Windows
   - Run installer

2. **Pull a Model:**
   ```bash
   ollama pull llama2
   ```
   
   Other good models:
   ```bash
   ollama pull mistral      # Fast, efficient
   ollama pull codellama    # Best for code
   ollama pull llama3       # Latest, most capable
   ```

3. **Start Ollama:**
   ```bash
   ollama serve
   ```
   
   Runs at `http://localhost:11434`

4. **Test Installation:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

### ✅ That's It!

Restart your backend and LLM blocks will work automatically.

---

## Option 2: OpenAI (Cloud)

### Setup

1. **Get API Key:**
   - Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new API key
   - Copy it

2. **Set Environment Variable:**

   **Windows (PowerShell):**
   ```powershell
   $env:OPENAI_API_KEY="your-api-key-here"
   ```

   **Or permanently:**
   ```powershell
   [System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'your-key', 'User')
   ```

   **Mac/Linux:**
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

3. **Restart Backend:**
   ```bash
   cd runner
   python -m uvicorn main:app --port 8000 --reload
   ```

---

## 🧪 Testing LLM Integration

### Check Health

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "ollama_available": true,
  "openai_configured": false
}
```

### Test LLM Block

Create in Obsidian:
````markdown
```llm
Explain quantum computing in one sentence.
```
````

Press `Cmd/Ctrl+Shift+Enter` or switch to Reading View and click **💬 Run LLM**

### Test Agent Block

````markdown
```agent
Create a 3-step plan to learn Python in 30 days.
```
````

Press `Cmd/Ctrl+Shift+Enter` or click **🤖 Run Agent**

---

## 🎯 How It Works

### Priority Order

1. **Ollama** (if running) - Used first
2. **OpenAI** (if API key set) - Fallback
3. **Placeholder** - If neither available

### Model Selection

**Default Models:**
- Ollama: `llama2`
- OpenAI: `gpt-3.5-turbo`

**Change Model:**
Edit `runner/main.py`:
```python
OLLAMA_MODEL = "mistral"  # or "codellama", "llama3"
```

---

## 💡 Tips

### For Best Results

**LLM Blocks:**
- Direct questions
- Explanations
- Summaries
- Quick facts

**Agent Blocks:**
- Planning tasks
- Step-by-step instructions
- Problem decomposition
- Strategy formulation

### Performance

**Ollama:**
- First response slow (model loads)
- Subsequent responses fast
- Running locally - no internet needed
- 100% private

**OpenAI:**
- Consistent speed
- Requires internet
- Pay per use
- More capable models

---

## 🔧 Troubleshooting

### "Could not connect to Ollama"

**Fix:**
```bash
ollama serve
```

Make sure Ollama is running on port 11434.

### "OPENAI_API_KEY environment variable not set"

**Fix:**
```powershell
$env:OPENAI_API_KEY="sk-your-key-here"
```

Restart the backend after setting.

### Model Not Found (Ollama)

**Fix:**
```bash
ollama list                    # See available models
ollama pull llama2             # Pull missing model
```

### Slow Responses

**Ollama:**
- First run loads model (10-30s)
- Try smaller model: `ollama pull mistral`

**OpenAI:**
- Check internet connection
- Try different model

---

## 📊 Comparison

| Feature | Ollama | OpenAI |
|---------|--------|--------|
| **Cost** | Free | Pay per use |
| **Privacy** | 100% local | Cloud |
| **Setup** | Install + pull model | API key |
| **Speed** | Depends on hardware | Consistent |
| **Models** | llama2, mistral, codellama | GPT-3.5, GPT-4 |
| **Internet** | Not required | Required |

---

## 🎉 Example Workflows

### Research Assistant

````markdown
```llm
Summarize the key differences between React and Vue.js
```
````

### Code Helper

````markdown
```agent
Create a plan to refactor this Python function for better performance
```
````

### Note Enhancement

````markdown
```llm
Generate 3 follow-up questions for this topic: [your topic]
```
````

---

**Recommendation:** Start with Ollama for privacy and cost, use OpenAI for highest quality responses.

Both work seamlessly - the backend chooses automatically!
