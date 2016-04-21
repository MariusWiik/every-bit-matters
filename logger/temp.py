import pigpio
import DHT22
from datetime import date
import json
from time import sleep
import time


pi = pigpio.pi()
sleeptime = 3
maxtries = 3
#Set up sensor
dht22 = DHT22.sensor(pi, 27)

fileName = 'history.json'

def readDHT():
	#Get new reading
	dht22.trigger()
	#Return results as tuple
	return (dht22.humidity(), dht22.temperature())



#Get a good reading, the first one can be a write off (typically -999)
def getReading():

	counter = 0
	#We cant go forever, so we give it maxtries tries before printing error
	humidity, temperature = readDHT()
	while(temperature < - 30 or temperature > 50):
		counter += 1
		if(counter == maxtries):
			print("error")
			exit()
			
		sleep(sleeptime)
		humidity, temperature = readDHT()
	
	return (humidity, temperature)

def writeToFile(hum, temp):
	with open(fileName, 'r') as file:
		data = json.load(file)
	
	#Get current time
	currTime = int(time.mktime(time.localtime()))
	#Create new dictionary as entry
	newData = {"Temperature": hum, "time": currTime, "Humidity": hum}
	#Append to list
	data.append(newData)
	
	#Slice only the last 48 entries out
	if(len(data) > 50):
		data = data[len(data)-48:len(data)-1]
	
	#Write back to file
	with open(fileName, 'w') as file:
		data = json.dump(data, file, indent = 4)
	
if __name__ == "__main__":
		
	#Get reading
	hum, temp = getReading()
	
	#Write to file
	writeToFile(hum, temp)