from svgpathtools import svg2paths2
from svgelements import Line, QuadraticBezier, CubicBezier, Path, Matrix
import argparse
import math
import os
import sys

SCALE = 1 / 90
SUBSAMPLING = 1  # subsampling of SVG path
SIMPLIFY = 0.1 * SCALE
SIMPLIFYHQ = False
TRACEWIDTH = '0.1'  # in mm
EAGLE_FORMAT = 'board'
COMPILE_LIB = False

# Use Pythagoras to find the distance between two points
def dist(a, b):
    dx = a.real - b.real
    dy = a.imag - b.imag
    return math.sqrt(dx * dx + dy * dy)

# Parse a style tag into a dictionary
def styleParse(attr):
    out = dict()
    i = 0
    for tag in attr.split(';'):
            out[tag.split(':')[0]] = tag.split(':')[1]
            i += 1
    return out

# ray-casting algorithm based on
# http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
def isInside(point, poly):
    x = point.real
    y = point.imag
    inside = False
    i = 0
    j = len(poly) - 1
    while i < len(poly):
        xi = poly[i].real
        yi = poly[i].imag
        xj = poly[j].real
        yj = poly[j].imag
        intersect = ((yi > y) != (yj > y)) and (x < ((xj - xi) * (y - yi) / (yj - yi) + xi))
        if intersect:
            inside = not inside
        j = i
        i += 1
    return inside


# Shoelace Formula without absolute value which returns negative if points are CCW
# https://stackoverflow.com/questions/14505565/detect-if-a-set-of-points-in-an-array-that-are-the-vertices-of-a-complex-polygon
def polygonArea(poly):
    area = 0
    i = 0
    while i < len(poly):
        j = (i + 1) % len(poly)
        area += poly[i].real * poly[j].imag
        area -= poly[j].real * poly[i].imag
        i += 1
    return area / 2


# Move a small distance away from path[idxa] towards path[idxb]
def interpPt(path, idxa, idxb):
    # a fraction of the trace width so we don't get much of a notch in the line

    amt = float(TRACEWIDTH) / 8

    # wrap index
    if idxb < 0:
        idxb += len(path)
    if idxb >= len(path):
        idxb -= len(path)
          
    # get 2 pts
    a = path[idxa]
    b = path[idxb]
    dx = b.real - a.real
    dy = b.imag - a.imag
    d = math.sqrt(dx * dx + dy * dy)
    if amt > d:
        return []  # return nothing - will just end up using the last point
    return complex(a.real + (dx * amt / d), a.imag + (dy * amt / d))


# Some svg paths conatin multiple nested polygons. We need to open them and splice them together.
def unpackPoly(poly):
    # ensure all polys are the right way around
    if args.verbose:
        print('...Unpacking ' + str(len(poly)) + ' Polygons')
    p = 0
    while p < len(poly):
        if polygonArea(poly[p]) > 0:
            poly[p].reverse()
            if args.verbose:
                print('...Polygon #'+str(p)+' was backwards, reversed')
        p += 1

    finalPolys = [poly[0]]

    p = 1
    while p < len(poly):
        path = poly[p]

        outerPolyIndex = 'undefined'
        i = 0
        while i < len(finalPolys):
            if isInside(path[0], finalPolys[i]):
                outerPolyIndex = i
                break
            elif isInside(finalPolys[i][0], path):
                # polys in wrong order - old one is inside new one
                t = path
                path = finalPolys[i]
                finalPolys[i] = t
                outerPolyIndex = i
                break
            i += 1

        if outerPolyIndex != 'undefined':
            path.reverse()  # reverse poly
            outerPoly = finalPolys[outerPolyIndex]
            minDist = 10000000000
            minOuter = 0
            minPath = 0
            a = 0
            while a < len(outerPoly):
                b = 0
                while b < len(path):
                    l = dist(outerPoly[a], path[b])
                    if l < minDist:
                        minDist = l
                        minOuter = a
                        minPath = b
                    b += 1
                a += 1

                # splice the inner poly into the outer poly
                # but we have to recess the two joins a little
                # otherwise Eagle reports Invalid poly when filling
                # the top layer
            finalPolys[outerPolyIndex] = outerPoly[0:minOuter]
            finalPolys[outerPolyIndex].append(interpPt(outerPoly, minOuter, minOuter - 1))
            finalPolys[outerPolyIndex].append(interpPt(path, minPath, minPath + 1))
            finalPolys[outerPolyIndex].extend(path[minPath + 1:])
            finalPolys[outerPolyIndex].extend(path[:minPath])
            finalPolys[outerPolyIndex].append(interpPt(path, minPath, minPath - 1))
            finalPolys[outerPolyIndex].append(interpPt(outerPoly, minOuter, minOuter + 1))    
            finalPolys[outerPolyIndex].extend(outerPoly[minOuter + 1:])      
            
        else:
            # not inside, just add this poly
            finalPolys.append(path)

        p += 1

    #print(finalPolys)
    return finalPolys


