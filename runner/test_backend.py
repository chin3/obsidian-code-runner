import requests
import json

# Test the backend is running and working
url = "http://localhost:8000/run"

# Test Python execution
print("Testing Python execution...")
python_request = {
    "language": "python",
    "code": "print('Hello from Python!')\nprint(5 + 3)"
}

try:
    response = requests.post(url, json=python_request)
    print(f"Status: {response.status_code}")
    result = response.json()
    print("Response:")
    print(json.dumps(result, indent=2))
    print()
except Exception as e:
    print(f"Error: {e}")
    print("Make sure the server is running: uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
    print()

# Test JavaScript execution
print("Testing JavaScript execution...")
js_request = {
    "language": "javascript",
    "code": "console.log('Hello from JS!');\nconsole.log(10 * 2);"
}

try:
    response = requests.post(url, json=js_request)
    print(f"Status: {response.status_code}")
    result = response.json()
    print("Response:")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
