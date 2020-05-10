import argparse
from svgpathtools import wsvg, Line, QuadraticBezier, CubicBezier, Path
from freetype import Face
import svgwrite
import bezier
import numpy as np
import math

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

# 
dwg = svgwrite.Drawing(filename='text.svg', debug=True)
inString = 'helloworld!'
xOffset = 0
strIdx = 0
charSizeX = 8
charSizeY = 8 
glyphBounds = []
face = Face('./Roboto.ttf')
#face = Face('./FredokaOne-Regular.ttf')
face.set_char_size(charSizeX,charSizeY,200,200)

for charIdx in range(len(inString)):
    face.load_char(inString[charIdx])
    outline = face.glyph.outline
    y = [t[1] for t in outline.points]
    # flip the points
    outline_points = [(p[0], max(y) - p[1]) for p in outline.points]
    start, end = 0, 0
    paths = []
    box = 0

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
                #print('Found Bezier with ' + str(len(segment)) + ' control points. Rendering as a line.')
                paths.append(Line(start=tuple_to_imag(segment[0]),
                                end=tuple_to_imag(segment[1])))

            elif len(segment) == 3:
                #print('Found Bezier with ' + str(len(segment)) + ' control points. Rendering as a quadratic.')
                paths.append(QuadraticBezier(start=tuple_to_imag(segment[0]),
                                            control=tuple_to_imag(segment[1]),
                                            end=tuple_to_imag(segment[2])))
            #else: 
                #print('Found Bezier with ' + str(len(segment)) + ' control points. THIS WASN\'T SUPPOSED TO HAPPEN!!!')
                #print(segment)

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
    pathObj = dwg.add(dwg.path(path.d()))
    pathObj.translate(xOffset)
    pathObj['fill'] = "#000000"
    xOffset += 30
    xOffset += (glyphBounds[charIdx].xMax - glyphBounds[charIdx].xMin)
    #print('Width of glyph \"' + inString[charIdx] + '\" is ' + str((glyphBounds[charIdx].xMax - glyphBounds[charIdx].xMin)))
    strIdx += 1

dwg['width'] = xOffset
dwg['height'] = 200
dwg.save()

# ******************************************************************************
#
# Main program flow
#
# ******************************************************************************
#if __name__ == '__main__':

#    parser = argparse.ArgumentParser(
#        description='SparkFun Buzzard Label Generator')

 #   parser.add_argument('fileToConvert', help='SVG file to convert')

 #   parser.add_argument('-s', dest='scaleFactor', default=300.0,
                        #type=float, help='Scale factor. Larger')

 #   parser.add_argument('-l', dest='eagleLayerNumber', default=21,
                        #type=int, help='Layer in EAGLE to create label into (default is tPlace)')

 #   parser.add_argument('-n', dest='signalName', default='GND',
                       # help='Signal name for polygon. Required if layer is not 21 (default is \'GND\')')

  #  args = parser.parse_args()

  #  convert(args.fileToConvert)