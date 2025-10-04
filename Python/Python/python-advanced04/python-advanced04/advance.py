# --- 1. Type Hints ---
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("Ragul"))

# --- 2. Context Managers ---
class MyResource:
    def __enter__(self):
        print("[ENTER] Resource opened")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("[EXIT] Resource closed")

    def process(self):
        print("Processing resource")

with MyResource() as r:
    r.process()

# --- 3. __main__ and __init__ Imports ---
# Simulated example for __name__ == '__main__'
def main():
    print("This runs only when the file is executed directly")

if __name__ == '__main__':
    main()

# --- 4. Generators and Iterators ---
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for i in countdown(3):
    print("Yielded:", i)

# Iterator example
my_list = [1, 2, 3]
my_iter = iter(my_list)
print(next(my_iter))  # 1
print(next(my_iter))  # 2
print(next(my_iter))  # 3

# --- 5. Datetime and Timezone Handling ---
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

now = datetime.now()
print("Now:", now.strftime("%Y-%m-%d %H:%M:%S"))

india_time = datetime.now(ZoneInfo("Asia/Kolkata"))
print("India time:", india_time)

dt1 = datetime(2025, 6, 23, 20, 0)
dt2 = datetime(2025, 6, 23, 22, 0)
diff = dt2 - dt1
print("Time difference in seconds:", diff.total_seconds())

# --- 6. JSON Handling ---
import json
user = {"name": "Ragul", "age": 25}
json_str = json.dumps(user)
print("JSON string:", json_str)

user_dict = json.loads(json_str)
print("Parsed JSON:", user_dict["name"])

# --- 7. API Handling with requests ---
import requests
response = requests.get("https://jsonplaceholder.typicode.com/users/1")
data = response.json()
print("User from API:", data["name"])

payload = {"name": "Ragul", "role": "dev"}
res = requests.post("https://httpbin.org/post", json=payload)
print("POST status:", res.status_code)
print("POST response:", res.json()["json"])

# --- 8. Custom Exceptions ---
class InvalidPromptError(Exception):
    def __init__(self, prompt):
        self.prompt = prompt
        super().__init__(f"Invalid prompt: '{prompt}' is not allowed")

try:
    raise InvalidPromptError("")
except InvalidPromptError as e:
    print("Caught custom error:", e)