def drawSVG(svg_attributes, attributes, paths):

    global SCALE
    global EAGLE_FORMAT
    global SUBSAMPLING
    global SIMPLIFY
    global SIMPLIFYHQ
    global TRACEWIDTH
    global COMPILE_LIB

    out = ''
    svgWidth = 0
    svgHeight = 0

    if args.libMode == 'lib' or args.libMode == 'ls':
        EAGLE_FORMAT = 'library'

    if args.libMode == 'lib':
        COMPILE_LIB = True

    if 'viewBox' in svg_attributes.keys():
        if svg_attributes['viewBox'].split()[2] != '0':
            svgWidth = str(
                round(float(svg_attributes['viewBox'].split()[2]), 2))
            svgHeight = str(
                round(float(svg_attributes['viewBox'].split()[3]), 2))
        else:
            svgWidth = svg_attributes['width']
            svgHeight = svg_attributes['height']
    else:
        svgWidth = svg_attributes['width']
        svgHeight = svg_attributes['height']

    specifiedWidth = svg_attributes['width']
    if 'mm' in specifiedWidth:
        specifiedWidth = float(specifiedWidth.replace('mm', ''))
        SCALE = specifiedWidth / float(svgWidth)
        if args.verbose:
            print("SVG width detected in mm \\o/")
    elif 'in' in specifiedWidth:
        specifiedWidth = float(specifiedWidth.replace('in', '')) * 25.4
        SCALE = specifiedWidth / float(svgWidth)
        if args.verbose:
            print("SVG width detected in inches")
    else:
        SCALE = args.scaleFactor / 157 #157 was found emperically to match 0.04" text by default
        if args.verbose:
            print("SVG width not found, guessing based on scale factor")
        # DO SOMETHING HERE TO ESCAPE AND TELL THE USER THEY'RE BONED

    exportHeight = float(svgHeight) * SCALE

    if EAGLE_FORMAT == "board":
        out += "CHANGE layer " + str(args.eagleLayerNumber) + \
            "; CHANGE rank 3; CHANGE pour solid; SET WIRE_BEND 2;\n"
    if EAGLE_FORMAT == "library":
        out += "CHANGE layer " + str(args.eagleLayerNumber) + \
            "; CHANGE pour solid; Grid mm; SET WIRE_BEND 2;\n"

    if len(paths) == 0:
        print("No paths found. Did you use 'Object to path' in Inkscape?")
    anyVisiblePaths = False

    i = 0
    while i < len(paths):
        #path = paths[i]

        if args.verbose:
            print('Translating Path ' + str(i+1) + ' of ' + str(len(paths)))

        # Apply the tranform from this svg object to actually transform the points
        # We need the Matrix object from svgelements but we can only matrix multiply with
        # svgelements' version of the Path object so we're gonna do some dumb stuff
        # to launder the Path object from svgpathtools through a d-string into 
        # svgelements' version of Path. Luckily, the Path object from svgelements has 
        # backwards compatible .point methods
        pathTransform = Matrix('')
        if 'transform' in attributes[i].keys():
            pathTransform = Matrix(attributes[i]['transform'])
            if args.verbose:
                print('...Applying Transforms')
        path = Path(paths[i].d()) * pathTransform
        path = Path(path.d())

        style = 0

        if 'style' in attributes[i].keys():
            style = styleParse(attributes[i]['style'])

        if 'fill' in attributes[i].keys():
            filled = attributes[i]['fill'] != 'none' and attributes[i]['fill'] != ''
        elif 'style' in attributes[i].keys():
            filled = style['fill'] != 'none' and style['fill'] != ''
        else:
            filled = False

        if 'stroke' in attributes[i].keys():
            stroked = attributes[i]['stroke'] != 'none' and attributes[i]['stroke'] != ''
        elif 'style' in attributes[i].keys():
            stroked = style['stroke'] != 'none' and style['stroke'] != ''
        else:
            stroked = False

        if not filled and not stroked:
            i += 1
            continue  # not drawable (clip path?)


        SUBSAMPLING = args.subSampling
        TRACEWIDTH = str(args.traceWidth)
        anyVisiblePaths = True
        l = path.length()
        divs = round(l * SUBSAMPLING)
        if divs < 3:
            divs = 3
        maxLen = l * 2 * SCALE / divs
        p = path.point(0)
        p = complex(p.real * SCALE, p.imag * SCALE)
        last = p
        polys = []
        points = []
        s = 0
        while s <= divs:
            p = path.point(s * 1 / divs)
            p = complex(p.real * SCALE, p.imag * SCALE)
            if dist(p, last) > maxLen:
                if len(points) > 1:
                    points = simplify(points, SIMPLIFY, SIMPLIFYHQ)
                    polys.append(points)

                points = [p]
            else:
                points.append(p)

            last = p
            s += 1

        if len(points) > 1:
            points = simplify(points, SIMPLIFY, SIMPLIFYHQ)
            polys.append(points)

        if filled:
            polys = unpackPoly(polys)

        for points in polys:

            if len(points) < 2:
                return
                
            scriptLine = ''
            if filled:
                # re-add final point so we loop around
                points.append(points[0])

                if EAGLE_FORMAT == "board":
                    scriptLine += "polygon " + args.signalName + " " + TRACEWIDTH + "mm "

                if EAGLE_FORMAT == "library":
                    scriptLine += "polygon " + TRACEWIDTH + "mm "

            else:
                if EAGLE_FORMAT == "board":
                    scriptLine += "polygon " + args.signalName + " " + TRACEWIDTH + "mm "

                if EAGLE_FORMAT == "library":
                    scriptLine += "polygon " + TRACEWIDTH + "mm "

            for p in points:
                precisionX = '{0:.2f}'.format(round(p.real, 6))
                precisionY = '{0:.2f}'.format(round(exportHeight - p.imag, 6))
                scriptLine += '(' + precisionX + 'mm ' + precisionY + 'mm) '

            scriptLine += ';'
            #print(scriptLine)
            out += scriptLine + '\n'

        i += 1

    if not anyVisiblePaths:
        print("No paths with fills or strokes found.")

    return out


