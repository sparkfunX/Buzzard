from svgpathtools import wsvg, Line, QuadraticBezier, CubicBezier, Path
import bezier
import numpy as np
import math
from freetype import Face

def tuple_to_imag(t):
    return t[0] + t[1] * 1j

#face = Face('./FredokaOne-Regular.ttf')
face = Face('./Roboto.ttf')
face.set_char_size(8,8,300,300)
face.load_char('d')
outline = face.glyph.outline
y = [t[1] for t in outline.points]
# flip the points, why? Dunno, they come in upside-down! 
outline_points = [(p[0], max(y) - p[1]) for p in outline.points]
start, end = 0, 0
paths = []

# Split the contours into points and tags 
# for a given point points[i] then tags[i]
# describes the type of point. A zero means
# it's an off-curve point (such as a control point)
for i in range(len(outline.contours)):
    end = outline.contours[i]
    points = outline_points[start:end + 1]
    points.append(points[0])
    tags = outline.tags[start:end + 1]
    tags.append(tags[0])

    # Split the paths into path segments
    # using their tags. We will treat contours
    # the same way as the TrueType rasterizer,
    # which is to say, any consecutive off-curve
    # points will be understood to imply an 
    # on-curve point interpolated halfway 
    # between them. We need to calculate and insert
    # these implied points.
    segments = [[points[0], ], ]
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

            print('Found Bezier with ' + str(len(segment)) + ' control points. Rendering as a line.')

            paths.append(Line(start=tuple_to_imag(segment[0]),
                              end=tuple_to_imag(segment[1])))
        elif len(segment) == 3:

            print('Found Bezier with ' + str(len(segment)) + ' control points. Rendering as a quadratic.')

            paths.append(QuadraticBezier(start=tuple_to_imag(segment[0]),
                                         control=tuple_to_imag(segment[1]),
                                         end=tuple_to_imag(segment[2])))

        else: 
            print('Found Bezier with ' + str(len(segment)) + ' control points. THIS WASN\'T SUPPOSED TO HAPPEN!!!')
            print(segment)

    start = end + 1

path = Path(*paths)
wsvg(path, filename="text.svg")
