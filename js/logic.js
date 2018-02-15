var canvas = document.getElementById("labelCanvas");
var ctx = canvas.getContext("2d");
var fixedHeight = 41;
ctx.canvas.width = 405;
ctx.canvas.height = 405;
ctx.font = "36px Fredoka One"
var popCount = 0;
var adjOffset = document.getElementById("fontOffsetV").value;

function drawLabel() {

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 0;

  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = "white";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  
  ctx.fillStyle = "black";
  adjOffset = document.getElementById("fontOffsetV").value;

  ctx.fillRect(((ctx.canvas.width / 2) -
    ctx.measureText(removeBang(document.getElementById("labelText").value)).width / 2) - 1, (ctx.canvas.height / 2) - fixedHeight / 2, ctx.measureText(removeBang(document.getElementById("labelText").value)).width + 2, fixedHeight);

  ctx.fillStyle = "white";

  ctx.fillText(removeBang(document.getElementById("labelText").value), ((ctx.canvas.width / 2) - (ctx.measureText(removeBang(document.getElementById("labelText").value)).width / 2)), (ctx.canvas.height / 2) + fixedHeight / 2 - adjOffset)

	barOverBang(document.getElementById("labelText").value);

  var leftCap = new Image();
  switch (document.getElementById("leftCapStyle").value) {

    case "square":
      leftCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABbSURBVEiJ7c0hDoAwEETRT9OETRBcgMPt1fZeSHxtUcWgWUiQM/rnzTTG2IGZ5xV3bxGRZFBvbMvC3vsCrFlX0suPEyhQoECBAgUKFChQ4L+rwAkc2bGZtRcdF6ASDxfWlNCuAAAAAElFTkSuQmCC";
      break;

    case "rounded":
      leftCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEXSURBVEiJrdc9SsRAGAbgZxPWQrZyUVhWW7VXBMFGL6HoFbyHXkB08RBWWnoCT2CpgoXYiIVWsUgiKLv52++FgVTP/CTzzaSnW1LsYB9b2MQIg7bQGs7xgmxGa5RlTPBdATUGj/HeAKoF+7huAVWCi7jrgE0F+3NgU8Eu05wJnsyJ/QGHeIsEJwHYL7iq2Udb25ICPMXC/wXtmgTPQdPNYDcQyxJ5CQpLgu1ocD0aHEWDrct2HRiaBJ/R4Gs0+BgNPkSD95FgiT4J2stp8bCCvchRhhXYtAA/MBZcKJYEH1JwFA3CVTSY4iYSJL8s3UaC5Jemy0iwzKF2b79RhrjAVxRYZowzFXu/11YsUh6/B/Lfio2is8EP0d5ki1S/K78AAAAASUVORK5CYII=";
      break;

    case "pointer":
      leftCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADZSURBVEiJzda7DcIwFEDRSyj5iAGYgnSZiQHYhRXYBBaghYIaRG+KKAg58ed9Cq6U9siynGeDvSVwAM7A24rtgBsQfj51HfCMMDWYwlRgDhODJUwE1mDVYC1WBUqwItgBLwGWBTVYEtRik6AFG4FWLHhjX7B1wgLACrg7YaEB9sA23kxLF6/VAWFGP7YXXqtrKPwuGvDqDZ48QeiPTXxz/dfBHpIO0iLohY6yopNZ0GRaNJsGLeZ6jWrQ6lyfIhJUnOtzrgZV5/okHmqJRt/cCD6AI/3oWwObD86xkBtMQ164AAAAAElFTkSuQmCC";
      break;

    case "forwardslash":
      leftCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACbSURBVEiJzdFBDkAwEEbhF2txGcexd1qXcYLaiFAt0xnamaRL8v58YLsRCOfXGX84G7+/XA+sfFg4AcMHYcctRHX7U90NA+Pk/zEwFFbDUKFkMVBOroehKayOUYTyikHh5PoYJYXNMEQoYgyEk9thSAqbYzyiFGPwMrk9xlOhG4wkihqDzGQ/GKlCdxgXFDNGPNkfxrnQLUYAwgZ4hCV4htXw3AAAAABJRU5ErkJggg==";
      break;

    case "backslash":
      leftCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACXSURBVEiJzdG7DYAwDEXRi9KyBDNkDUZnGVoaqCxFwoR8rMRXShs96wAcwG31ArAAO4atwGm58AI2IFqujFYL009NcELyoU+cdKFbnFddOEH50BeOttAdzmdNONrJkg+c3EI3OL9V4eROlubilCycjlNcEU7JydIcnJqF03Cqy+LUnCyNxWlZOBynORWn5WRpDE7PwjE4D26TK+gPXQwPAAAAAElFTkSuQmCC";
      break;

  }

  var rightCap = new Image();
  switch (document.getElementById("rightCapStyle").value) {

    case "square":
      rightCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABcSURBVEiJ7dexDYBADATBBX3gDFEHRbk1FwUd0AABkj9BlOBHIryLV5PfBOwUc3ciYgWeIu0N2CowMy9gqTrgnAeiTxMoUKBAgQIFChQoUOC/a8BRRWYGcDNwK14ccA79rzMhugAAAABJRU5ErkJggg==";
      break;

    case "rounded":
      rightCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEYSURBVEiJrddBLkNRFAbgr1UdGIoZMbUACXN7ELZgIyxAhQ1YAUYSC5B2ATVDQyI1YtAaeAbti6Zppdr/JGfwJl/OPfe+9+6p4AufeEEbLdzhHt/miGJKPuMEGymwzD7OsZYCy+ziMAmWeYHlJFjgBitJsMAt6kmwMNisKFjgIA2+GztSi4IFztJgH5tQndTUOaKOo2SFBTpYqgwfUrGbWnIZe2lwOw1upXvYTYP99JJjB7uMjzT4mgbbabCZ3uUdch+HR1STS740vLokquthvZQT4OloqYtiXeGf1P54MxfBGuPYIuA1ainwSvCy1JhW2X/BNxM2YB6wZ3DOVmfB/gKfcGzkDZglan7Hig4e0DQYK1rmGCt+AMWTc1D8alFsAAAAAElFTkSuQmCC";
      break;

    case "pointer":
      rightCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADOSURBVEiJrdaxDcIwFIThHyhJxyYwQFiBaTIVg5CKljKMYKhoTBGQXMSx/d49yUWaT7YU+24HvIELcADuwAfnxGQ9gaMSjMw77pWgG10CXWgONKNroAktgc1oDfhHz0qwGm0Bq9BWsIhawFXUCmZRD7iIesEIBOCkBCPz09dtfh+qGdTgqAbDVogBRDX4UINX0P02E7BXgYEkfhVXr0/PLcU8YDZnpJgFLCagFGsBq7NZitWA0ioiLUvSOictnNJKPJHEoXVewA0YgM6LfQHcEoFiBXwtEAAAAABJRU5ErkJggg==";
      break;

    case "forwardslash":
      rightCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADPSURBVEiJrZG7DcJAEAXHFEADlOFundMNNAPkEFgPIXyf3bs3kgNf8DSrWYA3Pu4n4xjAtuAzfAEXp+EVeMBu6PhWLTvGbhpznbz9/szaPYGz0/Abw2W48oclhpg9eSs9WmI4DA8xZg0PMWYGDzHE6MnFGKOGxRgzhtUYo4bVGCOD1Rgie3IzRtawGWPEsBsja9iNkRnsxhDRk0MxooahGBnDcIyoYThGZDAcQ/ROTsUQlhiiZZiOIWwxWoPpGKJ28lAMYYkhSobDMYQtBsAHDuoN3MejRU8AAAAASUVORK5CYII=";
      break;

    case "backslash":
      rightCap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAYAAAD+MdrbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADYSURBVEiJrdHLDcIwEEXRC+uIBiiDZtJAuoVqYB82DFJijz2/kbLJ4ulaB2A/fQ8Sd+382zKD0Ba+gVt0rFe4AGt0ENrCHXhWD4Zxek+WC+NohSGcUWEYRysM44wG3TijJ8u5cWaFLhxLoRtnVujGsQyacSxPljPjWAtNOJ5CM4610IzjGZzieJ4sN8XxFg5xIoVTHG/hFCcyqOJEniyn4kQLuziZQhUnWqjiZAYbnMyT5RqcbOEBp6KwwckWNjgVg3+ciifLbQCX33rFfYB7ZeECrJWFAK8vak0CnNNYE7UAAAAASUVORK5CYII=";
      break;

  }

  leftCap.onload = function() {
    ctx.drawImage(leftCap, ((ctx.canvas.width / 2) -
      ctx.measureText(removeBang(document.getElementById("labelText").value)).width / 2) - 20, (ctx.canvas.height / 2) - fixedHeight / 2, 20, fixedHeight);
  }

  rightCap.onload = function() {
    ctx.drawImage(rightCap, ((ctx.canvas.width / 2) +
      ctx.measureText(removeBang(document.getElementById("labelText").value)).width / 2), (ctx.canvas.height / 2) - fixedHeight / 2, 20, fixedHeight);
  }

  setTimeout(function() {
    convert1bit();
    eaglify();
    findDimensions();
    if (document.getElementById("invertCanvasCheck").checked == true) {
      invertCanvas();
    }
  }, 100);

}

