# SparkFun Buzzard Label Generator
```
usage: buzzard.py [-h] [-f FONTNAME] [-s SCALEFACTOR] [-l EAGLELAYERNUMBER]
                  [-v] [-o {b,ls,lib}] [-n SIGNALNAME] [-u SUBSAMPLING]
                  [-t TRACEWIDTH] [-a {tl,cl,bl,tc,cc,bc,tr,cr,br}]
                  labelText

positional arguments:
  labelText             Text to write on the label

optional arguments:
  -h, --help            show this help message and exit
  -f FONTNAME           Typeface to use when rendering the label
  -s SCALEFACTOR        Text Height in inches (same as EAGLE text size value)
  -l EAGLELAYERNUMBER   Layer in EAGLE to create label into (default is tPlace
                        layer 21)
  -v                    Verbose mode (helpful for debugging)
  -o {b,ls,lib}         Output Mode ('b'=board script, 'ls'=library script,
                        'lib'=library file)
  -n SIGNALNAME         Signal name for polygon. Required if layer is not 21
                        (default is 'GND')
  -u SUBSAMPLING        Subsampling Rate (smaller values provide smoother
                        curves with larger output)
  -t TRACEWIDTH         Trace width in mm
  -a {tl,cl,bl,tc,cc,bc,tr,cr,br}
                        Footprint anchor position (default:cl)
  ```
  
  ## labelText
  
  Label text should be enclosed in doublequotes in order to pass certain characters via the commandline. 
  Note: If you're using Windows PowerShell you may need to escape certain characters using the "`" (backward apostrophe/grave)
  
  ### Tag Shapes
  
  By default, Buzzard.py will output plain text labels. If you want to make a flag label, you can surround your text with the following
  special characters: `()[]/\><`
  
  For example: 
  ```
  (capsule)
  /forward-slash/
  \back-slash\
  >flagtail-pointer>
  [square]
  ```
  
  These tag shape indicators can be mixed and matched as well, i.e. `(half-capsule]`
  
  ### Overlining 
  
  Buzzard.py supports using "!" to overline tags in the same way that EAGLE does. For the most predictable results, overlined text 
  should be surrounded by exclamation marks, i.e. in EAGLE, "!INT" will produce overlined text, but it is best practice to write "!INT!" instead.
  
  ### Literal Exclamation Marks
  
  If you want to use the literal "!" character in your tag, it should be escaped with a leading backslash, i.e. "\!"
  
  ### Literal Backslashes
  
  If you want to use the literal "\" character in your tag, it should be escaped with a leading backslash, i.e. "\\"
  A backslash in the first position of a tag string will always be interpreted as a tag shape indicator.
  
  ## FONTNAME
  
  
