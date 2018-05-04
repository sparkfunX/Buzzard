var silkCanvas = document.getElementById("silkCanvas");
var silkCtx = silkCanvas.getContext("2d");
silkCanvas.width = 405;
silkCanvas.height = 405;

var tStopCanvas = document.getElementById("tStopCanvas");
var tStopCtx = tStopCanvas.getContext("2d");
tStopCanvas.width = 405;
tStopCanvas.height = 405;

var maskCanvas = document.getElementById("maskCanvas");
var maskCtx = maskCanvas.getContext("2d");
maskCanvas.width = 405;
maskCanvas.height = 405;

var copperCanvas = document.getElementById("copperCanvas");
var copperCtx = copperCanvas.getContext("2d");
copperCanvas.width = 405;
copperCanvas.height = 405;

var silkColor = "#ffffff";
var maskColor = "#000000";
var copperColor = "#b88933";
findDimensions();

var silkAlertFlag = 0;

function eaglify(canvas, layer) {

  var outString = "";
  var scaleFactor = document.getElementById("scaleFactor").value;

  var ctx = canvas.getContext("2d");
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // for every row in the image
  for (var i = 0; i < imgData.height; i++) {

    var prevPx = 0;
    var tagOpen = false;

    // for each pixel in the row
    for (var j = 0; j < imgData.width; j++) {

      // if this pixel is opaque
      if (imgData.data[(i * imgData.width * 4) + (j * 4) + 3] > 128) {

        // ...and previous pixel was translucent
        if (prevPx < 128) {
          tagOpen = true;
          outString += "<rectangle x1=\"" + dectwo((j * scaleFactor) - 0.5 * (canvas.width * scaleFactor)) + "\" y1=\"" + dectwo(i * (0 - scaleFactor) + 0.5 * (canvas.height * scaleFactor)) + "\" ";
        } else { // ...and previous pixel was opaque
          // do nothing, keep cruising
        }

      } else { // if this pixel is translucent

        // ...and previous pixel was translucent
        if (prevPx < 128) {
          // do nothing, keep cruising
        } else { // ...and previous pixel was opaque
          tagOpen = false;
          outString += "x2=\"" + dectwo((j * scaleFactor) - 0.5 * (canvas.width * scaleFactor)) + "\" y2=\"" + dectwo((i * (0 - scaleFactor) - scaleFactor) + 0.5 * (canvas.height * scaleFactor)) + "\" layer=\"" + layer + "\"/>\n";
        }

      }

      prevPx = imgData.data[(i * imgData.width * 4) + (j * 4) + 3];

    }

    //check if last tag was open, close it with corner at width of picture
    if (tagOpen == true) {
      outString += "x2=\"" + dectwo((j * scaleFactor) - 0.5 * (canvas.width * scaleFactor)) + "\" y2=\"" + dectwo((i * (0 - scaleFactor) - scaleFactor) + 0.5 * (canvas.height * scaleFactor)) + "\" layer=\"" + layer + "\"/>\n";
    }

  }

  return outString;

}

function thresholdImg(threshold, pixels, fR, fG, fB, inverse) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
    if (v != inverse) {
      d[i] = fR;
      d[i + 1] = fG;
      d[i + 2] = fB;
      d[i + 3] = 255;
    } else {
      d[i + 3] = 0;
      d[i] = d[i + 1] = d[i + 2] = 255;
    }
  }
  return pixels;
}

function dectwo(x) {
  return Number.parseFloat(x).toFixed(2);
}

function findDimensions(pixelWidth, pixelHeight) {

  var scaleFactor = document.getElementById("scaleFactor").value;

  document.getElementById("realWidth").value = dectwo(pixelWidth * scaleFactor);
  document.getElementById("realHeight").value = dectwo(pixelHeight * scaleFactor);

}


