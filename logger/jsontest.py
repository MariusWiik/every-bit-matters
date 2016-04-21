#!/usr/bin/env python3

from random import randint
from time import sleep
import time
import json
import sys

#Going to hold all objects before writing to file
objlist = []

filename = "testData.json"

def getValues(num):
    #Create random values for humidity and temperature
    humidity = randint(40, 90)
    temp = randint(-5, 10)

    #Get time since epoch, local time, typecast to int
    currTime = int(time.mktime(time.localtime()))
    #Calculate offset, go "num" number of times one hour back
    currTime = currTime - (num * 3600)

    #Create jSON object
    obj = {"time" : currTime, "Temperature" : temp, "Humidity": humidity}
    
    #Append to list
    objlist.append(obj)


if __name__ == "__main__":
    if(len(sys.argv) != 2):
        print("Usage: {} <number of hours to go back>".format(__file__) )
        exit()
    else:
        num = int(sys.argv[1])
        #Generate data
        for x in range(0, num+1):
            getValues(x)
        
        #Write data to a file
        with open(filename, 'w') as file:
            json.dump(objlist, file, indent=4)
        
        #Print OK
        print("Done")