function loadFont() {

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  var testwidth = ctx.measureText("teststring").width;

  var fontString = document.getElementById("fontSize").value + "px " + document.getElementById("labelFont").value;
  console.log(fontString);
  ctx.font = fontString;

  console.log("waiting for font to load...")
  while (ctx.measureText("teststring").width == testwidth) {
    // wait for font width to change
  }
  console.log("Success!");
  setTimeout(function() {
    drawLabel();
  }, 1000);


}

document.getElementById("invertCanvasCheck").onchange = drawLabel;
document.getElementById("labelFont").onchange = loadFont;
document.getElementById("fontSize").onchange = loadFont;
document.getElementById("sharpness").onchange = drawLabel;
document.getElementById("leftCapStyle").onchange = drawLabel;
document.getElementById("rightCapStyle").onchange = drawLabel;
document.getElementById("fontOffsetV").onkeyup = drawLabel;
document.getElementById("scaleFactor").onchange = drawLabel;
document.getElementById("labelText").onkeyup = popLabel;
document.getElementById("showXML").onchange = function() {

  if (document.getElementById("showXML").checked == false) {
    document.getElementById("output").style.visibility = "hidden";
  } else {
    document.getElementById("output").style.visibility = "visible";
  }

};

drawLabel();
setTimeout(function() {
  drawLabel();
}, 1000);