$("#downloadLib").click(function() {

  var head = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!DOCTYPE eagle SYSTEM \"eagle.dtd\">\n<eagle version=\"7.7.0\">\n<drawing>\n<settings>\n<setting alwaysvectorfont=\"no\"\/>\n<setting verticaltext=\"up\"\/>\n<\/settings>\n<grid distance=\"1\" unitdist=\"mm\" unit=\"mm\" style=\"lines\" multiple=\"1\" display=\"yes\" altdistance=\"0.1\" altunitdist=\"mm\" altunit=\"mm\"\/>\n<layers>\n<layer number=\"1\" name=\"Top\" color=\"4\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"2\" name=\"Route2\" color=\"1\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"3\" name=\"Route3\" color=\"4\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"4\" name=\"Route4\" color=\"1\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"5\" name=\"Route5\" color=\"4\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"6\" name=\"Route6\" color=\"1\" fill=\"8\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"7\" name=\"Route7\" color=\"4\" fill=\"8\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"8\" name=\"Route8\" color=\"1\" fill=\"2\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"9\" name=\"Route9\" color=\"4\" fill=\"2\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"10\" name=\"Route10\" color=\"1\" fill=\"7\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"11\" name=\"Route11\" color=\"4\" fill=\"7\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"12\" name=\"Route12\" color=\"1\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"13\" name=\"Route13\" color=\"4\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"14\" name=\"Route14\" color=\"1\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"15\" name=\"Route15\" color=\"4\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"16\" name=\"Bottom\" color=\"1\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"17\" name=\"Pads\" color=\"2\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"18\" name=\"Vias\" color=\"2\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"19\" name=\"Unrouted\" color=\"6\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"20\" name=\"Dimension\" color=\"15\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"21\" name=\"tPlace\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"22\" name=\"bPlace\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"23\" name=\"tOrigins\" color=\"15\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"24\" name=\"bOrigins\" color=\"15\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"25\" name=\"tNames\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"26\" name=\"bNames\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"27\" name=\"tValues\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"28\" name=\"bValues\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"29\" name=\"tStop\" color=\"7\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"30\" name=\"bStop\" color=\"7\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"31\" name=\"tCream\" color=\"7\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"32\" name=\"bCream\" color=\"7\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"33\" name=\"tFinish\" color=\"6\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"34\" name=\"bFinish\" color=\"6\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"35\" name=\"tGlue\" color=\"7\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"36\" name=\"bGlue\" color=\"7\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"37\" name=\"tTest\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"38\" name=\"bTest\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"39\" name=\"tKeepout\" color=\"4\" fill=\"11\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"40\" name=\"bKeepout\" color=\"1\" fill=\"11\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"41\" name=\"tRestrict\" color=\"4\" fill=\"10\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"42\" name=\"bRestrict\" color=\"1\" fill=\"10\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"43\" name=\"vRestrict\" color=\"2\" fill=\"10\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"44\" name=\"Drills\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"45\" name=\"Holes\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"46\" name=\"Milling\" color=\"3\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"47\" name=\"Measures\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"48\" name=\"Document\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"49\" name=\"Reference\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"51\" name=\"tDocu\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"52\" name=\"bDocu\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"90\" name=\"Modules\" color=\"5\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"91\" name=\"Nets\" color=\"2\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"92\" name=\"Busses\" color=\"1\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"93\" name=\"Pins\" color=\"2\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"94\" name=\"Symbols\" color=\"4\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"95\" name=\"Names\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"96\" name=\"Values\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"97\" name=\"Info\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"98\" name=\"Guide\" color=\"6\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<\/layers>\n";
  var tail = "<\/drawing>\n<\/eagle>\n";

  var lbrFile = head + "<library>\n<packages>\n";

  var filename = document.getElementById("filename").value;

  // Write packages

  lbrFile += "<package name=\"" + cleanName(filename.toUpperCase()) + "\">\n";
  lbrFile += eaglify(silkCanvas, document.getElementById("silkNum").value);
  lbrFile += eaglify(tStopCanvas, 29);
  lbrFile += eaglify(copperCanvas, 1);
  lbrFile += "</package>\n";

  lbrFile += "</packages>\n<symbols>\n";

  lbrFile += "<symbol name=\"" + cleanName(filename.toUpperCase()) + "\">\n";
  lbrFile += "<text x=\"-2.54\" y=\"0\" size=\"1.778\" layer=\"94\">" + filename + "<\/text>\n<\/symbol>\n";

  lbrFile += "</symbols>\n<devicesets>\n";

  lbrFile += "<deviceset name=\"" + cleanName(filename.toUpperCase()) + "\">\n";
  lbrFile += "<gates>\n<gate name=\"G$1\" symbol=\"" + cleanName(filename.toUpperCase()) + "\" x=\"0\" y=\"0\"\/>\n<\/gates>\n<devices>\n";
  lbrFile += "<device name=\"\" package=\"" + cleanName(filename.toUpperCase()) + "\">\n<technologies>\n<technology name=\"\"\/>\n<\/technologies>\n<\/device>\n<\/devices>\n<\/deviceset>\n";

  lbrFile += "<\/devicesets>\n<\/library>\n";

  lbrFile += tail;

  var savename = cleanName(filename) + ".lbr";

  var blob = new Blob([lbrFile], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, savename, true);

});

