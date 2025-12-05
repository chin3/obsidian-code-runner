# Adding Donation Button Implementation

## Quick Implementation

Add to your settings tab in `main.ts`:

```typescript
// Add after the LLM Configuration section, before closing the display() method

// Support Section
containerEl.createEl("h3", { text: "Support Development" });

containerEl.createEl("p", {
  text: "If Code Runner saves you time, consider buying me a coffee!",
  cls: "setting-item-description"
});

new Setting(containerEl)
  .setName("💝 Support This Project")
  .setDesc("Every contribution helps keep this project alive!")
  .addButton((button) =>
    button
      .setButtonText("☕ Buy me a coffee")
      .setCta()
      .onClick(() => {
        window.open("https://ko-fi.com/yourname", "_blank");
      })
  )
  .addButton((button) =>
    button
      .setButtonText("⭐ Star on GitHub")
      .onClick(() => {
        window.open("https://github.com/yourname/obsidian-code-runner", "_blank");
      })
  );
```

## Ko-fi Setup Steps

1. **Create Ko-fi Account**
   - Go to [ko-fi.com](https://ko-fi.com)
   - Sign up
   - Create page
   - Get your URL: `https://ko-fi.com/yourname`

2. **Update Plugin**
   - Replace `yourname` with your Ko-fi username
   - Add GitHub repo URL

3. **Optional: GitHub Sponsors**
   - Set up at [github.com/sponsors](https://github.com/sponsors)
   - Add second button for sponsors

## Full Implementation

### In `main.ts` (add to `CodeRunnerSettingTab.display()`):

```typescript
// ... after LLM Configuration section ...

// Divider
containerEl.createEl("hr");

// Support Section
const supportHeader = containerEl.createEl("h3", { text: "💝 Support Development" });
supportHeader.style.marginTop = "1.5em";

const supportDesc = containerEl.createEl("p", {
  text: "Code Runner is free and open source. If it's useful to you, consider supporting its development!",
});
supportDesc.style.opacity = "0.8";
supportDesc.style.marginBottom = "1em";

new Setting(containerEl)
  .setName("Buy me a coffee")
  .setDesc("One-time support via Ko-fi")
  .addButton((button) =>
    button
      .setButtonText("☕ Donate")
      .setCta()
      .onClick(() => {
        window.open("https://ko-fi.com/yourname", "_blank");
      })
  );

new Setting(containerEl)
  .setName("Become a sponsor")
  .setDesc("Monthly support via GitHub Sponsors")
  .addButton((button) =>
    button
      .setButtonText("❤️ Sponsor")
      .onClick(() => {
        window.open("https://github.com/sponsors/yourname", "_blank");
      })
  );

new Setting(containerEl)
  .setName("Star on GitHub")
  .setDesc("Show your support with a ⭐")
  .addButton((button) =>
    button
      .setButtonText("⭐ Star")
      .onClick(() => {
        window.open("https://github.com/yourname/obsidian-code-runner", "_blank");
      })
  );
```

## In README.md

```markdown
## 💝 Support This Project

Code Runner is free and open source. If it saves you time, consider supporting!

**Ways to Support:**
- ☕ [Buy me a coffee](https://ko-fi.com/yourname) - One-time donation
- ❤️ [Become a sponsor](https://github.com/sponsors/yourname) - Monthly support
- ⭐ [Star this repo](https://github.com/yourname/obsidian-code-runner) - Show appreciation
- 📢 Share with friends - Spread the word!
- 🐛 Report bugs - Help improve the plugin
- 💡 Suggest features - Shape the roadmap

Every contribution, big or small, helps keep this project alive and growing! 🙏
```

## Ethical Considerations

### ✅ DO:
- Be genuine about why you need support
- Thank contributors publicly
- Keep core features free
- Be transparent about costs
- Deliver value first

### ❌ DON'T:
- Guilt trip users
- Paywall basic features without warning
- Spam donation requests
- Make promises you can't keep

## Analytics (Optional)

Track clicks:

```typescript
.onClick(() => {
  // Optional: Track with simple counter
  console.log("Donation button clicked");
  window.open("https://ko-fi.com/yourname", "_blank");
})
```

## Next Steps

1. ✅ Create Ko-fi account
2. ✅ Add donation button to settings
3. ✅ Update README
4. ✅ (Optional) Set up GitHub Sponsors
5. ✅ Share your Ko-fi on social media