function invertCanvas() {

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");

  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // invert colors
  for (var i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

}

function eaglify() {

  var outString = "";
  var scaleFactor = document.getElementById("scaleFactor").value;

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");

  var imgData = ctx.getImageData(((ctx.canvas.width / 2) -
    ctx.measureText(document.getElementById("labelText").value).width / 2) - 22, (ctx.canvas.height / 2) - fixedHeight / 2, ctx.measureText(document.getElementById("labelText").value).width + 46, fixedHeight);

  console.log("Eaglifying image " + imgData.width + "px wide by " + imgData.height + "px tall with imdData length of " + imgData.data.length);

  // for every row in the image
  for (var i = 0; i < imgData.height; i++) {

    var prevPx = 255;

    // for each pixel in the row
    for (var j = 0; j < imgData.width; j++) {

      // if this pixel is black
      if (imgData.data[(i * imgData.width * 4) + (j * 4)] < 128) {

        // ...and previous pixel was white
        if (prevPx > 128) {
          outString += "<rectangle x1=\"" + dectwo(j * scaleFactor) + "\" y1=\"" + dectwo((i * (0 - scaleFactor))+0.5*(fixedHeight*scaleFactor)) + "\" ";
        } else { // ...and previous pixel was black
          // do nothing, keep cruising
        }

      } else { // if this pixel is white

        // ...and previous pixel was white
        if (prevPx > 128) {
          // do nothing, keep cruising
        } else { // ...and previous pixel was black
          outString += "x2=\"" + dectwo(j * scaleFactor) + "\" y2=\"" + dectwo((i * (0 - scaleFactor) - scaleFactor)+0.5*(fixedHeight*scaleFactor)) + "\" layer=\"21\"/>\n";
        }

      }

      prevPx = imgData.data[(i * imgData.width * 4) + (j * 4)];

    }


  }

  document.getElementById("output").value = outString;

}

function downloadCanvas(link, filename) {

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");

  var crop = document.createElement('canvas');
  var crop_ctx = crop.getContext("2d");

  crop.width = ctx.measureText(document.getElementById("labelText").value).width + 46;
  crop.height = fixedHeight;

  var imgData = ctx.getImageData(((ctx.canvas.width / 2) -
    ctx.measureText(document.getElementById("labelText").value).width / 2) - 22, (ctx.canvas.height / 2) - fixedHeight / 2, ctx.measureText(document.getElementById("labelText").value).width + 46, fixedHeight);

  crop_ctx.putImageData(imgData, 0, 0);
  link.href = crop.toDataURL('image/png');
  link.download = filename;
}

/*
document.getElementById('download').addEventListener('click', function() {
  downloadCanvas(this, 'test.png');
}, false);
*/

function convert1bit() {

  var threshold = document.getElementById("sharpness").value;

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");

  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // invert colors
  for (var i = 0; i < imgData.data.length; i += 4) {
    if (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 3] < threshold) {
      imgData.data[i] = 0;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
    } else {
      imgData.data[i] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
    }
    imgData.data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);

}

