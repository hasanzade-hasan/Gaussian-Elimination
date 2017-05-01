#!/usr/bin/python

import random
import sys

def generate(x,y, output):
  f = open(output, "w")
  for i in range(x):
      for j in range(y):
          randcoeff = random.randrange(-10000, 10000)
          f.write(str((float)(randcoeff)/100))
          if j != y-1:
            f.write(" ")
      f.write("\n")
  f.close()


if __name__ == "__main__":
    output = str(sys.argv[1])
    x = int(sys.argv[2])
    y = int(sys.argv[3])
    generate(x, y, output)

