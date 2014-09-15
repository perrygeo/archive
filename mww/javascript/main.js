  var args = getargs(); // nab any URL-based arguments

  //var path = "/usr/local/www/docs/landview/";
  //var vpath = "http://maps.dnr.state.mn.us/landview";
  //var gpath = "http://maps.dnr.state.mn.us/graphics";
  var path = "<?php print $templateurl ?>/";
  var vpath = "<?php print $templateurl ?>/";
  var gpath = "<?php print $templateurl ?>/images";
  var mapfile = "<?php print $mapfile ?>";
  var mainpath = "<?php print $templateurl ?>/"


  // interface buttons
  var buttons = new Array('state', 'zoomin', 'pan', 'zoomout', 'info', 'printicon', 'help');
  var active_button = '';

  // interface mapsize
  var mapsize='medium';
  var mapsizex=640;
  var mapsizey=480; // default
  if(args.mapsize) { 
    mapsize = args.mapsize;
    if(args.mapsize == 'small') {
      mapsizex = 400;
      mapsizey = 300;
    } else if(args.mapsize == 'medium') {
      mapsizex = 640;
      mapsizey = 480;
    } else if(args.mapsize == 'large') {
      mapsizex = 800;
      mapsizey = 600;
    } else if(args.mapsize == 'huge') {
      mapsizex = 1024;
      mapsizey = 768;
    } else {
      alert("Unknown mapsize, valid values are small, medium or large. Reverting to default value.");
      var mapsize='medium';
      var mapsizex=640, mapsizey=480;
    }
  }

  // the DHTML legend container
  // MP //var legend = new dContainer("legend");
  // MP //legend.scroll = true;
  // legend.style = "scrollbar-base-color: #009966; scrollbar-track-color: #009966; scrollbar-face-color: #ffff99; scrollbar-highlight-color: #009966; scrollbar-3dlight-color: #009966; scrollbar-darkshadow-color: #009966; scrollbar-shadow-color: #009966; scrollbar-arrow-color: #009966;";

  // the DHTML main mapping window (note the significance of the name "main" here and with the Mapserv object)
  var main = new dBox("main");
  main.color = "red";
  main.thickness = 2;
  main.verbose = true;

  // the DHTML reference map
  var reference = new dBox("reference");
  reference.box = false;

  // global variables used in mapserv.js
  var MapServer = "<?= $cgiurl ?>";
  var QueryServer = MapServer;
  var Interface = "dhtml";

  // var ms = new Mapserv("main", "LANDVIEW_MAPFILE", 155791.714648, 4720323.238005, 794359.124023, 5570749.155271, mapsizex, mapsizey);
  // .var ms = new Mapserv("main", "/usr/local/www/docs/landview/landview_x.map", 155791.714648, 4720323.238005, 794359.124023, 5570749.155271, mapsizex, mapsizey);
  
   var ms = new Mapserv("main", mapfile, <?= $fullExtent[0] ?>, <?= $fullExtent[1] ?>,<?= $fullExtent[2] ?>,<? $fullExtent[3] ?>, mapsizex, mapsizey);  // ALTER EXTENTS

  ms.queryfile = "LANDVIEW_QUERY_MAPFILE";
  ms.minscale = 5000;
  ms.maxscale = 10000000;

  // add the reference map
  ms.referencemap = new Mapserv("reference", mapfile, 125105.727952, 4785412.819496, 788393.592828, 5488749.153129, <?= $refwidth ?>, <?= $refheight ?>);

  ms.projection = "<?php print $map->getProjection() ?>";
  ms.minscale = <?php print $minScale ?>;
  ms.maxscale = <?php print $maxScale ?>;
  ms.zoomsize = <?php print $zoomSize ?>;

  //
  // Process any input args (only a couple are supported). This is LandView specific but
  // a useful extension (see also the code above to change map size).
  //
  if(args.mapxy) {
    var coords = args.mapxy.split(" ");
    if(coords.length != 2) alert("Not enough coordinates for mapxy. Using default extent.");
    if(args.scale) ms.setextentfromscale(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(args.scale));
    else if(args.radius) ms.setextentfromradius(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(args.radius));
    else alert("Coordinate given but no scale or radius. Using default extent.");
  }

  if(args.mapext) {
    var coords = args.mapext.split(" ");
    if(coords.length != 4) alert("Not enough coordinates for mapext. Using default extent.");
    ms.setextent(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
  }

  if(args.layers) {
    var layers = args.layers.split(" ");
    ms.layersoff(); // turn all layers off
    for(var i=0; i<layers.length; i++)  
      ms.setlayer(layers[i], true);
  }

  if(args.zoomsize)
    ms.zoomsize = args.zoomsize;

  //
  // Extensions to Mapserv.draw(): this allows you to exend the capabilties of
  // of the default draw method. There are post and pre draw functions available.
  //
  function postdraw() {
    // update the scalebars    
    document.scalebar_miles.src = MapServer + "?map=LANDVIEW_SCALEBAR_MAPFILE&mode=scalebar&mapext=0+0+" + (ms.extent[2] - ms.extent[0]) + "+" + (ms.extent[3] - ms.extent[1]) + "&mapsize=" + ms.width + "+" + ms.height;
    document.scalebar_kilometers.src = MapServer + "?map=LANDVIEW_SCALEBAR_MAPFILE&map_scalebar_units=kilometers&mode=scalebar&mapext=0+0+" + (ms.extent[2] - ms.extent[0]) + "+" + (ms.extent[3] - ms.extent[1]) + "&mapsize=" + ms.width + "+" + ms.height;

    // update the legend
    //var legendURL = "http://www.dnr.state.mn.us/maps/mapserv43.html?map=/usr/local/www/docs/landview/landview_x.map&mode=legend&layers=" + ms.getlayerlist('+') + "&mapext=" + ms.extent[0] + "+"  + ms.extent[1] + "+"  + ms.extent[2] + "+"  + ms.extent[3] + "&mapsize=" + ms.width + "+" + ms.height;
    //var legendURL = "http://www.dnr.state.mn.us/maps/mapserv43.html?map=/usr/local/www/docs/landview/landview_x.map&mode=legend";
    //var legendURL = "legend.html"; // MP
    //alert(legendURL);
    //legend.setcontent(legendURL);
    checkLegendControls(document.layers.foreground);
    checkLegendControls(document.layers.background);
  }
  

function leapto(form) {^M
 var myindex=form.menu.selectedIndex^M
 window.location=(form.menu.options[myindex].value);^M
}^M
^M
function doClear(theText) {^M
    if (theText.value == theText.defaultValue) {^M
        theText.value = "";^M
    }^M
}^M
function checkLegendControls(element) {^M
^M
 for (var i=0; i<element.length; i++) {^M
    var maxscaleObj = eval("document.layers." + element[i].value + "Maxscale");^M
    var minscaleObj = eval("document.layers." + element[i].value + "Minscale");^M
    if (maxscaleObj) {^M
      if (maxscaleObj.value < ms.getscale()) {^M
        disableLegendControls(element[i]);^M
        continue;^M
      }^M
    }^M
    if (minscaleObj) {^M
      if (minscaleObj.value > ms.getscale()) {^M
        disableLegendControls(element[i]);^M
      }^M
    }^M
  }^M
}^M
^M
function disableLegendControls(widget) {^M
  widget.disabled = true;^M
  var fontId = widget.value + "Font";^M
  document.getElementById(fontId).color="#999999";^M
  var legendImg = eval("document." + widget.value + "LegendImg");^M
  if (legendImg) {^M
    legendImg.src = "http://maps.dnr.state.mn.us/graphics/white_pixel.gif";^M
  }^M
}^M


  //
  // Functions that are called by the jBox applet or the dBox javascript code:
  // basically these provide the gateway from the applet/layers to the rest of
  // the application. Note that they are the same regardless of implementation.
  // You may want to swipe some of this code.
  //
  // jBox/dBox errors are passed to the browser via this function
  function seterror_handler(name, message) { alert(message); }

  // allows jBox/dBox to reset without redrawing
  function reset_handler(name, minx, miny, maxx, maxy) { }

  // called from jBox/dBox when the user initiates change
  function setbox_handler(name, minx, miny, maxx, maxy) {
    if(name == 'reference') {           
      ms.applyreference(minx, miny);
      ms.draw();
    } else {
      if(ms.mode == 'map') {
        if(minx != maxx && miny != maxy)
          ms.applybox(minx, miny, maxx, maxy);
        else
          ms.applyzoom(minx, miny);       
        ms.draw();           
      } else if(ms.mode != 'map') {
        ms.applyquerybox(minx, miny, maxx, maxy);
        ms.applyquerypoint(minx, miny);
        ms.query(); // builds query URL
        querywin = window.open(ms.url, 'querywin');
        querywin.focus();
      }
    }
  }

  // various event handlers called by jBox/dBox
  function mousemove_handler(name, x, y) {
    var text = '';
    var utm = new Point(Number(ms.extent[0] + x*ms.cellsize), Number(ms.extent[3] - y*ms.cellsize));
    var latlon = UTMToGeographic(15, utm);

    text = "&nbsp;UTM Coordinates:  x =" + Math.round(utm.x) + " and y = " + Math.round(utm.y);
 
    text = text + ", latitude = " + latlon.y.toFixed(8) + " and longitude = " + latlon.x.toFixed(8);
    
    xInnerHtml("coords", text);
  }
  function mouseexit_handler(name) { xInnerHtml("coords", "&nbsp;"); }
  function mouseenter_handler(name) { xInnerHtml("coords", "&nbsp;"); }

  function measure_handler(name, s, t, n, a) {    
    var text = '&nbsp;Distance: ' + Math.round(t*ms.cellsize) + " meters (" + n + " points)";
    xInnerHtml("measure", text);
  }

  //
  // LandView Specific Functions: these are associated with the various icons
  // and form controls on the page. You may or may not care about these.
  // 
  function change_scale() {
    var x = (ms.extent[0] + ms.extent[2])/2.0;
    var y = (ms.extent[1] + ms.extent[3])/2.0;
    ms.zoomscale(x, y, document.scaleform.scale.value);
    document.scaleform.scale.value = '';
    return false;
  }

  function change_zoomsize() {
    ms.zoomsize = document.options.zoomsize.options[document.options.zoomsize.selectedIndex].value;
  }

  function change_mapsize() {
    var url = "http://www.dnr.state.mn.us/maps/landview_dhtml_x.html?";
    url += "mapsize=" + document.options.mapsize.options[document.options.mapsize.selectedIndex].value;
    url += "&zoomsize=" + ms.zoomsize;
    url += "&mapext=" + ms.extent.join('+');
    url += "&layers=" + ms.getlayerlist('+');

    window.location = url;
  }

  function print() {
    var printurl = 'http://maps.dnr.state.mn.us/cgi-bin/lvprint.pl?map=' + ms.mapfile +
                   '&mapext=' + ms.extent.join('+') +                 
  	           '&layers=' + ms.getlayerlist('+') +
	           ms.options;
    openPopup(640,480, printurl,'printwin');
  }

  function pan(direction) {
    domouseclick('pan');
    ms.pan(direction);
  }

  function domouseclick(button) {
    var img;
    var last_active_button;

    last_active_button = active_button;
    active_button = '';

    for(var i=0; i<buttons.length; i++)
      domouseout(buttons[i]);
        
    img = eval("document." + button);
    img.src = gpath + "/" + button + '_down.gif';

    if(button == 'state') {
      ms.mode = 'map';
      ms.setextent(155791.714648, 4720323.238005, 794359.124023, 5570749.155271);
      domouseclick('zoomin');
      ms.draw();
    } else if(button == 'info') {
      // document.main.setcursor("hand");	  
      ms.mode = "query";
      ms.boxoff();
      active_button = button;
    } else if(button == 'help') {
      openPopup(500, 350, vpath + "/help_java.html", "helpwin");
      active_button = last_active_button;
      domouseout(button);
      img = eval("document." + active_button);
      img.src = gpath + "/" + active_button + '_down.gif';
    } else if(button == 'printicon') {
      print();
      active_button = last_active_button;
      domouseout(button);
      img = eval("document." + active_button);
      img.src = gpath + "/" + active_button + '_down.gif';
    } else {
      // document.main.setcursor("crosshair");
      ms.mode = "map";
      if(button == 'zoomin') {
	    ms.zoomdir = 1;            
	    ms.boxon();
      } else if(button == 'zoomout') { 
	    ms.zoomdir = -1;
	    ms.boxoff();
      } else {
	    ms.zoomdir = 0;
	    ms.boxoff();
      }
      active_button = button;
    }
  }  

  function domouseover(button) {
    var img;

    if(button == active_button) return;

    img = eval("document." + button);
    img.src = gpath + "/" + button + '_over.gif';
  }

  function domouseout(button) {
    var img;

    if(button == active_button) return;

    img = eval("document." + button);
    img.src = gpath + "/" + button + '.gif';
  }

  window.onresize = function() {
    main.sync();
    reference.sync();
    legend.sync();     
  }

  window.onload = function() {
    main.initialize();
    reference.initialize();
    // MP// legend.initialize();
    
    domouseclick('zoomin');
    // document.main.setcursor("crosshair");
    set_select(document.options.mapsize, mapsize);
    set_select(document.options.zoomsize, ms.zoomsize);
    ms.draw();    
  }