function dectwo(x) {
  return Number.parseFloat(x).toFixed(2);
}

function findDimensions() {

  var canvas = document.getElementById("labelCanvas");
  var ctx = canvas.getContext("2d");

  var pixelWidth = ctx.measureText(document.getElementById("labelText").value).width + 46;
  var pixelHeight = fixedHeight;
  var scaleFactor = document.getElementById("scaleFactor").value;

  var resultString = "Actual Size: " + dectwo(pixelWidth * scaleFactor) + "mm x " + dectwo(pixelHeight * scaleFactor) + "mm";

  document.getElementById("realSize").innerHTML = resultString;

}

$("#downloadLib").click(function() {
  document.getElementById("labelText").value += ",";
  $("#labelText").trigger("keyup");
  var head = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!DOCTYPE eagle SYSTEM \"eagle.dtd\">\n<eagle version=\"7.7.0\">\n<drawing>\n<settings>\n<setting alwaysvectorfont=\"no\"\/>\n<setting verticaltext=\"up\"\/>\n<\/settings>\n<grid distance=\"1\" unitdist=\"mm\" unit=\"mm\" style=\"lines\" multiple=\"1\" display=\"yes\" altdistance=\"0.1\" altunitdist=\"mm\" altunit=\"mm\"\/>\n<layers>\n<layer number=\"1\" name=\"Top\" color=\"4\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"2\" name=\"Route2\" color=\"1\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"3\" name=\"Route3\" color=\"4\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"4\" name=\"Route4\" color=\"1\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"5\" name=\"Route5\" color=\"4\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"6\" name=\"Route6\" color=\"1\" fill=\"8\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"7\" name=\"Route7\" color=\"4\" fill=\"8\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"8\" name=\"Route8\" color=\"1\" fill=\"2\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"9\" name=\"Route9\" color=\"4\" fill=\"2\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"10\" name=\"Route10\" color=\"1\" fill=\"7\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"11\" name=\"Route11\" color=\"4\" fill=\"7\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"12\" name=\"Route12\" color=\"1\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"13\" name=\"Route13\" color=\"4\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"14\" name=\"Route14\" color=\"1\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"15\" name=\"Route15\" color=\"4\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"16\" name=\"Bottom\" color=\"1\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"17\" name=\"Pads\" color=\"2\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"18\" name=\"Vias\" color=\"2\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"19\" name=\"Unrouted\" color=\"6\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"20\" name=\"Dimension\" color=\"15\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"21\" name=\"tPlace\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"22\" name=\"bPlace\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"23\" name=\"tOrigins\" color=\"15\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"24\" name=\"bOrigins\" color=\"15\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"25\" name=\"tNames\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"26\" name=\"bNames\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"27\" name=\"tValues\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"28\" name=\"bValues\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"29\" name=\"tStop\" color=\"7\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"30\" name=\"bStop\" color=\"7\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"31\" name=\"tCream\" color=\"7\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"32\" name=\"bCream\" color=\"7\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"33\" name=\"tFinish\" color=\"6\" fill=\"3\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"34\" name=\"bFinish\" color=\"6\" fill=\"6\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"35\" name=\"tGlue\" color=\"7\" fill=\"4\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"36\" name=\"bGlue\" color=\"7\" fill=\"5\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"37\" name=\"tTest\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"38\" name=\"bTest\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"39\" name=\"tKeepout\" color=\"4\" fill=\"11\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"40\" name=\"bKeepout\" color=\"1\" fill=\"11\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"41\" name=\"tRestrict\" color=\"4\" fill=\"10\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"42\" name=\"bRestrict\" color=\"1\" fill=\"10\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"43\" name=\"vRestrict\" color=\"2\" fill=\"10\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"44\" name=\"Drills\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"45\" name=\"Holes\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"46\" name=\"Milling\" color=\"3\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"47\" name=\"Measures\" color=\"7\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"48\" name=\"Document\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"49\" name=\"Reference\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"51\" name=\"tDocu\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"52\" name=\"bDocu\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"90\" name=\"Modules\" color=\"5\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"91\" name=\"Nets\" color=\"2\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"92\" name=\"Busses\" color=\"1\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"93\" name=\"Pins\" color=\"2\" fill=\"1\" visible=\"no\" active=\"yes\"\/>\n<layer number=\"94\" name=\"Symbols\" color=\"4\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"95\" name=\"Names\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"96\" name=\"Values\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"97\" name=\"Info\" color=\"7\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<layer number=\"98\" name=\"Guide\" color=\"6\" fill=\"1\" visible=\"yes\" active=\"yes\"\/>\n<\/layers>\n";
  var tail = "<\/drawing>\n<\/eagle>\n";

  var lbrFile = head + "<library>\n<packages>\n";

  // Write packages

  $("#labelGroup").children(".popLabel").each(function(index) {
    lbrFile += "<package name=\"" + cleanName(this.dataset.text.toUpperCase()) + "\">\n";
    lbrFile += this.dataset.eagle;
    lbrFile += "</package>\n";
  });
  lbrFile += "</packages>\n<symbols>\n";

  // Write symbols
  $("#labelGroup").children(".popLabel").each(function(index) {
    lbrFile += "<symbol name=\"" + cleanName(this.dataset.text.toUpperCase()) + "\">\n";
    lbrFile += "<text x=\"0\" y=\"0\" size=\"1.778\" layer=\"94\">" + cleanName(this.dataset.text) + "<\/text>\n<\/symbol>\n";
  });
  lbrFile += "</symbols>\n<devicesets>\n";

  // Write devicesets
  $("#labelGroup").children(".popLabel").each(function(index) {
    lbrFile += "<deviceset name=\"" + cleanName(this.dataset.text.toUpperCase()) + "\">\n";
    lbrFile += "<gates>\n<gate name=\"G$1\" symbol=\"" + cleanName(this.dataset.text.toUpperCase()) + "\" x=\"0\" y=\"0\"\/>\n<\/gates>\n<devices>\n";
    lbrFile += "<device name=\"\" package=\"" + cleanName(this.dataset.text.toUpperCase()) + "\">\n<technologies>\n<technology name=\"\"\/>\n<\/technologies>\n<\/device>\n<\/devices>\n<\/deviceset>\n";
  });
  lbrFile += "<\/devicesets>\n<\/library>\n";

  lbrFile += tail;

  var filename = "buzzard_labels.lbr";


  var blob = new Blob([lbrFile], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, filename, true);

  $("#labelGroup").find(".popLabel").trigger("click");

});

