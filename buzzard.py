import argparse
from svgpathtools import Line, QuadraticBezier, CubicBezier, Path, Arc
from svgelements import Path as elPath, Matrix
from freetype import Face #pip install freetype-py
import svgwrite
import bezier #pip install bezier
import numpy as np
import math
import subprocess
import os
import sys

# Takes an x/y tuple and returns a complex number
def tuple_to_imag(t):
    return t[0] + t[1] * 1j

# The freetype library doesn't reliably report the
# bounding box size of a glyph, so instead we figure
# it out and store it here
class boundingBox:
  def __init__(self, xMax, yMax, xMin, yMin):
    self.xMax = xMax
    self.yMax = yMax
    self.xMin = xMin
    self.yMin = yMin

parser = argparse.ArgumentParser(
    description='SparkFun Buzzard Label Generator')
parser.add_argument('labelText', help='Text to write on the label')
parser.add_argument('-f', dest='fontName', default='Roboto',
                    help='Typeface to use when rendering the label')
args = parser.parse_args()

# Set up some variables
dwg = svgwrite.Drawing(filename=os.path.dirname(os.path.abspath(__file__)) + '/text.svg', debug=True)
inString = args.labelText
strIdx = 0
xOffset = 100
yOffset = 0
charSizeX = 8
charSizeY = 8 
baseline = 170
leftCap = ''
rightCap = ''
removeTag = False
glyphBounds = []
finalSegments = []

try:
    face = Face(os.path.dirname(os.path.abspath(__file__)) + '/typeface/' + args.fontName + '.ttf')
    face.set_char_size(charSizeX,charSizeY,200,200)
except:
    print("WARN: No Typeface found with the name " + args.fontName + ".ttf")
    sys.exit(0)  # quit Python

try: 
    table = __import__('typeface.' + args.fontName, globals(), locals(), ['glyphPos'])
    glyphPos = table.glyphPos
    spaceDistance = table.spaceDistance
except:
    glyphPos = 0
    spaceDistance = 60
    print("WARN: No Position Table found for this typeface. Composition will be haphazard at best.")
    pass

# Detect and Remove tag style indicators
if inString[0] == '(':
    leftCap = 'round'
    removeTag = True
elif inString[0] == '[':
    leftCap = 'square'
    removeTag = True
elif inString[0] == '<':
    leftCap = 'pointer'
    removeTag = True
elif inString[0] == '>':
    leftCap = 'flagtail'
    removeTag = True
elif inString[0] == '/':
    leftCap = 'fslash'
    removeTag = True
elif inString[0] == '\\':
    leftCap = 'bslash'
    removeTag = True

if removeTag:
    inString = inString[1:]

removeTag = False

if inString[-1] == ')':
    rightCap = 'round'
    removeTag = True
elif inString[-1] == ']':
    rightCap = 'square'
    removeTag = True
elif inString[-1] == '>':
    rightCap = 'pointer'
    removeTag = True
elif inString[-1] == '<':
    rightCap = 'flagtail'
    removeTag = True
elif inString[-1] == '/':
    rightCap = 'fslash'
    removeTag = True
elif inString[-1] == '\\':
    rightCap = 'bslash'
    removeTag = True    

if removeTag:
    inString = inString[:len(inString)-1]

# Draw and compose the glyph portion of the tag 
for charIdx in range(len(inString)):
    if inString[charIdx] == ' ':
        glyphBounds.append(boundingBox(0,0,0,0))
        xOffset += spaceDistance
        continue
    face.load_char(inString[charIdx])
    outline = face.glyph.outline
    y = [t[1] for t in outline.points]
    # flip the points
    outline_points = [(p[0], max(y) - p[1]) for p in outline.points]
    start, end = 0, 0
    paths = []
    box = 0
    yOffset = 0

    for i in range(len(outline.contours)):
        end = outline.contours[i]
        points = outline_points[start:end + 1]
        points.append(points[0])
        tags = outline.tags[start:end + 1]
        tags.append(tags[0])
        segments = [[points[0], ], ]
        box = boundingBox(points[0][0],points[0][1],points[0][0],points[0][1])
        for j in range(1, len(points)):
            if not tags[j]: # if this point is off-path
                if tags[j-1]: # and the last point was on-path
                    segments[-1].append(points[j]) # toss this point onto the segment
                elif not tags[j-1]: # and the last point was off-path
                    # get center point of two
                    newPoint = ((points[j][0] + points[j-1][0]) / 2.0,
                                (points[j][1] + points[j-1][1]) / 2.0)
                    segments[-1].append(newPoint) # toss this new point onto the segment
                    segments.append([newPoint, points[j], ]) # and start a new segment with the new point and this one
            elif tags[j]: # if this point is on-path
                    segments[-1].append(points[j]) # toss this point onto the segment
                    if  j < (len(points) - 1):
                        segments.append([points[j], ]) # and start a new segment with this point if we're not at the end    

        for segment in segments:
            if len(segment) == 2:
                paths.append(Line(start=tuple_to_imag(segment[0]),
                                end=tuple_to_imag(segment[1])))

            elif len(segment) == 3:
                paths.append(QuadraticBezier(start=tuple_to_imag(segment[0]),
                                            control=tuple_to_imag(segment[1]),
                                            end=tuple_to_imag(segment[2])))
        start = end + 1

    # Derive bounding box
    for segment in paths:
        i = 0
        while i < 10:
            point = segment.point(0.1*i)
            if point.real > box.xMax:
                box.xMax = point.real
            if point.imag > box.yMax:
                box.yMax = point.imag
            if point.real < box.xMin:
                box.xMin = point.real
            if point.imag < box.yMin:
                box.yMin = point.imag
            i += 1

    glyphBounds.append(box)
    path = Path(*paths)
    if glyphPos != 0:
        try:
            xOffset += glyphPos[inString[charIdx]].real
            yOffset = glyphPos[inString[charIdx]].imag
        except: 
            pass
    pathTransform = Matrix.translate(xOffset, baseline+yOffset-box.yMax)
    path = elPath(path.d()) * pathTransform
    path = elPath(path.d())
    finalSegments.append(path)
    xOffset += 30
    if glyphPos != 0:
        try:
            xOffset -= glyphPos[inString[charIdx]].real
        except:
            pass
    xOffset += (glyphBounds[charIdx].xMax - glyphBounds[charIdx].xMin)
    strIdx += 1

