# Testing Nested Code Block Fixes

## What Was Fixed

### Changes Made to `main.ts`:

1. **Reading Mode (`enhanceCodeBlocks`)**: Changed selector from `"pre > code"` to `"pre code"` to catch nested blocks
2. **Reading Mode (`styleOutputBlocks`)**: Same selector change for output blocks
3. **Language Normalization**: Added `.trim()` to all language string extraction to handle whitespace
4. **Edit Mode**: Added comments explaining nested block handling
5. **Error Messages**: Improved error message to show detected language: `Language '${language}' not supported`

## How to Test

### Step 1: Reload the Plugin in Obsidian

1. Open Obsidian
2. Press `Ctrl+R` (Windows) or `Cmd+R` (Mac) to hard reload
3. **OR** go to Settings → Community Plugins → Code Runner → Toggle OFF then ON

### Step 2: Start the Backend (if not running)

```bash
cd c:\Users\Natha\Projects\obsidian-plugins\runner
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Step 3: Open Test File

Open [NESTED_BLOCKS_TEST.md](file:///c:/Users/Natha/Projects/obsidian-plugins/NESTED_BLOCKS_TEST.md) in Obsidian

---

## Test Cases

### ✅ Test 1: Code in Blockquote (Reading Mode)

1. Switch to **Reading Mode**
2. Scroll to "Test Case 1: Code Block in Blockquote"
3. **Expected**: Run button should appear above the Python code block
4. Click **▶ Run**
5. **Expected**: Output shows "hello from blockquote"

### ✅ Test 2: Code in Blockquote (Edit Mode)

1. Switch to **Edit Mode**
2. Place cursor inside the Python code in the blockquote (line with `print("hello from blockquote")`)
3. Press `Ctrl+Shift+Enter` (Windows) or `Cmd+Shift+Enter` (Mac)
4. **Expected**: Output block appears below with "hello from blockquote"
5. **Expected**: NO error message about "language not supported"

### ✅ Test 3: Code in Unordered List (Reading Mode)

1. Switch to **Reading Mode**
2. Scroll to "Test Case 2: Code Block in Unordered List"
3. **Expected**: Run button appears for the Python code
4. Click Run
5. **Expected**: Output shows "hello from list"

### ✅ Test 4: Code in Unordered List (Edit Mode)

1. Switch to **Edit Mode**
2. Place cursor in the nested Python block
3. Press `Ctrl+Shift+Enter`
4. **Expected**: Executes successfully

### ✅ Test 5: Code in Ordered List

Repeat Tests 3 & 4 for "Test Case 3: Code Block in Ordered List"

### ✅ Test 6: Deeply Nested (Blockquote + List)

Test "Test Case 4: Deeply Nested" in both Reading and Edit modes

### ✅ Test 7: JavaScript in List

Test "Test Case 5: JavaScript in List" - verify JS execution works

### ✅ Test 8: LLM in Blockquote (Optional)

If LLM is enabled, test "Test Case 6: LLM in Blockquote"

---

## Regression Testing

### Verify Normal Blocks Still Work

Test a regular (non-nested) block to ensure we didn't break existing functionality:

```python
print("regular block test")
```

1. Test in Reading Mode (Run button should appear)
2. Test in Edit Mode (Ctrl+Shift+Enter should work)

---

## Success Criteria

- [ ] All nested blocks show Run button in Reading Mode
- [ ] All nested blocks execute in Edit Mode via keyboard shortcut
- [ ] No "language not supported" errors for Python/JS blocks
- [ ] If error occurs, it shows the detected language clearly
- [ ] Regular (non-nested) blocks still work
- [ ] Output blocks appear correctly for both nested and regular blocks

---

## Troubleshooting

### If Run Button Still Doesn't Appear in Reading Mode:

1. Check browser console for errors (Ctrl+Shift+I / Cmd+Option+I)
2. Verify plugin was reloaded
3. Try rebuilding: `cd obsidian-code-runner && npm run build`
4. Hard reload Obsidian

### If Edit Mode Still Fails:

1. Check the exact error message - it should now show the detected language
2. Verify cursor is inside the code block when pressing the shortcut
3. Check that the language is actually Python or JavaScript
4. Verify backend is running on `localhost:8000`

---

## Expected Results

**Before Fix:**
- ❌ Nested blocks: NO Run button
- ❌ Edit mode: "language not supported" error

**After Fix:**
- ✅ Nested blocks: Run button appears
- ✅ Edit mode: Executes successfully
- ✅ Better error messages if language is truly unsupported