$("#labelGroup").on('click', ".popLabel", function(e) {
  selectPop(e);
});

$("#labelGroup").on('mouseover', ".popLabel", function(e) {
  showDeleteButton(e);
});

$("#labelGroup").on('mouseout', ".popLabel", function(e) {
  hideDeleteButton(e);
});

$("#labelGroup").on('mouseout', ".deleteButton", function(e) {
  hideDeleteButton(e);
});

$("#labelGroup").on('click', ".deleteButton", function(e) {
  deletePop(e);
});

function popLabel() {
  if (document.getElementById("labelText").value.slice(-1) == "," && document.getElementById("labelText").value.substr(0, document.getElementById("labelText").value.indexOf(",")) != "") {
    var newLabel = document.getElementById("labelText").value.substr(0, document.getElementById("labelText").value.indexOf(","));
    document.getElementById("labelText").value = "";
    var labelTag = document.createElement("div");
    labelTag.classList.add("popLabel");
    labelTag.setAttribute("id", "pop_" + newLabel);
    labelTag.innerHTML = newLabel;
    var deleteButton = document.createElement("div");
    deleteButton.innerHTML = "-";
    deleteButton.classList.add("deleteButton");
    $(deleteButton).hide();
    labelTag.appendChild(deleteButton);

    labelTag.setAttribute("data-text", newLabel);
    labelTag.setAttribute("data-font", document.getElementById("labelFont").value);
    labelTag.setAttribute("data-font-size", document.getElementById("fontSize").value);
    labelTag.setAttribute("data-font-offset", document.getElementById("fontOffsetV").value);
    labelTag.setAttribute("data-lcap", document.getElementById("leftCapStyle").value);
    labelTag.setAttribute("data-rcap", document.getElementById("rightCapStyle").value);
    labelTag.setAttribute("data-threshold", document.getElementById("sharpness").value);
    labelTag.setAttribute("data-scale", document.getElementById("scaleFactor").value);
    labelTag.setAttribute("data-eagle", document.getElementById("output").value);

    document.getElementById("labelGroup").appendChild(labelTag);
    setDefaults();
  }

  drawLabel();
}