function cleanName(name) {

  console.log(name);
  name = name.replace(/ /g, '_');
  name = name.replace(/\W/g, '#');
  console.log(name);
  return name;

}

document.getElementById("imgFile").onchange = drawFromFile;

function drawFromFile(event) {

  var file = event.target.files[0];
  document.getElementById("filename").value = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {
    var inputImg = new Image();
    inputImg.src = event.target.result;
    inputImg.onload = function() {

      document.getElementById("imageStore").innerHTML = "";
      inputImg.setAttribute("id", "sourceImage");
      document.getElementById("imageStore").appendChild(inputImg);

      updateLayers();

    }
  };

  reader.readAsDataURL(file);

}

function drawSilk() {
  var inv = (document.getElementById("silkInvert").checked == false) ? 255 : 0;
  silkCtx.clearRect(0, 0, silkCanvas.width, silkCanvas.height);
  var inputImg = document.getElementById("sourceImage");
  silkCtx.drawImage(inputImg, 0, 0, inputImg.width, inputImg.height, 0, 0, silkCanvas.width, silkCanvas.height);
  var imgData = silkCtx.getImageData(0, 0, silkCanvas.width, silkCanvas.height);
  silkCtx.clearRect(0, 0, silkCanvas.width, silkCanvas.height);
  silkCtx.putImageData(thresholdImg(document.getElementById("silk-sharpness").value, imgData, hexR(silkColor), hexG(silkColor), hexB(silkColor), inv), 0, 0);
}

function drawMask() {
  var inv = (document.getElementById("maskInvert").checked == false) ? 255 : 0;
  var inv2 = (document.getElementById("maskInvert").checked == false) ? 0 : 255;

  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  tStopCtx.clearRect(0, 0, tStopCanvas.width, tStopCanvas.height);

  var inputImg = document.getElementById("sourceImage");

  maskCtx.drawImage(inputImg, 0, 0, inputImg.width, inputImg.height, 0, 0, maskCanvas.width, maskCanvas.height);
  tStopCtx.drawImage(inputImg, 0, 0, inputImg.width, inputImg.height, 0, 0, tStopCanvas.width, tStopCanvas.height);

  var imgData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  var imgStopData = tStopCtx.getImageData(0, 0, tStopCanvas.width, tStopCanvas.height);

  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  tStopCtx.clearRect(0, 0, tStopCanvas.width, tStopCanvas.height);

  maskCtx.putImageData(thresholdImg(document.getElementById("mask-sharpness").value, imgData, hexR(maskColor), hexG(maskColor), hexB(maskColor), inv), 0, 0);
  
  if(document.getElementById("silkLyr").checked == true){	
  tStopCtx.putImageData(subtractSilk(thresholdImg(document.getElementById("mask-sharpness").value, imgStopData, hexR(maskColor), hexG(maskColor), hexB(maskColor), inv2)), 0, 0);
  }else{
  tStopCtx.putImageData(thresholdImg(document.getElementById("mask-sharpness").value, imgStopData, hexR(maskColor), hexG(maskColor), hexB(maskColor), inv2), 0, 0);	  
  }
}

