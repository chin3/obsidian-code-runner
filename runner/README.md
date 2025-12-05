# Code Runner Backend

FastAPI backend server for executing code from the Obsidian Code Runner plugin.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will be available at `http://localhost:8000`.

## API

### POST /run

Execute code in a sandboxed subprocess.

**Request:**
```json
{
  "language": "python",
  "code": "print('hello world')"
}
```

**Response:**
```json
{
  "stdout": "hello world\n",
  "stderr": "",
  "exitCode": 0
}
```

## Supported Languages

- `python` - Executes with `python` command
- `javascript` - Executes with `node` command

## Security Notes

- Code execution is sandboxed in temporary files
- 10 second timeout on all executions
- No persistent state between runs
- Files are cleaned up after execution