function selectPop(popLabel) {

  document.getElementById("labelText").value = document.getElementById("labelText").value + ",";

  $("#labelText").trigger("keyup");

  label = popLabel.target;
  console.log(label);
  document.getElementById("labelText").value = label.dataset.text;
  document.getElementById("labelFont").value = label.dataset.font;
  document.getElementById("fontSize").value = label.dataset.fontSize;
  document.getElementById("fontOffsetV").value = label.dataset.fontOffset;
  document.getElementById("leftCapStyle").value = label.dataset.lcap;
  document.getElementById("rightCapStyle").value = label.dataset.rcap;
  document.getElementById("sharpness").value = label.dataset.threshold;
  document.getElementById("scaleFactor").value = label.dataset.scale;
  document.getElementById("output").value = label.dataset.eagle;

  $popLabel = jQuery(popLabel.target);
  $popLabel.closest(".popLabel").remove();

  loadFont();

}

function deletePop(popLabel) {
  popLabel.stopPropagation();
  $popLabel = jQuery(popLabel.target);
  $popLabel.closest(".popLabel").remove();
}

function showDeleteButton(popLabel) {
  $popLabel = jQuery(popLabel.target);
  $popLabel.find(".deleteButton").show();
}

function hideDeleteButton(popLabel) {
  $popLabel = jQuery(popLabel.target);
  if ($popLabel.find(".deleteButton")[0] != undefined) {
    if ($popLabel.find(":hover")[0] != $popLabel.find(".deleteButton")[0]) {
      $popLabel.find(".deleteButton").hide();
    }
  } else {
    $popLabel.closest(".deleteButton").hide();
  }
}

function setDefaults() {
  document.getElementById("labelText").value = "";
  document.getElementById("labelFont").value = "Fredoka One";
  document.getElementById("fontSize").value = "36";
  document.getElementById("fontOffsetV").value = "7";
  document.getElementById("leftCapStyle").value = "rounded";
  document.getElementById("rightCapStyle").value = "rounded";
  document.getElementById("sharpness").value = "650";
  document.getElementById("scaleFactor").value = "0.06";
}

