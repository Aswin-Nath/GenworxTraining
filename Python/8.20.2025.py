# title
string="takakak"
new_string=string.title()
print(new_string)


# isalnum
k="aafr44"

print(k.isalnum())


# isspace
print(" 1".isspace()," ".isspace())


# join
s1="aswina"
s2="nath"
print(s1.join(s2))
print(s2.join(s1))


# Partition
print(s1.partition("a"))

# left align (here the text are added on left)

print("{:<20}".format("Aswinnath"))

# right align (here the text are added on right)

print("{:>20}".format("Aswinnath"))


# center align (here the text in added in the center)

print("{:^20}".format("Aswinnath"))

# Aswinnath
#            Aswinnath
#      Aswinnath

print("{k} {0}".format(1,k="a"))
# Old version of Formatting
print("%s %d" % ("a",1555))



print("dffrfrfr {:&<20} {:&>30}".format("aswinnath","nathaswin"))