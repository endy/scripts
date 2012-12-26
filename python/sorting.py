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
#   swap_list_items - swap items in a list
#//////////////////////////////////////////////////////////////////////////////////////////////////
def swap_list_items(l, idx1, idx2):
    tmp = l[idx1]
    l[idx1] = l[idx2]
    l[idx2] = tmp

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   quicksort_inplace_bad - first implementation from memory, very poor!
#//////////////////////////////////////////////////////////////////////////////////////////////////
def quicksort_inplace_bad(alist, first, last):

    if (first >= last):
        return

    length = (last - first) + 1

    if length > 2:
        
        pivotIdx = first + (length / 2)
        lowerIdx = first
        upperIdx = pivotIdx+1

        # sort values less than pivot into lower half, values greater into upper half
        while ((lowerIdx < pivotIdx) or (upperIdx < last+1)):
            
            while (lowerIdx < pivotIdx):
                if (alist[lowerIdx] > alist[pivotIdx]):
                    break;
                else:
                    lowerIdx += 1

            while (upperIdx < last+1):
                if (alist[upperIdx] < alist[pivotIdx]):
                    break;
                else:
                    upperIdx += 1
            
            if ((lowerIdx < pivotIdx) and (upperIdx < last+1)):
                # lower and upper are within range, swap them
                #swap_list_items(alist, lowerIdx, upperIdx)
                tmp = alist[lowerIdx]
                alist[lowerIdx] = alist[upperIdx]
                alist[upperIdx] = tmp
            elif (lowerIdx < pivotIdx):
                # only lower is in range
                swap_list_items(alist, lowerIdx, pivotIdx-1)
                swap_list_items(alist, pivotIdx, pivotIdx-1)
                pivotIdx -= 1
            elif (upperIdx < last+1):
                # only upper is in range
                swap_list_items(alist, upperIdx, pivotIdx+1)
                swap_list_items(alist, pivotIdx, pivotIdx+1)
                pivotIdx += 1

        # sort lesser & upper values
        quicksort_inplace_bad(alist, first, pivotIdx-1)
        quicksort_inplace_bad(alist, pivotIdx+1, last)

    else:
        if ((length == 2) and (alist[first] > alist[last])):
            swap_list_items(alist, first, last)

#//////////////////////////////////////////////////////////////////////////////////////////////////
#   quicksort_inplace
#//////////////////////////////////////////////////////////////////////////////////////////////////
def quicksort_inplace(alist, first, last):

    length = (last - first) + 1

    if length > 1 and first < last:
        
        pivotIdx = first
        pivotValue = alist[pivotIdx]
        storeIdx = first

        swap_list_items(alist, pivotIdx, last)

        # sort lists after partition
        for i in range(first, last):
            if (alist[i] < pivotValue):
                swap_list_items(alist, storeIdx, i)
                storeIdx += 1

        swap_list_items(alist, storeIdx, last)

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

#number_list = read_list_from_file('number_list.txt')

orig_list = generate_integer_list(10000, 0, 10000)

list_sort_tester(quicksort_outofplace, "Quicksort_OutOfPlace", orig_list)
print ""
list_sort_tester(quicksort, "Quicksort_Inplace", orig_list)
print ""
list_sort_tester(mergesort, "MergeSort", orig_list)
print ""
list_sort_tester(sorted, "PythonSort", orig_list)

#list_sort_tester(bubblesort, "BubbleSort", orig_list)