function cleanName(name) {

	console.log(name);
  name = name.replace(/ /g, '_');
	name = name.replace(/\W/g, '#');
  console.log(name);
  return name;

}

function barOverBang(string){

//bail before things get weird
if(string.length<2){return string;}

		console.log("bang check on \"" + string + "\"...")

	var barStart;
  var barStop;
  
for(var j = 1; j<string.length; j++){
  	if(string.charAt(string.length-j) == "!"){
    	string = string.slice(0,string.length-j) + "ǃ" + string.slice(string.length-j+1);
    }else{
    	break;
    }
  }

	for(var i = 0; i<string.length; i++){
  	if(string.charAt(i) == "!"){
      console.log("...found one...")
    	// remove bang
   		string = string.slice(0,i) + string.slice(i+1);
    	barStart = ctx.measureText(string.slice(0,i)).width + (ctx.canvas.width / 2) -
    ctx.measureText(removeBang(document.getElementById("labelText").value)).width / 2 + 2;
      	while(string.charAt(i) != "!"){
        	if(i == string.length - 1){
          	i++;
          	console.log("...line end...")
            break;}
          i++;
        }
      console.log("...found mate...")
      // remove bang
      if(string.charAt(i)=="!"){
      string = string.slice(0,i) + string.slice(i+1);}
      barStop = ctx.measureText(string.slice(0,i)).width + (ctx.canvas.width / 2) -
    ctx.measureText(removeBang(document.getElementById("labelText").value)).width / 2 - 3;
      drawBar(barStart, barStop);
    }
  }  
  
      for(var k = 0; k<string.length; k++){
  	if(string.charAt(k) == "ǃ"){
    	string = string.slice(0,k) + "!" + string.slice(k+1);
    }
    
  }
  
}

function drawBar(start, stop){

	var canvas = document.getElementById("labelCanvas");
	var ctx = canvas.getContext("2d");

	var barMargin = 7;
	var barHeight = (ctx.canvas.height / 2) - (fixedHeight / 2) + barMargin; 
  
  console.log("Drawing bar from (" + start + "," + barHeight + ") to (" + stop + "," + barHeight + ")");

  ctx.beginPath();
  ctx.moveTo(start, barHeight);
  ctx.lineTo(stop, barHeight);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.lineCap = 'round';
  ctx.stroke();

}

function removeBang(string){

//bail before things get weird
if(string.length<2){return string;}

		console.log("bang remove on \"" + string + "\"...")
    
for(var j = 1; j<string.length; j++){
  	if(string.charAt(string.length-j) == "!"){
    	string = string.slice(0,string.length-j) + "ǃ" + string.slice(string.length-j+1);
    }else{
    	break;
    }
  }

	for(var i = 0; i<string.length; i++){
  	if(string.charAt(i) == "!"){
    	// remove bang
      fontShrink();
   		string = string.slice(0,i) + string.slice(i+1);
      	while(string.charAt(i) != "!"){
        	if(i == string.length - 1){
            break;}
          i++;
        }
      // remove bang
      if(string.charAt(i)=="!"){
      string = string.slice(0,i) + string.slice(i+1);}
    }else{
    fontUnshrink();
    }
  }
  
    for(var k = 0; k<string.length; k++){
  	if(string.charAt(k) == "ǃ"){
    	string = string.slice(0,k) + "!" + string.slice(k+1);
    }
  }
  
  console.log("Returning \"" + string + "\"");
  return string; 
}

function fontShrink() {

  var fontString = (document.getElementById("fontSize").value-6) + "px " + document.getElementById("labelFont").value;
  ctx.font = fontString;
  
  adjOffset = document.getElementById("fontOffsetV").value -2;

}

function fontUnshrink() {

  var fontString = document.getElementById("fontSize").value + "px " + document.getElementById("labelFont").value;
  ctx.font = fontString;

}