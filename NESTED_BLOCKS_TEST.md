# Nested Code Block Testing

## Test Case 1: Code Block in Blockquote

> Here is a test in a blockquote:
> 
> ```python
> print("hello from blockquote")
> ```

## Test Case 2: Code Block in Unordered List

- List item 1
- List item with code:
  
  ```python
  print("hello from list")
  ```

- List item 3

## Test Case 3: Code Block in Ordered List

1. First item
2. Second item with code:
   
   ```python
   print("hello from ordered list")
   ```

3. Third item

## Test Case 4: Deeply Nested

> - Inside blockquote and list:
>   
>   ```python
>   print("deeply nested")
>   ```

## Test Case 5: JavaScript in List

- JavaScript test:
  
  ```javascript
  console.log("hello from JS in list");
  ```

## Test Case 6: LLM in Blockquote

> LLM test:
> 
> ```llm
> What is 2+2?
> ```

## Expected Behavior

- ✅ All code blocks should show Run button in Reading Mode
- ✅ All code blocks should execute with Cmd/Ctrl+Shift+Enter in Edit Mode
- ❌ Currently: Nested blocks don't work
