# SparkFun Buzzard Label Generator

If you're looking for legacy buzzard, it is still live at [github.io](https://sparkfunx.github.io/Buzzard/) and the source can be found in the `gh-pages` branch of this repo. Below is the documentation for `Buzzard.py`. For extensive legacy documentation, see the wiki.

  #### NEW! KiCad Support!
  
  Thanks to [Gregory Davill](https://github.com/gregdavill), Buzzard now generates tags in KiCad footprint format via the `-o ki` argument.

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
  -o {b,ls,lib,ki}         Output Mode ('b'=board script, 'ls'=EAGLE library script,
                        'lib'=EAGLE library file, 'ki'=KiCad footprint)
  -n SIGNALNAME         Signal name for polygon. Required if layer is not 21
                        (default is 'GND')
  -u SUBSAMPLING        Subsampling Rate (larger values provide smoother curves 
                        with more points)
  -t TRACEWIDTH         Trace width in mm
  -a {tl,cl,bl,tc,cc,bc,tr,cr,br}
                        Footprint anchor position (default:cl)
  -w {w,a}              Output writing mode (default:w)
  -d DESTINATION        Output destination filename (extension depends on -o
                        flag)
  -c                    If specified labelText is used as a path to collection
                        script (a text list of labels and options to create)    
  -stdout               If specified output is written to stdout

  ```
  
  ## labelText
  
  Label text should be enclosed in doublequotes in order to pass certain characters via the commandline. 
  **Note:** If you're using Windows PowerShell you may need to escape certain characters using the "`" (backward apostrophe/grave)
  
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
  
  ### Multiple Tags
  
  When using the `-o lib` output format, multiple comma-separated tags can be generated. If you need multiple tags with individual
  formatting, try [collections mode](https://github.com/sparkfunX/Buzzard/tree/python#generate-collections)! 
  
  ### Overlining 
  
  Buzzard.py supports using "!" to overline tags in the same way that EAGLE does. For the most predictable results, overlined text 
  should be surrounded by exclamation marks, i.e. in EAGLE, "!INT" will produce overlined text, but it is best practice to write "!INT!"
  instead.
  
  ### Literal Exclamation Marks
  
  If you want to use the literal "!" character in your tag, it should be escaped with a leading backslash, i.e. "\\!"
  
  ### Literal Backslashes
  
  If you want to use the literal "\\" character in your tag, it should be escaped with a leading backslash, i.e. "\\\\"
  A backslash in the first position of a tag string will always be interpreted as a tag shape indicator.
  
  ## FONTNAME
  
  Buzzard.py will attempt to use any TrueType font in the `/typeface` directory, but because buzzard cannot read the GPOS tables, 
  it requires character offsets to be explicitly defined in an eponymous python module. Modules currently exist only for the included
  typefaces "Roboto" and "FredokaOne". If a module doesn't exist, but the font is present, buzzard will attempt to generate the tag
  without position information. 
  
  ## SCALEFACTOR
  
  This argument controls the output size of the tag. Units are height of text in inches. The default is 0.04".
  
  ## EAGLELAYERNUMBER
  
  This argument controls which EAGLE layer the tag is written to. Default value is 21 (tPlace)

  ## Verbose Mode
  
  If something gets borked, try running again with `-v` to see what's happening under the hood
  
  ## Output Mode
  
  This argument controls which format the tag output is generated for
  
  ### Board Script Mode
  
  By default, buzzard.py will generate a file called `output.scr` which can be run in the EAGLE board editor.
  
  ### Library Script Mode
  
  Library script mode will generate a file called `output.scr` which can be run in the EAGLE library footprint editor.
  
  ### Library Package Mode
  
  Library package mode will generate a file called `output.lbr` which is an EAGLE library file containing the specified tag/tags

  ### KiCad Footprint Mode

  KiCad footprint mode will generate a file called 'output.kicad_mod' which is a KiCad footprint file containing the specified tag
  
  ## SIGNALNAME
  
  This argument defines the EAGLE signal name of the output, which is only required for metal layers. It is `GND` by default.
  
  ## SUBSAMPLING
  
  This argument essentially defines the resolution of the output. A smaller number will produce smoother curves but larger files. 
  **Note:**  Smaller scale factors require smaller subsampling factors
  
  ## TRACEWIDTH

  Tracewidth of output in mm
  
  ## Anchor Position
  
  In library package output mode, the position of the anchor point can be specified using the `-a` argument. The default value is `cl`
  The following values are permissible:
  
  ```
  tl - top left
  cl - center left
  bl - bottom left
  tc - top center
  cc - center center
  bc - bottom center
  tr - top right
  cr - center right
  br - bottom right
  ```
  
  ## Output Writing Mode

  By default, buzzard.py with overwrite the output file. Running with the `-w a` option, however, will run buzzard.py in "append mode," 
  adding the specified tag to the existing output file.
  
  ## Destination Filename
  
  Using the `-d` flag will allow you to specify the name of the output file. The file extension will automatically be selected based on
  the output format.
  
  ## Generate Collections
  
  Passing the `-c` flag will run buzzard.py in collection mode. Instead of passing a comma-separated collection of strings, you may pass 
  the path to a text file containing the strings that you wish to generate. In collection mode, each tag can be generated with its own
  properties. An example collection.txt may be found in the ./tests/ directory

  ## STDOUT Print Mode

  If this argument is specified, the output will be written to stdout instead of a file. This is handy for piping to clipboard, etc.
  
