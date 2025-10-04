from utils.utils_inter import greet

#decorator
# def my_decorator(func):          # outer function receives the function
#     def wrapper():               # inner function wraps the logic
#         print("Before the function runs")
#         func()                   # call the original function
#         print("After the function runs")
#     return wrapper               # return the wrapped version
# --- 1. Decorator Example ---
def logger(func):
    def wrapper():
        print("[LOG] Before function call")
        func()
        print("[LOG] After function call")
    return wrapper

@logger
def greeting():
    print("Hello from decorated function!")

greeting()


# --- 2. Lambda Functions ---
add = lambda a, b: a + b
print("Lambda Add:", add(5, 3))


nums = [1, 2, 3, 4, 5, 6]
squares = list(map(lambda x: x**2, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))

print("Squares:", squares)
print("Evens:", evens)



users = [("Ragul", 25), ("Ajay", 20), ("Deepa", 30)]
sorted_users = sorted(users, key=lambda x: x[1])
print("Sorted Users:", sorted_users)


# --- 3. Modules & Packages ---

print(greet("Ragul is called separate module"))


# --- 4. File Handling ---
# Write to file
with open("demo_file.txt", "w") as f:
    f.write("This is a file write test.\n")

# Read from file
with open("demo_file.txt", "r") as f:
    content = f.read()
    print("File content:", content)


# --- 5. Virtual Environments & Requirements ---
# No code to run here, but remember:
# python3 -m venv venv
# source venv/bin/activate (mac)  (or venv\Scripts\activate on Windows)
# pip install <package>
# pip freeze > requirements.txt