def convert(filename):

    paths, attributes, svg_attributes = svg2paths2(filename)

    path_to_script = os.path.dirname(os.path.abspath(__file__))

    if not COMPILE_LIB:

        try:
            f = open(path_to_script + "/output.scr", 'w')
            f.write(drawSVG(svg_attributes, attributes, paths))
            f.close

        except:
            print("Failed to create output file")
            sys.exit(0)  # quit Python

    else:

         try:
            f = open(path_to_script + "/output.lbr", 'w')
            f.write(writeLib(drawSVG(svg_attributes, attributes, paths)))
            f.close

        except:
            print("Failed to create output file")
            sys.exit(0)  # quit Python       

def writeLib(scriptString):

    

####################
# SIMPLIFY
####################

# square distance from a point to a segment


def getSqSegDist(p, p1, p2):

    x = p1.real
    y = p1.imag
    dx = p2.real - x
    dy = p2.imag - y

    if dx != 0 or dy != 0:

        t = ((p.real - x) * dx + (p.imag - y) * dy) / (dx * dx + dy * dy)

        if (t > 1):
            x = p2.real
            y = p2.imag

        elif (t > 0):
            x += dx * t
            y += dy * t

    dx = p.real - x
    dy = p.imag - y

    return dx * dx + dy * dy


# basic distance-based simplification
def simplifyRadialDist(points, sqTolerance):

    prevPoint = points[0]
    newPoints = [prevPoint]

    i = 1
    leng = len(points)

    while i < leng:
        point = points[i]

        if dist(point, prevPoint) > sqTolerance:
            newPoints.append(point)
            prevPoint = point

        i += 1

    if prevPoint != point:
        newPoints.append(point)

    return newPoints


# simplification using optimized Douglas-Peucker algorithm with recursion elimination
def simplifyDouglasPeucker(points, sqTolerance):

    leng = len(points)
    markers = [''] * leng
    first = 0
    last = leng - 1
    stack = []
    newPoints = []

    markers[first] = markers[last] = 1

    while last:

        maxSqDist = 0

        i = first + 1
        while i < last:
            sqDist = getSqSegDist(points[i], points[first], points[last])

            if sqDist > maxSqDist:
                index = i
                maxSqDist = sqDist

            i += 1

        if maxSqDist > sqTolerance:
            markers[index] = 1
            stack.extend([first, index, index, last])

        if stack:
            last = stack.pop()
            first = stack.pop()
        else:
            break

    i = 0
    while i < leng:
        if markers[i]:
            newPoints.append(points[i])
        i += 1

    return newPoints


# both algorithms combined for awesome performance
def simplify(points, tolerance, highestQuality):

    sqTolerance = tolerance * tolerance if tolerance != '' else 1

    points = points if highestQuality else simplifyRadialDist(
        points, sqTolerance)

    points = simplifyDouglasPeucker(points, sqTolerance)

    return points


# ******************************************************************************
#
# Main program flow
#
# ******************************************************************************
if __name__ == '__main__':

    parser = argparse.ArgumentParser(
        description='SparkFun Buzzard Label Generator')

    parser.add_argument('fileToConvert', help='SVG file to convert')

    parser.add_argument('-s', dest='scaleFactor', default=1,
                        type=float, help='Scale factor. Larger')

    parser.add_argument('-l', dest='eagleLayerNumber', default=21,
                        type=int, help='Layer in EAGLE to create label into (default is tPlace)')

    parser.add_argument('-v', dest='verbose', default=False,
                        help='Verbose mode', action='store_true')

    parser.add_argument('-o', dest='outMode', default='board',
                        help='Output Mode (\'b\'=board script, \'ls\'=library script, \'lib\'=library file)')

    parser.add_argument('-n', dest='signalName', default='GND',
                        help='Signal name for polygon. Required if layer is not 21 (default is \'GND\')')
    
    parser.add_argument('-u', dest='subSampling', default=0.1,
                        type=float, help='Subsampling Rate')  

    parser.add_argument('-t', dest='traceWidth', default=0.03,
                        type=float, help='traceWidth in mm') 

    args = parser.parse_args()

    convert(args.fileToConvert)