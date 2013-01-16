#//////////////////////////////////////////////////////////////////////////////////////////////////
#
#   Copyright 2012, Brandon Light
#   All rights reserved.
#
#//////////////////////////////////////////////////////////////////////////////////////////////////

import tokenize as t
import StringIO
import random
import time

import sys
import dis

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
#   quicksort_outofplace
#//////////////////////////////////////////////////////////////////////////////////////////////////
def quicksort_outofplace(unsorted_list):

    sorted_list = []

    if len(unsorted_list) > 1:
        lowerlist = []
        upperlist = []
        
        pivot = unsorted_list[0]
    
        for index in range(1, len(unsorted_list)):
            if (unsorted_list[index] <= pivot):
                lowerlist.append(unsorted_list[index])
            else:
                upperlist.append(unsorted_list[index])
    
        sorted_list = quicksort_outofplace(lowerlist)
        sorted_list.append(pivot)
        sorted_list.extend(quicksort_outofplace(upperlist))
    else:
        sorted_list = unsorted_list

    return sorted_list

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   quicksort_inplace
#//////////////////////////////////////////////////////////////////////////////////////////////////
def quicksort_inplace(alist, first, last):

    length = (last - first) + 1

    if length > 1 and first < last:
        
        storeIdx = first
        pivotValue = alist[storeIdx]
        alist[storeIdx], alist[last] = alist[last], alist[storeIdx]

        # sort lists after partition
        for i in range(first, last):
            if (alist[i] < pivotValue):
                alist[storeIdx], alist[i] = alist[i], alist[storeIdx]
                storeIdx += 1

        alist[storeIdx], alist[last] = alist[last], alist[storeIdx]

        # sort lesser & upper partitions
        quicksort_inplace(alist, first, storeIdx-1)
        quicksort_inplace(alist, storeIdx+1, last)

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   quicksort - calls quicksort_inplace, has different prototype so all sorting calls can 
#               be uniform
#//////////////////////////////////////////////////////////////////////////////////////////////////
def quicksort(alist):
    quicksort_inplace(alist, 0, len(alist)-1)
    return alist

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   bubblesort
#//////////////////////////////////////////////////////////////////////////////////////////////////
def bubblesort(unsorted_list):

    print "BubbleSort: Not Implemented!"
    sorted_list = unsorted_list

    return sorted_list


#//////////////////////////////////////////////////////////////////////////////////////////////////
#   list_to_string
#//////////////////////////////////////////////////////////////////////////////////////////////////
def list_to_string(l):
    liststr = ""
    for item in l:
        liststr = liststr + str(item) + " "

    return liststr


#//////////////////////////////////////////////////////////////////////////////////////////////////
#   list_sort_tester
#//////////////////////////////////////////////////////////////////////////////////////////////////
def list_sort_tester(sort_func, sort_method_name, unsorted_list):
    print sort_method_name
    print "Is Sorted(" + str(len(unsorted_list)) + " items): " + str(is_sorted(unsorted_list))

    sorted_list = unsorted_list[:]
    start = time.clock()
    sorted_list = sort_func(sorted_list)
    elapsed = time.clock() - start


    print sort_method_name + " called (" + str(round(elapsed*1000, 3)) + " ms elapsed)"

    print "Is Sorted(" + str(len(sorted_list)) + " items): " + str(is_sorted(sorted_list))

    #print "Unsorted List: " + list_to_string(unsorted_list)
    #print "Sorted List:   " + list_to_string(sorted_list)


#//////////////////////////////////////////////////////////////////////////////////////////////////
#
#   MAIN
#
#//////////////////////////////////////////////////////////////////////////////////////////////////

orig_list = generate_integer_list(10000, 0, 10000)

list_sort_tester(quicksort_outofplace, "Quicksort_OutOfPlace", orig_list)
print ""
list_sort_tester(quicksort, "Quicksort_Inplace", orig_list)
print ""
list_sort_tester(mergesort, "MergeSort", orig_list)
print ""
list_sort_tester(sorted, "PythonSort", orig_list)


#sys.stdout = open('quicksort_inplace2.txt', 'w')
#dis.dis(quicksort_inplace)

#sys.stdout = open('quicksort_outofplace.txt', 'w')
#dis.dis(quicksort_outofplace)

#sys.stdout = sys.__stdout__

#list_sort_tester(bubblesort, "BubbleSort", orig_list)


