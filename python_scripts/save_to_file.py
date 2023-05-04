import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
import requests
import csv
import wget
import darts
import darts.datasets as dds
import datetime
import os

data = (sys.argv[2])
filename = (sys.argv[1])

print("Printing data to " + filename)

f = open(filename, "w")
f.write(data)
f.close()

print("Data printed")