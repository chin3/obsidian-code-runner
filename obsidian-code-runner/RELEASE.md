# Release Instructions

Quick reference for releasing the Obsidian Code Runner plugin.

## Local Release

```bash
npm run release
```

Creates `release/` folder and `release.zip` with production build.

## GitHub Release

1. **Bump version:**
   ```bash
   npm version patch  # or minor/major
   ```

2. **Tag and push:**
   ```bash
   git push origin main --tags
   ```

3. **Automated:** GitHub Actions builds and creates release automatically

## Files in Release

- `main.js` - Bundled plugin code
- `manifest.json` - Plugin metadata
- `styles.css` - Plugin styles

## Testing

Copy `release/` contents to:
```
YourVault/.obsidian/plugins/obsidian-code-runner/
```

Then restart Obsidian.
