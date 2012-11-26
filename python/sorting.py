#//////////////////////////////////////////////////////////////////////////////////////////////////
#
#   Copyright 2012, Brandon Light
#   All rights reserved.
#
#//////////////////////////////////////////////////////////////////////////////////////////////////

import tokenize as t
import StringIO
import random

# default seed
random.seed(0)

#//////////////////////////////////////////////////////////////////////////////////////////////////
# read_list_from_file - Read a list from a file, storing the numbers in a list
#//////////////////////////////////////////////////////////////////////////////////////////////////
def read_list_from_file(listfile):
    number_list = []

    f = open(listfile, 'r')
    numberString = f.read().rstrip("\n\r")
    f.close()

    g = t.generate_tokens(StringIO.StringIO(numberString).readline)
    for toktype, tokval, _, _, _ in g:
        if toktype == t.NUMBER:
            number_list.append(int(tokval))

    return number_list

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   generate_integer_list - Generate a list of integers
#//////////////////////////////////////////////////////////////////////////////////////////////////
def generate_integer_list(itemCount, intMin, intMax):
    number_list = []
    while itemCount > 0:
        number_list.append(random.randint(intMin, intMax))
        itemCount -= 1
    return number_list



#//////////////////////////////////////////////////////////////////////////////////////////////////
#   is_sorted - return TRUE if list is sorted, FALSE otherwise
#//////////////////////////////////////////////////////////////////////////////////////////////////
def is_sorted(in_list):
    listLength = len(in_list)

    if listLength != 1:
        for index in range(1, listLength):
            if in_list[index-1] > in_list[index]:
                return False

    return True

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   mergesort - sorts a list of integers using recursion
#//////////////////////////////////////////////////////////////////////////////////////////////////
def mergesort(unsorted_list):

    sorted_list = []
    length = len(unsorted_list)

    if length > 1:
        lowpart = mergesort(unsorted_list[:length/2:])
        highpart = mergesort(unsorted_list[(length/2):length:])
    
        while (len(lowpart) > 0) or (len(highpart) > 0):
            if len(lowpart) == 0:
                sorted_list.extend(highpart)
                highpart = []
            elif len(highpart) == 0:
                sorted_list.extend(lowpart)
                lowpart = []
            elif lowpart[0] <= highpart[0]:
                sorted_list.append(lowpart[0])
                lowpart.pop(0)
            else:
                sorted_list.append(highpart[0])
                highpart.pop(0)
    else:
        sorted_list = unsorted_list

    return sorted_list


#//////////////////////////////////////////////////////////////////////////////////////////////////
#
#   MAIN
#
#//////////////////////////////////////////////////////////////////////////////////////////////////

#number_list = read_list_from_file('number_list.txt')


orig_list = generate_integer_list(1000, 0, 1000)

print "Is Sorted: " + str(is_sorted(orig_list))

sorted_list = mergesort(orig_list)
print "Sort called"

print "Is Sorted: " + str(is_sorted(sorted_list))

liststr = "Unsorted List: "

for item in orig_list:
    liststr = liststr + str(item) + " "

print liststr

liststr = "Sorted List:   "

for item in sorted_list:
    liststr = liststr + str(item) + " "

print liststr








