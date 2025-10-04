# --- 1. Data Types ---

# Numbers
a = 10
b = 3.5

# Strings
name = "Ragul"
greeting = f"Hello, {name}!"

# Lists
fruits = ["apple", "banana", "mango"]
fruits.append("orange")

# Tuples (immutable) - ordered, immutable, faster than lists.can have duplicates
dimensions = (1920, 1080)

# Sets (unique values) - unordered, no duplicates
colors = {"red", "blue", "green", "blue"}  # 'blue' appears once

# Dictionaries stores values in key-value pairs
user = {"name": "Ragul", "email": "ragul@example.com"}

# Type casting - manually converting one data type to another
x = int("5")
y = float("3.14")

# --- 2. Conditionals & Loops ---

# Conditionals if, elif, else
if a > 5:
    print("a is greater than 5")
elif a == 5:
    print("a is exactly 5")
else:
    print("a is less than 5")

# For loop - iterate over a sequence (list, tuple, string)
for fruit in fruits:
    print(f"Fruit: {fruit}")

# Looping through dict - iterate over key-value pairs
for key, value in user.items():
    print(f"{key}: {value}")

# While loop
count = 0
while count < 3:
    print("Count is:", count)
    count += 1

# --- 3. Functions ---

def greet(name="Guest"):
    return f"Hello, {name}!"

print(greet("Ragul"))
print(greet())

# Args and Kwargs
#args is used to pass a variable number of arguments to a function.
#kwargs is used to pass a variable number of keyword arguments to a function.
#args returns a tuple and kwargs returns a dictionary.
def print_scores(*scores, **details):
    print("Scores:", scores)
    print("Details:", details)

print_scores(80, 90, 100, subject="Math", level="Advanced")

# Variable scope
total = 0

def add_to_total(x):
    global total
    total += x

add_to_total(5)
print("Total:", total)

# --- 4. List Comprehension ---

# Square numbers
squares = [x**2 for x in range(5)]
print("Squares:", squares)

# Filter even numbers
evens = [x for x in range(10) if x % 2 == 0]
print("Even numbers:", evens)

# Dict comprehension
squares_dict = {x: x**2 for x in range(5)}
print("Squares Dict:", squares_dict)

with open("demo.txt", "w") as f:
    f.write("Hello from FastAPI setup!")

    