if leftCap == '' and rightCap == '':
    for i in range(len(finalSegments)):
        svgObj = dwg.add(dwg.path(finalSegments[i].d()))
        svgObj['fill'] = "#000000"
else:
    #draw the outline of the label as a filled shape and 
    #subtract each latter from it
    tagPaths = []
    if rightCap == 'round':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Arc(start=complex(xOffset,0), radius=complex(100,100), rotation=180, large_arc=1, sweep=1, end=complex(xOffset,200)))
    elif rightCap == 'square':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Line(start=complex(xOffset,0), end=complex(xOffset+50,0)))
        tagPaths.append(Line(start=complex(xOffset+50,0), end=complex(xOffset+50,200)))
        tagPaths.append(Line(start=complex(xOffset+50,200), end=complex(xOffset,200)))        
    elif rightCap == 'pointer':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Line(start=complex(xOffset,0), end=complex(xOffset+100,100)))
        tagPaths.append(Line(start=complex(xOffset+100,100), end=complex(xOffset,200)))
    elif rightCap == 'flagtail':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Line(start=complex(xOffset,0), end=complex(xOffset+100,0)))
        tagPaths.append(Line(start=complex(xOffset+100,0), end=complex(xOffset,100)))
        tagPaths.append(Line(start=complex(xOffset,100), end=complex(xOffset+100,200)))        
        tagPaths.append(Line(start=complex(xOffset+100,200), end=complex(xOffset,200))) 
    elif rightCap == 'fslash':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Line(start=complex(xOffset,0), end=complex(xOffset+100,0)))        
        tagPaths.append(Line(start=complex(xOffset+100,0), end=complex(xOffset,200))) 
    elif rightCap == 'bslash':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Line(start=complex(xOffset,0), end=complex(xOffset+100,200)))        
        tagPaths.append(Line(start=complex(xOffset+100,200), end=complex(xOffset,200))) 
    elif rightCap == '' and leftCap != '':
        tagPaths.append(Line(start=complex(100,0), end=complex(xOffset,0)))
        tagPaths.append(Line(start=complex(xOffset,0), end=complex(xOffset,200)))

    if leftCap == 'round':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Arc(start=complex(100,200), radius=complex(100,100), rotation=180, large_arc=0, sweep=1, end=complex(100,0)))
    elif leftCap == 'square':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Line(start=complex(100,200), end=complex(50,200)))
        tagPaths.append(Line(start=complex(50,200), end=complex(50,0)))
        tagPaths.append(Line(start=complex(50,0), end=complex(100,0)))     
    elif leftCap == 'pointer':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Line(start=complex(100,200), end=complex(0,100)))
        tagPaths.append(Line(start=complex(0,100), end=complex(100,0)))
    elif leftCap == 'flagtail':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Line(start=complex(100,200), end=complex(0,200)))
        tagPaths.append(Line(start=complex(0,200), end=complex(100,100)))
        tagPaths.append(Line(start=complex(100,100), end=complex(0,0)))
        tagPaths.append(Line(start=complex(0,0), end=complex(100,0)))
    elif leftCap == 'fslash':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Line(start=complex(100,200), end=complex(0,200)))
        tagPaths.append(Line(start=complex(0,200), end=complex(100,0)))
    elif leftCap == 'bslash':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Line(start=complex(100,200), end=complex(0,0)))
        tagPaths.append(Line(start=complex(0,0), end=complex(100,0)))
    elif leftCap == '' and rightCap != '':
        tagPaths.append(Line(start=complex(xOffset,200), end=complex(100,200)))
        tagPaths.append(Line(start=complex(100,200), end=complex(100,0)))

    path = Path(*tagPaths)
    for i in range(len(finalSegments)):
        path = elPath(path.d()+" "+finalSegments[i].reverse())
    tagObj = dwg.add(dwg.path(path.d()))
    tagObj['fill'] = "#000000"

dwg['width'] = xOffset+100
dwg['height'] = 250
dwg.save()
#dirpath = os.path.dirname(os.path.abspath(__file__))
#subprocess.call([dirpath + "\\svgtoeagle.py", "text.svg"], shell=True)
#os.remove(dirpath + "\\text.svg")