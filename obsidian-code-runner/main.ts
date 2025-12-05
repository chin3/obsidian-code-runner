import {
  App,
  Editor,
  MarkdownView,
  MarkdownPostProcessorContext,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";

//
// SETTINGS
//

interface CodeRunnerSettings {
  backendUrl: string;
  useKernel: boolean;
  enablePython: boolean;
  enableJS: boolean;
  enableLLM: boolean;
}

const DEFAULT_SETTINGS: CodeRunnerSettings = {
  backendUrl: "http://localhost:8000/run",
  useKernel: false,
  enablePython: true,
  enableJS: true,
  enableLLM: false,
};

interface RunRequest {
  language: string;
  code: string;
  kernel?: boolean;
}

interface RunResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface LLMResponse {
  output: string;
}

export default class CodeRunnerPlugin extends Plugin {
  settings: CodeRunnerSettings;

  async onload() {
    console.log("Loading Obsidian Code Runner");

    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new CodeRunnerSettingTab(this.app, this));

    // Reading mode: add Run buttons + inline output
    this.registerMarkdownPostProcessor((el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
      this.enhanceCodeBlocks(el);
    });

    // Editor mode: command to run current fenced block
    this.addCommand({
      id: "run-current-code-block",
      name: "Run current code block",
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        await this.runCurrentCodeBlockInEditor(editor);
      },
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "Enter",
        },
      ],
    });
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  //
  // READING MODE ENHANCEMENT
  //

  private enhanceCodeBlocks(container: HTMLElement) {
    const codeBlocks = container.querySelectorAll("pre > code");
    codeBlocks.forEach((codeEl) => {
      const pre = codeEl.parentElement;
      if (!pre) return;

      const languageClass = Array.from(codeEl.classList).find((cls) =>
        cls.startsWith("language-")
      );
      if (!languageClass) return;

      const language = languageClass.replace("language-", "").toLowerCase();

      // LLM blocks
      if (language === "llm" || language === "agent") {
        if (!this.settings.enableLLM) return;
        if (pre.parentElement && pre.parentElement.classList.contains("code-runner-wrapper")) return;
        this.wrapLLMBlock(pre, codeEl as HTMLElement, language);
        return;
      }

      // Normal code blocks
      const isPython = language === "python";
      const isJS = language === "javascript" || language === "js";

      if (!isPython && !isJS) return;
      if ((isPython && !this.settings.enablePython) || (isJS && !this.settings.enableJS)) return;

      if (pre.parentElement && pre.parentElement.classList.contains("code-runner-wrapper")) return;

      this.wrapExecutableBlock(pre, codeEl as HTMLElement, isJS ? "javascript" : "python");
    });
  }

  private wrapExecutableBlock(pre: HTMLElement, codeEl: HTMLElement, language: "python" | "javascript") {
    const wrapper = document.createElement("div");
    wrapper.classList.add("code-runner-wrapper");

    const toolbar = document.createElement("div");
    toolbar.classList.add("code-runner-toolbar");

    const langLabel = document.createElement("span");
    langLabel.classList.add("code-runner-lang");
    langLabel.textContent = language;

    const runButton = document.createElement("button");
    runButton.classList.add("code-runner-run-button");
    runButton.textContent = "▶ Run";

    toolbar.appendChild(langLabel);
    toolbar.appendChild(runButton);

    const parent = pre.parentElement;
    if (!parent) return;

    parent.replaceChild(wrapper, pre);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(pre);

    const outputContainer = document.createElement("pre");
    outputContainer.classList.add("code-runner-output");
    const outputCode = document.createElement("code");
    outputContainer.appendChild(outputCode);
    wrapper.appendChild(outputContainer);
    outputContainer.style.display = "none";

    runButton.addEventListener("click", async () => {
      const code = codeEl.textContent ?? "";
      await this.runCode(
        {
          language,
          code,
          kernel: this.settings.useKernel && language === "python",
        },
        runButton,
        outputContainer,
        outputCode
      );
    });
  }

  private wrapLLMBlock(pre: HTMLElement, codeEl: HTMLElement, mode: "llm" | "agent") {
    const wrapper = document.createElement("div");
    wrapper.classList.add("code-runner-wrapper");

    const toolbar = document.createElement("div");
    toolbar.classList.add("code-runner-toolbar");

    const langLabel = document.createElement("span");
    langLabel.classList.add("code-runner-lang");
    langLabel.textContent = mode.toUpperCase();

    const runButton = document.createElement("button");
    runButton.classList.add("code-runner-run-button");
    runButton.textContent = mode === "llm" ? "💬 Run LLM" : "🤖 Run Agent";

    toolbar.appendChild(langLabel);
    toolbar.appendChild(runButton);

    const parent = pre.parentElement;
    if (!parent) return;

    parent.replaceChild(wrapper, pre);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(pre);

    const outputContainer = document.createElement("pre");
    outputContainer.classList.add("code-runner-output");
    const outputCode = document.createElement("code");
    outputContainer.appendChild(outputCode);
    wrapper.appendChild(outputContainer);
    outputContainer.style.display = "none";

    runButton.addEventListener("click", async () => {
      const prompt = codeEl.textContent ?? "";
      await this.runLLM(prompt, mode, runButton, outputContainer, outputCode);
    });
  }

  //
  // SHARED EXECUTION HELPERS
  //

  private async runCode(
    payload: RunRequest,
    button: HTMLButtonElement,
    outputPre: HTMLElement,
    outputCode: HTMLElement
  ) {
    const originalText = button.textContent;
    button.textContent = "Running...";
    button.disabled = true;

    outputPre.style.display = "block";
    outputCode.textContent = "Running...";

    try {
      const res = await fetch(this.settings.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        outputCode.textContent = `Error: HTTP ${res.status}\n${text}`;
        outputPre.classList.add("code-runner-output-error");
        return;
      }

      const data = (await res.json()) as RunResponse;
      let out = "";
      if (data.stdout) out += data.stdout;
      if (data.stderr) {
        if (out.length > 0) out += "\n";
        out += `stderr:\n${data.stderr}`;
      }
      if (!out) out = `<no output> (exit code ${data.exitCode})`;

      outputCode.textContent = out;
      if (data.exitCode !== 0) {
        outputPre.classList.add("code-runner-output-error");
      } else {
        outputPre.classList.remove("code-runner-output-error");
      }
    } catch (err: any) {
      outputCode.textContent = `Error contacting backend:\n${String(err)}`;
      outputPre.classList.add("code-runner-output-error");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  private async runLLM(
    prompt: string,
    mode: "llm" | "agent",
    button: HTMLButtonElement,
    outputPre: HTMLElement,
    outputCode: HTMLElement
  ) {
    const originalText = button.textContent;
    button.textContent = mode === "llm" ? "Thinking..." : "Running...";
    button.disabled = true;

    outputPre.style.display = "block";
    outputCode.textContent = "Contacting LLM backend...";

    try {
      const url = this.settings.backendUrl.replace(/\/run$/, "/llm");

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt }),
      });

      if (!res.ok) {
        const text = await res.text();
        outputCode.textContent = `Error: HTTP ${res.status}\n${text}`;
        outputPre.classList.add("code-runner-output-error");
        return;
      }

      const data = (await res.json()) as LLMResponse;
      outputCode.textContent = data.output;
    } catch (err: any) {
      outputCode.textContent = `Error contacting LLM backend:\n${String(err)}`;
      outputPre.classList.add("code-runner-output-error");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  //
  // EDITOR MODE – RUN CURRENT FENCED BLOCK AND WRITE OUTPUT BLOCK
  //

  private async runCurrentCodeBlockInEditor(editor: Editor) {
    const cursor = editor.getCursor();
    const lineCount = editor.lineCount();

    // Find opening fence
    let startLine = cursor.line;
    while (startLine >= 0) {
      const line = editor.getLine(startLine);
      if (line.trim().startsWith("```")) break;
      startLine--;
    }
    if (startLine < 0) {
      new Notice("No fenced code block found above cursor.");
      return;
    }

    const openingLine = editor.getLine(startLine);
    const fenceMatch = openingLine.trim().match(/^```(\w+)?/);
    if (!fenceMatch) {
      new Notice("Not in a code block.");
      return;
    }
    const languageRaw = (fenceMatch[1] || "").toLowerCase();
    let language: string = languageRaw;

    // LLM or agent blocks
    const isLLM = language === "llm" || language === "agent";

    // Find closing fence
    let endLine = startLine + 1;
    while (endLine < lineCount) {
      const line = editor.getLine(endLine);
      if (line.trim().startsWith("```")) break;
      endLine++;
    }
    if (endLine >= lineCount) {
      new Notice("Unclosed code block.");
      return;
    }

    const codeLines: string[] = [];
    for (let i = startLine + 1; i < endLine; i++) {
      codeLines.push(editor.getLine(i));
    }
    const code = codeLines.join("\n");

    // Look for an existing ```output block immediately after
    let outputStart = endLine + 1;
    let outputEnd = outputStart;
    let hasOutputBlock = false;

    if (outputStart < lineCount) {
      const maybeOutputFence = editor.getLine(outputStart).trim();
      if (maybeOutputFence.startsWith("```output")) {
        hasOutputBlock = true;
        outputEnd = outputStart + 1;
        while (outputEnd < lineCount) {
          const l = editor.getLine(outputEnd);
          if (l.trim().startsWith("```")) break;
          outputEnd++;
        }
        // include closing fence
        if (outputEnd < lineCount) outputEnd++;
      }
    }

    const runAndInsert = async (output: string) => {
      const outputBlock = [
        "```output",
        output || "<no output>",
        "```",
        "",
      ].join("\n");

      if (hasOutputBlock) {
        editor.replaceRange(
          outputBlock,
          { line: outputStart, ch: 0 },
          { line: outputEnd, ch: 0 }
        );
      } else {
        editor.replaceRange(
          "\n" + outputBlock,
          { line: endLine + 1, ch: 0 }
        );
      }
    };

    if (isLLM) {
      if (!this.settings.enableLLM) {
        new Notice("LLM blocks are disabled in settings.");
        return;
      }
      const mode = language === "agent" ? "agent" : "llm";
      const url = this.settings.backendUrl.replace(/\/run$/, "/llm");

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, prompt: code }),
        });

        if (!res.ok) {
          const text = await res.text();
          await runAndInsert(`Error: HTTP ${res.status}\n${text}`);
          return;
        }

        const data = (await res.json()) as LLMResponse;
        await runAndInsert(data.output);
      } catch (err: any) {
        await runAndInsert(`Error contacting LLM backend:\n${String(err)}`);
      }

      return;
    }

    // Normal code blocks
    const isPython = language === "python";
    const isJS = language === "javascript" || language === "js";

    if (!isPython && !isJS) {
      new Notice("Language not supported in editor mode.");
      return;
    }

    if ((isPython && !this.settings.enablePython) || (isJS && !this.settings.enableJS)) {
      new Notice("Language is disabled in settings.");
      return;
    }

    try {
      const res = await fetch(this.settings.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: isJS ? "javascript" : "python",
          code,
          kernel: this.settings.useKernel && isPython,
        } as RunRequest),
      });

      if (!res.ok) {
        const text = await res.text();
        await runAndInsert(`Error: HTTP ${res.status}\n${text}`);
        return;
      }

      const data = (await res.json()) as RunResponse;
      let out = "";
      if (data.stdout) out += data.stdout;
      if (data.stderr) {
        if (out.length > 0) out += "\n";
        out += `stderr:\n${data.stderr}`;
      }
      if (!out) out = `<no output> (exit code ${data.exitCode})`;

      await runAndInsert(out);
    } catch (err: any) {
      await runAndInsert(`Error contacting backend:\n${String(err)}`);
    }
  }
}

class CodeRunnerSettingTab extends PluginSettingTab {
  plugin: CodeRunnerPlugin;

  constructor(app: App, plugin: CodeRunnerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Obsidian Code Runner Settings" });

    new Setting(containerEl)
      .setName("Backend URL")
      .setDesc("Where code execution requests will be sent.")
      .addText((text) =>
        text
          .setPlaceholder("http://localhost:8000/run")
          .setValue(this.plugin.settings.backendUrl)
          .onChange(async (val) => {
            this.plugin.settings.backendUrl = val;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Use Kernel Mode (Python)")
      .setDesc("Keep Python variables alive between runs.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useKernel)
          .onChange(async (value) => {
            this.plugin.settings.useKernel = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable Python")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enablePython)
          .onChange(async (val) => {
            this.plugin.settings.enablePython = val;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable JavaScript")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableJS)
          .onChange(async (val) => {
            this.plugin.settings.enableJS = val;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable LLM / Agent blocks")
      .setDesc("Enable ```llm and ```agent fenced blocks.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableLLM)
          .onChange(async (val) => {
            this.plugin.settings.enableLLM = val;
            await this.plugin.saveSettings();
          })
      );
  }
}