function drawCopper() {
  var inv = (document.getElementById("copperInvert").checked == false) ? 255 : 0;
  copperCtx.clearRect(0, 0, copperCanvas.width, copperCanvas.height);
  var inputImg = document.getElementById("sourceImage");
  copperCtx.drawImage(inputImg, 0, 0, inputImg.width, inputImg.height, 0, 0, copperCanvas.width, copperCanvas.height);
  var imgData = copperCtx.getImageData(0, 0, copperCanvas.width, copperCanvas.height);
  copperCtx.clearRect(0, 0, copperCanvas.width, copperCanvas.height);
  copperCtx.putImageData(thresholdImg(document.getElementById("copper-sharpness").value, imgData, hexR(copperColor), hexG(copperColor), hexB(copperColor), inv), 0, 0);
}

document.getElementById("silkLyr").onchange = updateLayers;
document.getElementById("maskLyr").onchange = updateLayers;
document.getElementById("copperLyr").onchange = updateLayers;
document.getElementById("silk-sharpness").onchange = updateLayers;
document.getElementById("mask-sharpness").onchange = updateLayers;
document.getElementById("copper-sharpness").onchange = updateLayers;
document.getElementById("silkColor").onchange = updateLayers;
document.getElementById("maskColor").onchange = updateLayers;
document.getElementById("silkInvert").onchange = updateLayers;
document.getElementById("maskInvert").onchange = updateLayers;
document.getElementById("copperInvert").onchange = updateLayers;
document.getElementById("realWidth").onkeyup = scaleFromW;
document.getElementById("realHeight").onkeyup = scaleFromH;
document.getElementById("realWidth").onmouseup = scaleFromW;
document.getElementById("realHeight").onmouseup = scaleFromH;
document.getElementById("copperFinish1").onclick = changeFinish;
document.getElementById("copperFinish2").onclick = changeFinish;
document.getElementById("copperFinish3").onclick = changeFinish;
document.getElementById("silkNum").onclick = silkLyrAlert;


function silkLyrAlert() {
	
	if(silkAlertFlag == 0){
	alert("Layer 21 is the tPlace layer for EAGLE. Anything placed on the tPlace layer can be /"flipped/" to the bPlace layer within EAGLE. Changing this number will allow you to import shapes to arbitrary layers, there are some numbers that EAGLE will like in this field more/ledd than others. Use at your own peril.");
	silkAlertFlag = 1;
	}
	
	updateLayers();	
	
}

function changeFinish() {
	
	if ($('input[name=copperFinish]:checked').val() == "Bare") {
		copperColor = "#b88933";
	}else if($('input[name=copperFinish]:checked').val() == "HASL") {
		copperColor = "#f5f5f5";
	}else if($('input[name=copperFinish]:checked').val() == "ENIG") {
		copperColor = "#f0e68c";
	}
	
	updateLayers();
}

function updateLayers() {

  sizeCanvases();
  
  if(document.getElementById("silkLyr").checked == true && document.getElementById("maskLyr").checked == false && document.getElementById("copperLyr").checked == false){
	document.getElementById("canvasGroup").style.backgroundImage = "none";
	document.getElementById("canvasGroup").style.backgroundColor = document.getElementById("maskColor").value;
  }else{
	document.getElementById("canvasGroup").style.backgroundColor = "";
	document.getElementById("canvasGroup").style.backgroundImage = "url('https://github.com/sparkfunX/Buzzard/raw/master/img/FR4BG.png')"
  }

  silkColor = document.getElementById("silkColor").value;
  maskColor = document.getElementById("maskColor").value;

  silkCtx.clearRect(0, 0, silkCanvas.width, silkCanvas.height);
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  copperCtx.clearRect(0, 0, copperCanvas.width, copperCanvas.height);

  if (document.getElementById("silkLyr").checked == true) {
    drawSilk();
  }
  if (document.getElementById("maskLyr").checked == true) {
    drawMask();
  }
  if (document.getElementById("copperLyr").checked == true) {
    drawCopper();
  }
}

