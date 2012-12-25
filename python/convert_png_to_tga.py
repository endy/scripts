
import os
import subprocess

command = "convert"

filelist = os.listdir('.')

for eachPng in filelist:
	if eachPng.endswith(".png"):
		#print eachFile.upper().lower()
		#print eachFile.replace(".png", ".tga")
		subprocess.call([command, eachPng, eachPng.replace(".png", ".tga")], shell=False)


