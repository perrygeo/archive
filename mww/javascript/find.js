// global variables that an individual application *might* have to override
var FindURL = "/maps/gnis.html";
var FindWindowName = "findwin";
var FindWindowSizeX=450, FindWindowSizeY=300;

var FindFormPlaceElement = "findform.place";
// var FindFormOptionsElement = "findform.options";

function find(mapserv,app,scale,sectionscale) {
  var re_pls = /[Tt](\d{1,3})[Rr](\d{1,2})[Ss]?(\d{0,2})/; // regex for pls lookups
  var re_coord = /(-?[0-9]+(\.[0-9]*)?) +(-?[0-9]+(\.[0-9]*)?)/; // regex for coordinates

  var place_element = eval("document." + FindFormPlaceElement);
  // var options_element = eval("document." + FindFormOptionsElement);

  if(re_pls.test(place_element.value)) {    	  

    if(RegExp.$1 < 27 || RegExp.$1 > 168) {
      alert("Valid township numbers must be between 27 and 168.");
      return false;
    }
    if(RegExp.$2 < 1 || RegExp.$2 > 51) {
      alert("Valid range numbers must be between 1 and 51.");
      return false;
    }
    if(RegExp.$3 && (RegExp.$3 < 0 || RegExp.$3 > 36)) {
      alert("Valid section numbers must be between 1 and 36.");
      return false;
    }
	  
    // build pls search term
    var pls = 't';
    for(var i=RegExp.$1.length; i<3; i++) pls += '0';
    pls += RegExp.$1;
    for(i=RegExp.$2.length; i<2; i++) pls += '0';
    pls += RegExp.$2;
    if(RegExp.$3) {
      for(i=RegExp.$3.length; i<2; i++) pls += '0';
      pls += RegExp.$3;
      updatePopup(FindWindowSizeX, FindWindowSizeY, FindURL + "?object=" + mapserv + "&table=pls&scale=" + sectionscale + "&app=" + app + "&place=" + pls, FindWindowName);
    } else
      updatePopup(FindWindowSizeX, FindWindowSizeY, FindURL + "?object=" + mapserv + "&table=pls&scale=" + scale + "&app=" + app + "&place=" + pls, FindWindowName);

  } else if(re_coord.test(place_element.value)) {
    var p = new Point(parseFloat(RegExp.$1), parseFloat(RegExp.$3));

    if(p.x < 180.0 && p.y < 180.0) { // check lat/lon
      if(p.x > 0) 
	p.x = -1.0*p.x; // longitude should be negative

      if(p.x < -97.20 || p.x > -89.46) {
	alert("Valid longitude values in Minnesota are between -97.20 and -89.46.");
	return false;
      }
      if(p.y < 43.48 || p.y > 49.40) {
	alert("Valid latitude values in Minnesota are between 43.48 and 49.40.");
	return false;
      }
	    
      p = geographicToUTM(15, p);
    } else { // check UTM
      if(p.x < 156000 || p.x > 795000) {
	alert("Valid UTM easting coordinates in Minnesota are between 156000.0 and 795000.0.");
	return false;
      }
      if(p.y < 4720000 || p.y > 5571000) {
	alert("Valid UTM northing coordinates in Minnesota are between 4720000.0 and 5571000.0.");
	return false;
      }
    }

    eval(mapserv + ".zoomscale(p.x, p.y, scale)");
  } else
    updatePopup(FindWindowSizeX, FindWindowSizeY, FindURL + "?object=" + mapserv + "&table=gnis&app=" + app + "&scale=" + scale + "&place=" + escape(place_element.value), FindWindowName);

  place_element.value = ''; // reset

  return false;
}