function hexR(hex) {
  hex = hex.replace('#', '');
  r = parseInt(hex.substring(0, 2), 16);
  return r;
}

function hexG(hex) {
  hex = hex.replace('#', '');
  g = parseInt(hex.substring(2, 4), 16);
  return g;
}

function hexB(hex) {
  hex = hex.replace('#', '');
  b = parseInt(hex.substring(4, 6), 16);
  return b;
}

function sizeCanvases() {

  console.log("resizing canvases...")

  var inputImg = document.getElementById("sourceImage");
  var aspectRatio;
  var scaleHeight;
  var scaleWidth;

  if (inputImg.naturalWidth > inputImg.naturalHeight) {

    console.log("source image is wide");

    aspectRatio = inputImg.naturalHeight / inputImg.naturalWidth;
    silkCanvas.width = 405;
    maskCanvas.width = 405;
    tStopCanvas.width = 405;
    copperCanvas.width = 405;

    console.log("aspect ratio is " + aspectRatio);

    scaleHeight = 405 * aspectRatio;

    console.log("Scaled to 405 x " + scaleHeight);

    silkCanvas.height = scaleHeight;
    silkCanvas.style.top = (405 / 2) - (scaleHeight / 2) + "px";
    maskCanvas.height = scaleHeight;
    maskCanvas.style.top = (405 / 2) - (scaleHeight / 2) + "px";
    tStopCanvas.height = scaleHeight;
    copperCanvas.height = scaleHeight;
    copperCanvas.style.top = (405 / 2) - (scaleHeight / 2) + "px";

    findDimensions(405, scaleHeight);

  } else {

    console.log("source image is tall (or square)");

    aspectRatio = inputImg.naturalWidth / inputImg.naturalHeight;
    silkCanvas.height = 405;
    maskCanvas.height = 405;
    tStopCanvas.height = 405;
    copperCanvas.height = 405;

    console.log("aspect ratio is " + aspectRatio);

    scaleWidth = 405 * aspectRatio;

    console.log("Scaled to " + scaleWidth + " x 405");

    silkCanvas.width = scaleWidth;
    silkCanvas.style.left = (405 / 2) - (scaleWidth / 2) + "px";
    maskCanvas.width = scaleWidth;
    maskCanvas.style.left = (405 / 2) - (scaleWidth / 2) + "px";
    tStopCanvas.width = scaleWidth;
    copperCanvas.width = scaleWidth;
    copperCanvas.style.left = (405 / 2) - (scaleWidth / 2) + "px";

    findDimensions(scaleWidth, 405);

  }

}

function scaleFromW() {

  var realWidth = document.getElementById("realWidth").value;

  document.getElementById("scaleFactor").value = realWidth / silkCanvas.width;

  document.getElementById("realHeight").value = dectwo(silkCanvas.height * document.getElementById("scaleFactor").value);

}

function scaleFromH() {

  var realHeight = document.getElementById("realHeight").value;

  document.getElementById("scaleFactor").value = realHeight / silkCanvas.height;

  document.getElementById("realWidth").value = dectwo(silkCanvas.width * document.getElementById("scaleFactor").value);

}

function subtractSilk(pixels){
	
	var silkData = silkCtx.getImageData(0, 0, silkCanvas.width, silkCanvas.height);
	
	var dtStop = pixels.data;
	var dsilk = silkData.data;
	
	var returnData
	
	// If pixel is on tStop && not on silk then put on return layer
	
	for (var i = 0; i < dtStop.length; i += 4) {

		var tStopv = dtStop[i+3];
		var silkv = dsilk[i+3];
			if (tStopv==255 && silkv==0) {
			  dtStop[i] = 0;
			  dtStop[i + 1] = 0;
			  dtStop[i + 2] = 0;
			  dtStop[i + 3] = 255;
			} else {
			  dtStop[i + 3] = 0;
			  dtStop[i] = dtStop[i + 1] = dtStop[i + 2] = 255;
			}
  }
  return pixels;	 
}
