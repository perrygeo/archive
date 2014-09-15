/******************************************************************************
 * mww.js
 * Mapserver Web Widgets javascript class 
 * written by Matt Perry, Gregor Mosheh. All rights reserved.
 * Based on the Landview DHTML application by Steve Lime and others.
 ***************************************************************************** */

/* ============================================================================
 * The mwwMap class : The main object and the only one web desingers will 
 *   interact with. Exposed as the "mww" object.
 */
function mwwMap() {

  /* -------------------------------------------------
   * Variables and prototypes
   */
  this.display = new mwwMapDisplay(Width,Height);   // a mwwMapDisplay object
  this.layers = new mwwLayerControl(Layers,Layerstatus,Layergroups);        // a mwwLayerControl object
  this.zoombar = new mwwZoombar(Minscale,Maxscale); // a mwwZoombar object
  this.scalebox = new mwwScalebox();                // a mwwScaleBox object
  this.coordinates = new mwwCoordinateDisplay();    // a mwwCoordinateDisplay object
  this.refmap = new mwwRefmap(Refwidth,Refheight);  // a mwwRefmap object
  this.compass = new mwwCompass();                  // a mwwCompass object
  this.scalebar = new mwwScalebar();                // a mwwScalebar objectO
  this.measurement = new mwwMeasurement();          // a mwwMeasurement object
  this.toolbar = new mwwToolbar();                  // a mwwToolbar object
  this.queryoutput = new mwwQueryOutput();          // a mwwQueryOutput object
  this.legend = new mwwLegend();                    // a mwwLegend object 
  this.waiting = new mwwWaiting();                  // a mwwWaiting object
  this.resize = new mwwResize();                  // a mwwResize object
  this.imagedir = ImageDir;

  /* -------------------------------------------------
   * MapDisplay: represents the map image
   */
  function mwwMapDisplay(width, height) {
    this.width = width;
    this.height = height;
    this.embedScalebar = false;
    this.panArrows = true;
    this.waiting = true;
    this.getUrl = function() {
      return ms.url;
    }
    this.draw = function() {
      document.write("<table class=\"mwwDisplay\" cellspacing=0><tr>");

      if (this.panArrows) {
        document.write("<td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('nw');\"> <img src=\"" + mww.imagedir + "/nw.gif\"> </td> ");
        document.write("<td class=\"mwwPanarrows\" align=\"center\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('n');\"> <img src=\"" + mww.imagedir + "/n.gif\"> </td> ");
        document.write("<td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('ne');\"> <img src=\"" + mww.imagedir + "/ne.gif\"></td> ");
        document.write("</tr><tr>");
        document.write("<td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('w');\"> <img src=\"" + mww.imagedir + "/w.gif\"> </td>");
      }

      document.write("<td><img id=\"main\" border=1 src=\"" + mww.imagedir + "/spacer.gif\" height=\"" + this.height + "\" width=\"" + this.width + "\"></td>");

      if (this.panArrows) {
        document.write("<td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('e');\"><img src=\"" + mww.imagedir + "/e.gif\"></td>");
        document.write("</tr><tr><td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('sw');\"> <img src=\"" + mww.imagedir + "/sw.gif\"></td> ");
        document.write("<td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" align=\"center\" onClick=\"mww.compass.pan('s');\"> <img src=\"" + mww.imagedir + "/s.gif\"></td> ");
        document.write("<td class=\"mwwPanarrows\" onMouseOver=\"this.className='mwwPanarrowsOver';\" onMouseOut=\"this.className='mwwPanarrows';\" onClick=\"mww.compass.pan('se');\"> <img src=\"" + mww.imagedir + "/se.gif\"></td> ");
      }

      document.write("</tr></table>");
      
      if (this.waiting) {
        document.write("<div id=\"wait\" style=\"position:absolute\"><img src=\"" + mww.imagedir + "/eartha.gif\"></div>");
        wait = document.getElementById('wait');
        mapOrigin = document.getElementById('main');
        xMoveTo(wait, xPageX(mapOrigin)+5, xPageY(mapOrigin)+5); 
        //alert(xPageX(wait) + " " + xPageY(wait));
        //alert(xPageX(mapOrigin) + " " + xPageY(mapOrigin));
      }
     
    }
    this.setColor = function(color) {
      main.color = color;
    }
    this.toggleScalebar = function() {
      if (this.embedScalebar) {
        ms.options = "";
        this.embedScalebar = 0;
      } else {
        ms.options = "&map_scalebar_status=embed";
        this.embedScalebar = 1;
      }
    }
    this.setSize = function(width,height) {

      // Reset image size
      d = document.getElementById('main');
      d.src = mww.imagedir + "/spacer.gif";
      d.height = height;
      d.width = width;

      // Reset size and extents of ms object
      ms.height = height;
      ms.width = width;
      x1 = ms.extent[0];
      y1 = ms.extent[1];
      x2 = ms.extent[2];
      y2 = ms.extent[3];
      ms.setextent(x1, y1, x2, y2);
      ms.draw();

      // Reset dbox 
      main.width = width;
      main.height = height;
      xResizeTo(main.canvas, main.width, main.height);
      xMoveTo(main.canvas, xPageX(main.anchor), xPageY(main.anchor));
      xClip(main.canvas, 0, main.width, main.height, 0);
      xShow(main.canvas);
      main.offsetx = xLeft(main.canvas);
      main.offsety = xTop(main.canvas);

      // Turn off measurement tool
      main.lineon();
      main.lineoff();
      xInnerHtml('measurement', '');
    }
  }

  /* -------------------------------------------------
   * Refmap: Clickable reference map showing current extent
   */
  function mwwRefmap(width, height) {
    this.width = width;
    this.height = height;
    this.draw = function() {
      document.write("<img id=\"reference\" class=\"mwwRefmap\" src=\"" + mww.imagedir + "/spacer.gif\" width=\"" + this.width + "\" height=\"" + this.height + "\"> ");
    }
  }

  /* ---------------------------------e[e.selectedIndex]----------------
   * LayerControls: turns individual layers on and off
   */
  function mwwLayerControl(layers,status,groups) {
    this.layers = layers;
    this.status = status;
    this.groups = groups;
    this.exclusiveGroup = ' ';
    this.exclusiveCallback = function() {return;}
    var html = new Array();
    var option = new Array();
    var checked = '';
    // TBD handle layer groupings, initial status
    this.draw = function() {
      document.write("<div class=\"mwwLayers\"> <form name=\"layers\" id=\"layersform\">");
      for (key in this.layers) {
        if (this.status[key] == 0) {
          checked = '';
        } else if (this.status[key] == 1) {
          checked = 'CHECKED';
        } else  if (this.status[key] == 2) {
          checked = 'CHECKED DISABLED';
        }
        if (!html[this.groups[key]]) { html[this.groups[key]] = '';}
        if (this.groups[key] == this.exclusiveGroup) {
          html[this.groups[key]] = html[this.groups[key]] + "<option value=\"" + this.layers[key] + "\"> " + this.layers[key] + "</option>\n";
        } else {
          html[this.groups[key]] = html[this.groups[key]] + "<tr><td><input type=\"checkbox\" name=\"foreground\" value=\"" + this.layers[key] + "\" onClick='ms.togglelayers(this.form.foreground); ms.draw();'" + checked + "></td><td>" + this.layers[key] + "</td></tr>\n";
        }
      }
      for (group in html) {
        if (group == this.exclusiveGroup) {
          document.write("<a style=\"border-width:0px;text-decoration:none;\" href=\"javascript:mww.layers.showGroup('" + group + "')\">");
          document.write("<img style=\"border:0px\" id=\"expand_" + group + "\" src=\"" + mww.imagedir + "/minus.gif\">&nbsp;"); 
          document.write("<img style=\"border:0px\" id=\"folder_" + group + "\" src=\"" + mww.imagedir + "/folder.gif\">");
          document.write("</a>" + group + "<br/>");
          document.write("<div style=\"padding-left:15px\" id=\"group_" + group + "\">");
          document.write("<select name=\"exclusive\" onChange=\"mww.layers.showExclusive(this.form.exclusive);\">");
          document.write(" <option value=\"none\"> Select a Layer </option>");
          document.write(html[group]);                  
          document.write("</select><br/><br/>");
          document.write("</div>");
        } else if (group == "__hidden__") {
          document.write("<!-- Hidden Group -->");
        } else if (group != '') {
          document.write("<a style=\"border-width:0px;text-decoration:none;\" href=\"javascript:mww.layers.showGroup('" + group + "')\">");
          document.write("<img style=\"border:0px\" id=\"expand_" + group + "\" src=\"" + mww.imagedir + "/plus.gif\">&nbsp;"); 
          document.write("<img style=\"border:0px\" id=\"folder_" + group + "\" src=\"" + mww.imagedir + "/folder.gif\">");
          document.write("</a>" + group + "<br/>");
          document.write("<div style=\"display:none; padding-left:15px\" id=\"group_" + group + "\"><table class=\"mwwLayers\">");
          document.write(html[group]);
          document.write("</table></div>");
        } else {
          document.write("<div id=\"group_none\"><table>");
          document.write(html[group]);
          document.write("</table></div>");    
        }
      }
      document.write("</form></div>");


    }
    this.showGroup = function(groupname) {
      groupid = "group_" + groupname;
      folderid = "folder_" + groupname;
      expandid = "expand_" + groupname;
      thediv = document.getElementById(groupid);
      folderimg = document.getElementById(folderid);
      expandimg = document.getElementById(expandid);
      if (thediv.style.display == "none") {
        thediv.style.display = "block";
        folderimg.src = mww.imagedir + "/folderopen.gif"
        expandimg.src = mww.imagedir + "/minus.gif"
      } else {
        thediv.style.display = "none";
        folderimg.src = mww.imagedir + "/folder.gif"
        expandimg.src = mww.imagedir + "/plus.gif"
        //alert(thediv.className);
      }      
    }
    this.showExclusive = function(e) {
      ms.togglelayers(e); 
      ms.draw();
      if (this.exclusiveCallback) {
        this.exclusiveCallback(e[e.selectedIndex].value);
      }
    }
  }

  /* -------------------------------------------------
   * Zoombar: multi-level bar to zoom in/out at set scales
   */
  function mwwZoombar(minscale,maxscale) {
    this.minscale = minscale;
    this.maxscale = maxscale;
    this.zoomstep = 2;
    this.steps = 6;
    this.zoomScales = new Array();
    var zoomMultiplier = Math.pow((this.maxscale/this.minscale), 0.17);

    for (i=0 ; i<this.steps; i=i+1) { 
      thescale = this.minscale * Math.pow(zoomMultiplier,i);
      this.zoomScales[i] = Math.round(thescale); 
    }
    this.zoomScales[this.steps] = this.maxscale;
    this.draw = function() {
      document.write("<div class=\"mwwZoombar\" style=\"width:0.25in;font-weight:bold;text-align:center;\">");
      document.write("<a href=\"javascript:mww.zoombar.zoomIn();\"  class=\"zoom\"><img border=\"0\" src=\"" + mww.imagedir + "/zoom_plus.gif\"></a><br/>");
      for (scale in this.zoomScales) {
        document.write("<a href=\"javascript:mww.zoombar.go(" + this.zoomScales[scale] + ");\"><img src=\"" + mww.imagedir + "/zoom_spot.gif\" style=\"border:0px;\" id=\"zoombar_" + this.zoomScales[scale] + "\"/></a><br/>");
      }
      document.write("<a href=\"javascript:mww.zoombar.zoomOut();\" class=\"zoom\"><img border=\"0\" src=\"" + mww.imagedir + "/zoom_minus.gif\"></a><br/>");
      document.write("</div>");
    }
    this.go = function(zoomvalue) {
      var x = (ms.extent[0] + ms.extent[2])/2.0;
      var y = (ms.extent[1] + ms.extent[3])/2.0;
      ms.setextentfromscale(x, y, zoomvalue);
      // TBD: zoombar_select();
      ms.draw();
    }
    this.zoomIn = function() {
      var newscale = Math.round(ms.getscale() / this.zoomstep);
      var x = (ms.extent[0] + ms.extent[2])/2.0;
      var y = (ms.extent[1] + ms.extent[3])/2.0;
      if (newscale > ms.maxscale) { newscale = ms.maxscale; }
      if (newscale < ms.minscale) { newscale = ms.minscale; }
      ms.setextentfromscale(x, y, newscale);
      ms.draw();
    }
    this.zoomOut = function() {
      var newscale = Math.round(ms.getscale() * this.zoomstep);
      var x = (ms.extent[0] + ms.extent[2])/2.0;
      var y = (ms.extent[1] + ms.extent[3])/2.0;
      if (newscale > ms.maxscale) { newscale = ms.maxscale; }
      if (newscale < ms.minscale) { newscale = ms.minscale; }
      ms.setextentfromscale(x, y, newscale);
      ms.draw();
    }
    this.update = function() {
      var target = parent;
      // iterate thru the scales that exist, and see which one is closest to our current scale
      var lowest_delta = 209715200;
      var selected_scale = 0;
      for (scale in this.zoomScales) {
         var this_delta = Math.abs(this.zoomScales[scale] - ms.getscale());
         if (this_delta < lowest_delta) { lowest_delta=this_delta; selected_scale=this.zoomScales[scale]; }
      }
      // iterate thru the scale buttons, and change them to their appropriate state
      for (scale in this.zoomScales) {
         var zoompoint = document.getElementById('zoombar_'+this.zoomScales[scale]);
         zoompoint.src = this.zoomScales[scale]==selected_scale ? mww.imagedir + '/zoom_diamond.gif' : mww.imagedir + '/zoom_spot.gif';
      }
    }
  }

  /* -------------------------------------------------
   * Compass: Clickable naviagtion tool to pan the map
   */
  function mwwCompass() {
    this.pansize = 0.66; // 1 eq. A full map frame in given direction
    this.draw = function() {
      document.write("<div><img class=\"mwwCompass\" src=\"" + mww.imagedir + "/compass.gif\" border=\"0\" usemap=\"#compassrose_nav\"  /> <br/>");
      document.write("<map name=\"compassrose_nav\">");
      document.write("<area shape=\"poly\" coords=\"0,37 21,31 36,36 20,46 0,37\"   href=\"javascript:mww.compass.pan('w');\"  title=\"go west\" />");
      document.write("<area shape=\"poly\" coords=\"9,10 19,31 36,36 29,22 9,10\"   href=\"javascript:mww.compass.pan('nw');\" title=\"go northwest\" />");
      document.write("<area shape=\"poly\" coords=\"36,36 44,22 36,0 30,22 36,36\"  href=\"javascript:mww.compass.pan('n');\"  title=\"go north\" />");
      document.write("<area shape=\"poly\" coords=\"36,36 44,21 65,12 56,30 36,36\" href=\"javascript:mww.compass.pan('ne');\" title=\"go northeast\" />");
      document.write("<area shape=\"poly\" coords=\"36,36 54,31 73,38 53,45 36,36\" href=\"javascript:mww.compass.pan('e');\"  title=\"go east\" />");
      document.write("<area shape=\"poly\" coords=\"36,36 55,46 65,65 45,57 36,36\" href=\"javascript:mww.compass.pan('se');\" title=\"go southeast\" />");
      document.write("<area shape=\"poly\" coords=\"36,36 45,56 37,74 30,56 36,36\" href=\"javascript:mww.compass.pan('s');\"  title=\"go south\" />");
      document.write("<area shape=\"poly\" coords=\"36,36 31,56 8,65 19,46 36,36\"  href=\"javascript:mww.compass.pan('sw');\" title=\"go southwest\" />");
      document.write("</map></div>");
    }
    this.pan = function(dir) {
      ms.pansize = this.pansize;
      ms.pan(dir);
    }
  }

  /* -------------------------------------------------
   * Scalebox: represents nominal scale of current map image
   */
  function mwwScalebox() {
    this.draw = function() {
      document.write("<p class=\"mwwScalebox\"> <form name=\"scaleform\" action=\"javascript:void(0)\" onSubmit=\"return mww.scalebox.setScale();\">");
      document.write("1 : <input class=\"mwwFormInput\" type=\"text\" name=\"scale\" size=\"10\" maxlength=\"7\">");
      document.write("<input class=\"mwwFormButton\" type=\"submit\" value=\"Reset\"> </form> </p>");
    }
    this.getScale = function() {
      return ms.getscale;
    }
    this.setScale = function() {
      var x = (ms.extent[0] + ms.extent[2])/2.0;
      var y = (ms.extent[1] + ms.extent[3])/2.0;
      ms.zoomscale(x, y, document.scaleform.elements['scale'].value);
      thescale = ms.getscale();
      document.scaleform.elements['scale'].value = Math.round(thescale);
      return false;
    }
    this.update = function() {
      //update the scale form
      thescale = ms.getscale();
      if (document.scaleform) {
        document.scaleform.elements['scale'].value = Math.round(thescale);
      }
    }
  }

  /* -------------------------------------------------
   * CoordianteDisplay: Shows current position of mouse over map
   */
  function mwwCoordinateDisplay() {
    this.decimalPlaces = 5;
    this.delimiter = "<br/>"; 
    this.displayMode = "d";
    this.draw = function() {
      document.write("<div class=\"mwwCoordinates\" id=\"coords\"></div>");
    }
    this.update = function(coord_x,coord_y) {
      var text = '';
      if (document.getElementById('coords')) {
        //var coords = new Point(Number(ms.extent[0] + x*ms.cellsize), Number(ms.extent[3] - y*ms.cellsize));
        var roundFactor = Math.pow(10,this.decimalPlaces);
        if (this.displayMode == "dm") {
          // "N DD MM.MMMM"
          var xd = Math.floor(Math.abs(coord_x));
          var yd = Math.floor(Math.abs(coord_y));
          var xm = (Math.round(roundFactor*((Math.abs(coord_x)-xd)*60)))/roundFactor;
          var ym = (Math.round(roundFactor*((Math.abs(coord_y)-yd)*60)))/roundFactor; 
          if (coord_x > 0) { var xdir = 'E'; } else { var xdir = 'W'; }
          if (coord_y > 0) { var ydir = 'N'; } else { var ydir = 'N'; }
          var disp_x = xdir + " " + Math.abs(xd) + " " + xm; 
          var disp_y = ydir + " " + Math.abs(yd) + " " + ym;
        } else { 
          // "-DD.DDDDDDD"
          var disp_x = (Math.round(roundFactor*coord_x))/roundFactor;
          var disp_y = (Math.round(roundFactor*coord_y))/roundFactor;
        } 
        //TBD: gracefully handle different projections in coordinate output
        //TBD: report units
        text = "<div>x = " + disp_x + " " + this.delimiter + " " + "y = " + disp_y + " </div>";
        xInnerHtml("coords", text);
      }
    }
  }
 
  /* -------------------------------------------------
   * Scalebar: graphical scale bar generated by mapserver
   */
  function mwwScalebar() {
    this.units = 'mi';
    this.draw = function() {
      document.write("<div>");
      if (this.units == 'mi') {
        document.write("<img class=\"mwwScalebar\" align=\"left\" name=\"scalebar_miles\" src=\"" + MapServer + "?map=" + Mapfile + "&map_scalebar_units=miles&mode=scalebar&mapext=0+0+" + (ms.extent[2] - ms.extent[0]) + "+" + (ms.extent[3] - ms.extent[1]) + "&mapsize=" + ms.width + "+" + ms.height + "\" border=\"0\">");
      } else if (this.units == 'km') {
        document.write("<img class=\"mwwScalebar\" align=\"left\" name=\"scalebar_kilometers\" src=\"" + MapServer + "?map=" + Mapfile + "&map_scalebar_units=kilometers&mode=scalebar&mapext=0+0+" + (ms.extent[2] - ms.extent[0]) + "+" + (ms.extent[3] - ms.extent[1]) + "&mapsize=" + ms.width + "+" + ms.height + "\" border=\"0\">");
      }
      document.write("</div>");
    }
    this.update = function() {
      // update the scalebars    
      if (document.scalebar_miles) {
        document.scalebar_miles.src = MapServer + "?map=" + Mapfile + "&map_scalebar_units=miles&mode=scalebar&mapext=0+0+" + (ms.extent[2] - ms.extent[0]) + "+" + (ms.extent[3] - ms.extent[1]) + "&mapsize=" + ms.width + "+" + ms.height;
      }
      if (document.scalebar_kilometers) {
       document.scalebar_kilometers.src = MapServer + "?map=" + Mapfile + "&map_scalebar_units=kilometers&mode=scalebar&mapext=0+0+" + (ms.extent[2] - ms.extent[0]) + "+" + (ms.extent[3] - ms.extent[1]) + "&mapsize=" + ms.width + "+" + ms.height;
      }
    }
  }
 

  /* -------------------------------------------------
   * Measurement Tool: measure coordinate distances on the map
   */
  function mwwMeasurement() {
    this.scaleFactor = 1;   
    this.showNumPoints = false;
    this.roundFactor = 10000; // 4 dec places
    this.draw = function() {
      document.write("<div class=\"mwwMeasurement\"> <u>Measure</u>:");
      document.write("<a style=\"color:#3333cc\" href=\"javascript:main.lineon(); xInnerHtml('measurement', '&nbsp;');\">[On]</a>&nbsp;");
      document.write("<a style=\"color:#3333cc\" href=\"javascript:main.lineon(); main.lineoff(); xInnerHtml('measurement', '&nbsp;');\">[Off]</a>"); 
      document.write("<div id=\"measurement\">&nbsp;</div> </div>");
      if (ms.units == 1) {
        this.units = "feet";
        this.roundFactor = 10; // 1 dec place   
      } else if (ms.units == 3) {
        this.units = "meters";
        this.roundFactor = 10; // 1 dec place
      } else {
        this.units = "units";
        this.roundFactor = 10000; // 4 dec places
      }
    }
    this.update = function (t,n) {
      // UPDATED SPECIFICALLY FOR PCJV
      // ASSUMES UNITS ARE IN METERS
      if (this.units == 'meters') {
        this.scaleFactor = 1;
        this.roundFactor = 10;
        var text = Math.round(this.roundFactor*(t*ms.cellsize*this.scaleFactor))/this.roundFactor + " meters<br/>";
        this.scaleFactor = 3.280839895; // meters -> feet
        text = text + Math.round(this.roundFactor*(t*ms.cellsize*this.scaleFactor))/this.roundFactor + " feet<br/>";
        this.scaleFactor = 0.000621371; // meters -> miles
        this.roundFactor = 1000;
        text = text + Math.round(this.roundFactor*(t*ms.cellsize*this.scaleFactor))/this.roundFactor + " miles<br/>";
        this.scaleFactor =  0.001; //meters -> km
        text = text + Math.round(this.roundFactor*(t*ms.cellsize*this.scaleFactor))/this.roundFactor + " kilometers<br/>";
      } else {
        var text = "Distance: " + Math.round(this.roundFactor*(t*ms.cellsize*this.scaleFactor))/this.roundFactor + this.units;
      }

      if (this.showNumPoints) { text = text + " (" + n + " points)"; }
      if (document.getElementById('measurement')) {
        xInnerHtml("measurement", text);
      } 
    }
  }


  /* -------------------------------------------------
   * Toolbar: buttons for various purposes including printing,
   *  bookmarking and selecting active tool for map clicks
   * Also includes waiting image to indicate map is still redrawing.
   */
  function mwwToolbar() {
    var buttons = new Array('state', 'zoomin', 'pan', 'zoomout', 'info', 'printicon');
    var active_button = '';
    this.orientation = 'vertical';
    this.draw = function() {
      if (this.orientation == 'vertical') {
        document.write("<table class=\"mwwToolbar\" border=\"0\" cellspacing=\"2\" cellpadding=\"0\" align=\"center\">");
        document.write("  <tr><td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('state')\" onMouseOver=\"mww.toolbar.over('state')\" onMouseOut=\"mww.toolbar.out('state')\"><img name=\"state\" src=\"" + mww.imagedir + "/state.gif\" border=\"0\" alt=\"view whole state\"></a></td></tr>");
        document.write("  <tr><td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('pan')\" onMouseOver=\"mww.toolbar.over('pan')\" onMouseOut=\"mww.toolbar.out('pan')\"><img name=\"pan\" src=\"" + mww.imagedir + "/pan.gif\" border=\"0\" alt=\"recenter map\"></a></td></tr>");
        document.write("  <tr><td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('zoomin')\" onMouseOver=\"mww.toolbar.over('zoomin')\" onMouseOut=\"mww.toolbar.out('zoomin')\"><img name=\"zoomin\" src=\"" + mww.imagedir + "/zoomin.gif\" border=\"0\" alt=\"zoom in\"></a></td></tr>");
        document.write("  <tr><td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('zoomout')\" onMouseOver=\"mww.toolbar.over('zoomout')\" onMouseOut=\"mww.toolbar.out('zoomout')\"><img name=\"zoomout\" src=\"" + mww.imagedir + "/zoomout.gif\" border=\"0\" alt=\"zoom out\"></a></td></tr>");
        document.write("  <tr><td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('info')\" onMouseOver=\"mww.toolbar.over('info')\" onMouseOut=\"mww.toolbar.out('info')\"><img name=\"info\" src=\"" + mww.imagedir + "/info.gif\" border=\"0\" alt=\"get feature information\"></a></td></tr>");
        document.write("  <tr><td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('printicon')\" onMouseOver=\"mww.toolbar.over('printicon')\" onMouseOut=\"mww.toolbar.out('printicon')\"><img name=\"printicon\" src=\"" + mww.imagedir + "/printicon.gif\" border=\"0\" alt=\"print this map\"></a></td></tr>");
        document.write("</table>");
      } else {
        document.write("<table class=\"mwwToolbar\" border=\"0\" cellspacing=\"2\" cellpadding=\"0\" align=\"center\"><tr>");
        document.write("  <td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('state')\" onMouseOver=\"mww.toolbar.over('state')\" onMouseOut=\"mww.toolbar.out('state')\"><img name=\"state\" src=\"" + mww.imagedir + "/state.gif\" border=\"0\" alt=\"view whole state\"></a></td>");
        document.write("  <td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('pan')\" onMouseOver=\"mww.toolbar.over('pan')\" onMouseOut=\"mww.toolbar.out('pan')\"><img name=\"pan\" src=\"" + mww.imagedir + "/pan.gif\" border=\"0\" alt=\"recenter map\"></a></td>");
        document.write("  <td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('zoomin')\" onMouseOver=\"mww.toolbar.over('zoomin')\" onMouseOut=\"mww.toolbar.out('zoomin')\"><img name=\"zoomin\" src=\"" + mww.imagedir + "/zoomin.gif\" border=\"0\" alt=\"zoom in\"></a></td>");
        document.write("  <td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('zoomout')\" onMouseOver=\"mww.toolbar.over('zoomout')\" onMouseOut=\"mww.toolbar.out('zoomout')\"><img name=\"zoomout\" src=\"" + mww.imagedir + "/zoomout.gif\" border=\"0\" alt=\"zoom out\"></a></td>");
        document.write("  <td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('info')\" onMouseOver=\"mww.toolbar.over('info')\" onMouseOut=\"mww.toolbar.out('info')\"><img name=\"info\" src=\"" + mww.imagedir + "/info.gif\" border=\"0\" alt=\"get feature information\"></a></td>");
        document.write("  <td align=\"center\" valign=\"middle\"><a href=\"javascript:mww.toolbar.click('printicon')\" onMouseOver=\"mww.toolbar.over('printicon')\" onMouseOut=\"mww.toolbar.out('printicon')\"><img name=\"printicon\" src=\"" + mww.imagedir + "/printicon.gif\" border=\"0\" alt=\"print this map\"></a></td>");
        document.write("</tr></table>");
      }
    }
    this.out = function(button) {
      var img;
      if(button == active_button) return;
      img = eval("document." + button);
      img.src = mww.imagedir + "/" + button + '.gif';
    }
    this.over = function(button) {
      var img;
      if(button == active_button) return;
      img = eval("document." + button);
      img.src = mww.imagedir + "/" + button + '_over.gif';
    }
    this.click = function(button) {
      var img;
      var last_active_button;
      last_active_button = active_button;
      active_button = '';

      for(var i=0; i<buttons.length; i++) {
        this.out(buttons[i]);
      }

      img = eval("document." + button);
      img.src = mww.imagedir + "/" + button + '_down.gif';

      if(button == 'state') {
        ms.mode = 'map';
        ms.setextent(Fullextent[0],Fullextent[1],Fullextent[2],Fullextent[3]);
        this.click('zoomin');
        ms.draw();
      } else if(button == 'info') { 
        ms.mode = "query";
        ms.boxoff();
        active_button = button;
      } else if(button == 'printicon') {
        var url = ms.url;
        openPopup(450, 300, url,'printwin','menubar=1,toolbar=1,location=1,directories=0,status=0,scrollbars=1,resizable=1,alwaysRaised=0');
        active_button = last_active_button;
        this.out(button);
        img = eval("document." + active_button);
        img.src = mww.imagedir + "/" + active_button + '_down.gif';
      } else {
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
  }

  /* -------------------------------------------------
   * Query output: Any tool returning textual info can choose to output here
   * Tools should check for "resultsFrame" and output to popup instead if not present.
   */
  function mwwQueryOutput() {
    this.draw = function() {
      document.write("<iframe class=\"mwwQueryoutput\" src=\"\" id=\"resultsFrame\"></iframe>");
    } 
  }

  /* -------------------------------------------------
   * Legend: Graphic explaining the map symbols
   * For now this is the simple version: a single image generated by mapserver
   */
  function mwwLegend() {
    this.draw = function() {
      document.write("<div><img class=\"mwwLegend\" align=\"left\" id=\"legendimg\" name=\"legendimg\" src=\"" + MapServer + "?map=" + Mapfile + "&mode=legend&mapext=" + ms.extent[0] + "+" + ms.extent[1] + "+" + ms.extent[2] + "+" + ms.extent[3] + "&mapsize=" + ms.width + "+" + ms.height + "&layers=" + ms.getlayerlist('+') + "\" border=\"0\"> </div>");
    } 
    this.update = function() {
      if (document.getElementById('legendimg')) {
       document.getElementById('legendimg').src = MapServer + "?map=" + Mapfile + "&mode=legend&mapext=" + ms.extent[0] + "+" + ms.extent[1] + "+" + ms.extent[2] + "+" + ms.extent[3] + "&mapsize=" + ms.width + "+" + ms.height + "&layers=" + ms.getlayerlist('+');
      }
    }
  }


  /* -------------------------------------------------
   * Waiting Image: Made visible when new map is requested
   *   turned off when map arrives.
   */
  function mwwWaiting() {
    this.mapSync = true;
    this.draw = function() {
      document.write("<span align=top id=\"wait\"><img src=\"" + mww.imagedir + "/eartha.gif\"></span>");
      wait = document.getElementById('wait');
      xMoveTo(wait, xPageX(main.anchor), xPageY(main.anchor));
    }
   
  }

  /* -------------------------------------------------
   * Resize: Change Map Size 
   */
  function mwwResize() {
    this.draw = function() {
      document.write("<p class=\"mwwResize\">\n");
      document.write("<a class=\"mwwResize\" style=\"font-size:7pt;\" href=\"javascript:mww.resize.setSize('s');\">S</a>\n");
      document.write("<a class=\"mwwResize\" style=\"font-size:9pt;\" href=\"javascript:mww.resize.setSize('m');\">M</a>\n");
      document.write("<a class=\"mwwResize\" style=\"font-size:11pt;\" href=\"javascript:mww.resize.setSize('l');\">L</a>\n");
      document.write("<a class=\"mwwResize\" style=\"font-size:12pt;\" href=\"javascript:mww.resize.setSize('xl');\">XL</a>\n");
      document.write("</p>");
    }
    this.setSize = function(size) {
       var x = 0;
       var y = 0;
       if (size == 's') { x=450; y=400; }
       else if (size == 'm') { x=585; y=520; }
       else if (size == 'l') { x=720; y=640; }
       else if (size == 'xl') { x=855; y=760; }
       mww.display.setSize(x,y);
    }
  }

}

// Create the main mww object
var mww = new mwwMap();


  /* ==========================================================================
   * 
   * DHTML objects - the drawing layer on top of the map
   *
   */
  // the DHTML main mapping window (note the significance of the name "main" here and with the Mapserv object)
  var main = new dBox("main");
  main.color = "orange";
  main.thickness = 2;
  main.verbose = true;
  // the DHTML reference map
  var reference = new dBox("reference");
  reference.box = true;

  /* ==========================================================================
   *
   * Mapserv object- manages coordinates, scale, units, constructing mapserver urls
   *
   */
  var ms = new Mapserv("main", Mapfile, Fullextent[0],Fullextent[1],Fullextent[2],Fullextent[3], Width, Height);  // ALTER EXTENTS
  ms.projection = Projection;
  ms.units = Units;
  if (ms.units == 1) {
     var units = "feet";
     ms.InchesPerMapUnit = 12;
  } else if (ms.units == 3) {
     ms.InchesPerMapUnit = 39.3701; 
  } else if (ms.units == 5) {
     // A degree of lattitude is about 49 miles (3104640 inches) at 45 North
     // because this varies with distance from equator, this is a *major* assumption
     // and will cause scale calculations to be way off in some cases
     ms.InchesPerMapUnit = 3104640;
  }
  ms.queryfile = Mapfile;
  ms.minscale = Minscale;
  ms.maxscale = Maxscale; 
  ms.zoomsize = 3;
  // Add the reference map
  ms.referencemap = new Mapserv("reference", Mapfile, Refextent[0],Refextent[1],Refextent[2],Refextent[3], Refwidth, Refheight);


  /* ==========================================================================
   * dBox Event Handler Functions
   * provide the gateway from the applet/layers to the rest of the application. 
   * required by the DBOX objects to handle mouse events over the map and refmap
   */

  // jBox/dBox errors are passed to the browser via this function
  function seterror_handler(name, message) { alert(message); }

  // allows jBox/dBox to reset without redrawing
  function reset_handler(name, minx, miny, maxx, maxy) { 
  }

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
        // TBD: allow box queries
        ms.applyquerybox(minx, miny, maxx, maxy);
        ms.applyquerypoint(minx, miny);
        ms.query(); // builds query URL
        if (document.getElementById('resultsFrame')) {
          document.getElementById('resultsFrame').src = ms.url;
        } else {
          updatePopup(300, 300, ms.url, 'Query_popup');   
        }  

      }
    }
  }

  function mousemove_handler(name, x, y) {
    coord_x = Number(ms.extent[0] + x*ms.cellsize);
    coord_y = Number(ms.extent[3] - y*ms.cellsize);
    mww.coordinates.update(coord_x,coord_y);
  }

  function mouseexit_handler(name) {
    var text = ''; 
    if (document.getElementById('coords')) {
      xInnerHtml("coords", text);
    }
  }

  function mouseenter_handler(name) {    var text = ''; }

  function measure_handler(name, s, t, n, a) {   
    if (mww.digitizer.status == 'on') {
      mww.digitizer.update(t,n);
    } else {
      //alert( name + " " + t + " " + n );
      mww.measurement.update(t,n);
    }
  }

  /* ==========================================================================
   * Extensions to Mapserv.draw(): this allows you to exend the capabilties of
   * of the default draw method. Anything that needs to happen when the map gets
   * redrawn should be coded here.
   *
   */

  function predraw() {
    toggleRedraw('on');
  }

  function postdraw() {
    mww.scalebar.update();
    mww.scalebox.update();
    mww.legend.update();
    mww.zoombar.update();
    // update the layer list
    //checkLayerControls(document.layers.foreground);
  }

  // Turns the waiting message/spinning globe on/off 
  // To indicate whether the interface is waiting for an image from the server
  function toggleRedraw(status) {
    if(document.getElementById('wait')) {
      if (status == 'on') {
        document.getElementById('wait').style.display = 'block';
      } else {
        document.getElementById('wait').style.display = 'none';
      }
    }
  }

  // this provides a consistent interface to have the map redrawn.
  // in this case, it just called ms.draw() and does nothing else
  // Mostly just here for backwards-compatibility
  function updateMap() {
    //Anything else should be handled by pre and postdraw functions
    ms.draw();
  }


  /* =========================================================================
   * Initialization (on page load)
   */
  window.onload = function() {
    main.initialize();
    reference.initialize();        
    mww.toolbar.click('zoomin');
    ms.togglelayers(document.getElementById('layersform').foreground); 
    ms.draw();
  }


