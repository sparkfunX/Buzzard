from svgpathtools import wsvg, Line, QuadraticBezier, CubicBezier, Path
import bezier
import numpy as np
import math
from freetype import Face


def tuple_to_imag(t):
    return t[0] + t[1] * 1j

def extrapolate(a,b):
    return complex((b.real-(a.real-b.real)),(b.imag-(a.imag-b.imag)))


#face = Face('./FredokaOne-Regular.ttf')
#face = Face('./Roboto.ttf')
face.set_char_size(48 * 64)
face.load_char('e')
outline = face.glyph.outline
y = [t[1] for t in outline.points]
# flip the points
outline_points = [(p[0], max(y) - p[1]) for p in outline.points]
start, end = 0, 0
paths = []

for i in range(len(outline.contours)):
    end = outline.contours[i]
    points = outline_points[start:end + 1]
    points.append(points[0])
    tags = outline.tags[start:end + 1]
    tags.append(tags[0])

    segments = [[points[0], ], ]
    for j in range(1, len(points)):
        segments[-1].append(points[j])
        if tags[j] and j < (len(points) - 1):
            segments.append([points[j], ])

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
        elif len(segment) == 4:
            
            print('Found Bezier with ' + str(len(segment)) + ' control points. Rendering as two quadratics.')

            C = ((segment[1][0] + segment[2][0]) / 2.0,
                 (segment[1][1] + segment[2][1]) / 2.0)

            paths.append(QuadraticBezier(start=tuple_to_imag(segment[0]),
                                         control=tuple_to_imag(segment[1]),
                                         end=tuple_to_imag(C)))
            paths.append(QuadraticBezier(start=tuple_to_imag(C),
                                         control=tuple_to_imag(segment[2]),
                                         end=tuple_to_imag(segment[3])))

        else: 
            print('Found Bezier with ' + str(len(segment)) + ' control points. Reducing to lines...')
            print(segment)
            ###xList = []
            ###yList = []
            ###for i in range(len(segment)):
            ###    xList.append(segment[i][0])
            ###    yList.append(segment[i][1])
            ###nodes = np.asfortranarray([xList,yList])
            ###curve = bezier.Curve(nodes, degree=(len(segment)-1))
            ###i = 0
            ###subdivisions = 15
            ###points = []
            ###while i <= subdivisions:
            ###    point = curve.evaluate((1/subdivisions)*i)
            ###    points.append(complex(round(point[0][0],6), round(point[1][0],6)))
            ###    i += 1

            points = []
            for seg in segment:
                points.append(complex(seg[0],seg[1]))
            for p in range(len(points)-1):
                paths.append(Line(start=points[p],
                              end=points[p+1]))

            ##points.insert(0,extrapolate(points[1], points[0]))
            ##points.append(extrapolate(points[-2], points[-1]))
            ##i = 0
            ##e = len(points)-4
            ##while i <= e:
            ##    curvePoints = points[i:i+4]

                #c1=(curvePoints[1]+(curvePoints[2]-curvePoints[0])/6)
                #c2=(curvePoints[2]-(curvePoints[3]-curvePoints[1])/6)
                #C = complex((c1.real + c2.real)/2,
                #            (c1.imag + c2.imag)/2)
                #paths.append(QuadraticBezier(start=curvePoints[1],
                #                            control=c1,
                #                            end=C))
                #paths.append(QuadraticBezier(start=C,
                #                            control=c2,
                #                            end=curvePoints[2]))                
                ##paths.append(CubicBezier(start=curvePoints[1],
                ##                         control1=(curvePoints[1]+(curvePoints[2]-curvePoints[0])/6),
                ##                         control2=(curvePoints[2]-(curvePoints[3]-curvePoints[1])/6),
                ##                        end=curvePoints[2]
                ##                         ))
             ##   i += 1

    start = end + 1

path = Path(*paths)
wsvg(path, filename="text.svg")
