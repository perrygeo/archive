// Support functions for advanced web clients using the
// MapServer. Original coding 02-25-2000. - SDL -
//
// Re-write for MapServer 3.6+ and DHTML standardization July 2002. - SDL -
// Simplified layer handling with the addition of DHTML legend containers (11/4/2004). - SDL -

// Global variables
var Interface = 'java';

var DrawOnLayerChange = false;
var DrawOnChange = false;
var QueryOnChange = false;

var MapServer = ""; // these need to be set/initialized by the application
var QueryServer = "";
var PrintServer = "";

var ReferenceXY = new Array(-1, -1);
var ImageBox = new Array(-1,-1,-1,-1);
var ImageXY = new Array(-1, -1);
var MapXY = new Array(-1, -1);

var PixelsPerInch = 72; // these can be overridden, defaults are for meters
//var InchesPerMapUnit = 39.3701;

function Mapserv(name, mapfile, minx, miny, maxx, maxy, width, height)
{
  this.mode = 'map';

  this.name = name; // name of applet or image
  this.url = '';
  
  this.layers = new Array(); // associative array of layer status, the key is the layer name

  this.mapfile = mapfile;
  this.queryfile = mapfile;

  this.extent = new Array(minx, miny, maxx, maxy);
  
  this.queryextent = new Array(-1, -1, -1, -1);
  this.querypoint = new Array(-1, -1);

  this.width = width;
  this.height = height;

  this.options = '';
  this.queryoptions = '';

  this.referencemap = null;
  
  this.cellsize = AdjustExtent(this.extent, this.width, this.height);
  this.defaultextent = this.extent;

  this.zoomsize = 2;
  this.zoomdir = 0; // pan to start

  this.minscale = -1;
  this.maxscale = -1;

  this.pansize = .8;
  this.InchesPerMapUnit = 39.3701; // default meters . for feet set to 12

  this.box = true; // allow box drawing (or not)
}

function Mapserv_boxon() {
  this.box = true; // dhtml interfaces will use this
  if(Interface == "java") eval("document." + this.name + ".boxon()");
  else eval("window." + this.name + ".boxon()");
}

function Mapserv_boxoff() {
  this.box = false; // dhtml interfaces will use this
  if(Interface == "java") eval("document." + this.name + ".boxoff()");
  else eval("window." + this.name + ".boxoff()");
}

function Mapserv_layersoff() {
  this.layers = new Array();
}

function Mapserv_setlayer(name, status) {
  this.layers[name] = status;
}

function Mapserv_getlayerlist(delimeter)
{
  var list = new Array();
  var keys;

  for (key in this.layers) {
    if(this.layers[key]) list.push(key);
  }

  return list.join(delimeter);
}

function Mapserv_togglelayers(element)
{
  var name;

  if(element.type == 'checkbox') {         
    name = element.value;

    if(element.checked)
      this.layers[name] = true;
    else
      this.layers[name] = false;
  } else {
    if(element.length == 0) return; // nothing to do

    if(element[0].type == 'checkbox' || element[0].type == 'radio') {
      for(var i=0; i<element.length; i++) {	
	name = element[i].value;

        if(element[i].checked) 
          this.layers[name] = true;
	else
          this.layers[name] = false;
      }

    } else if(element.type == 'select-one' || element.type == 'select-multiple') {
      
      for(var i=0; i<element.length; i++) {
	if(element.options[i].value) 
          name = element.options[i].value;
	else
	  name = element.options[i].name;

	if(element.options[i].selected)
	  this.layers[name] = true;
	else
	  this.layers[name] = false;	
      }

    }    
  }
  
  if(DrawOnLayerChange) {
    var oldmode = this.mode; // just in case we're in a query mode
    this.mode = 'map';
    this.draw();
    this.mode = oldmode;
  }
}

function Mapserv_applybox(minx, miny, maxx, maxy) 
{
  var temp = new Array(4);

  temp[0] = this.extent[0] + this.cellsize*minx;
  temp[1] = this.extent[3] - this.cellsize*maxy;
  temp[2] = this.extent[0] + this.cellsize*maxx;	
  temp[3] = this.extent[3] - this.cellsize*miny;

  this.extent = temp;
 
  this.cellsize = AdjustExtent(this.extent, this.width, this.height);

  if(this.minscale != -1 && this.getscale() < this.minscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.minscale);
  }
  if(this.maxscale != -1 && this.getscale() > this.maxscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.maxscale);
  }
}

function Mapserv_applyzoom(x,y)
{
  var dx, dy;
  var mx, my;
  var x, y;
  var zoom;

  if(this.zoomdir == 1 && this.zoomsize != 0)
    zoom = this.zoomsize;
  else if(this.zoomdir == -1 && this.zoomsize != 0)
    zoom = 1/this.zoomsize;
  else
    zoom = 1;

  dx = this.extent[2] - this.extent[0];
  dy = this.extent[3] - this.extent[1];
  mx = this.extent[0] + this.cellsize*x; // convert *click* to map coordinates
  my = this.extent[3] - this.cellsize*y;

  this.extent[0] = mx - .5*(dx/zoom);
  this.extent[1] = my - .5*(dy/zoom);
  this.extent[2] = mx + .5*(dx/zoom);
  this.extent[3] = my + .5*(dy/zoom);

  this.cellsize = AdjustExtent(this.extent, this.width, this.height);

  if(this.minscale != -1 && this.getscale() < this.minscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.minscale);
  }
  if(this.maxscale != -1 && this.getscale() > this.maxscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.maxscale);
  }
}

function Mapserv_applyreference(x,y)
{
  var mx, my;
  var dx, dy;

  if(!this.referencemap) return;

  dx = this.extent[2] - this.extent[0];
  dy = this.extent[3] - this.extent[1];
  mx = this.referencemap.extent[0] + this.referencemap.cellsize*x;
  my = this.referencemap.extent[3] - this.referencemap.cellsize*y;

  this.extent[0] = mx - .5*dx;
  this.extent[1] = my - .5*dy;
  this.extent[2] = mx + .5*dx;
  this.extent[3] = my + .5*dy;

  this.cellsize = AdjustExtent(this.extent, this.width, this.height);
}

function Mapserv_applyquerybox(minx, miny, maxx, maxy) 
{
  var temp = new Array(4);

  // convert to map coordinates
  // temp[0] = this.extent[0] + this.cellsize*minx;
  // temp[1] = this.extent[3] - this.cellsize*maxy;
  // temp[2] = this.extent[0] + this.cellsize*maxx;	
  // temp[3] = this.extent[3] - this.cellsize*miny;

  // leave in pixel coordinates
  temp[0] = minx;
  temp[1] = miny;
  temp[2] = maxx;
  temp[3] = maxy;

  this.queryextent = temp;
}

function Mapserv_applyquerypoint(x,y)
{
  var dx, dy;

  // convert to map coordinates
  // dx = this.extent[2] - this.extent[0];
  // dy = this.extent[3] - this.extent[1];
  // this.querypoint[0] = this.extent[0] + this.cellsize*x;
  // this.querypoint[1] = this.extent[3] - this.cellsize*y;

  // leave in pixel coordinates
  this.querypoint[0] = x;
  this.querypoint[1] = y;
}

function Mapserv_query()
{  
  var layerlist = this.getlayerlist('+');

  // point or box based queries 
  this.url = QueryServer +
            '?mode=' + this.mode +
            '&map=' + this.queryfile +
	    '&imgext=' +  this.extent.join('+') +
            '&imgxy=' +  this.querypoint.join('+') +            
            '&imgbox=' + this.queryextent.join('+') +
            '&imgsize=' + this.width + '+' + this.height;
 
  if(layerlist) this.url += '&layers=' + layerlist;
  if(this.queryoptions) this.url += this.queryoptions;	   

  return;
}

function Mapserv_draw()
{
  var layerlist = this.getlayerlist('+');
  
  var oldmode = this.mode;
  this.mode = 'map';

  if(window.predraw) window.predraw();

  if(this.referencemap) {
    this.referencemap.url = MapServer +
                            '?mode=reference' +
                            '&map=' + this.referencemap.mapfile +
                            '&mapext=' + this.extent.join('+') +
                            '&mapsize=' + this.width + '+' + this.height;
    
   if(Interface == 'java') eval("document." + this.referencemap.name + ".setimage(this.referencemap.url)");
   else eval("window." + this.referencemap.name + ".setimage(this.referencemap.url)"); 
  }

  this.url = MapServer +
       	     '?mode=' + this.mode + 
             '&map=' + this.mapfile +
             '&mapext=' + this.extent.join('+') +
             '&mapsize=' + this.width + '+' + this.height +
	     '&layers=' + layerlist +
	     this.options;

  if(Interface == 'java') eval("document." + this.name + ".setimage(this.url)");
  else eval("window." + this.name + ".setimage(this.url)");

  if(window.postdraw) window.postdraw();

  // this.queryextent = this.extent;
  this.mode = oldmode;
}

function Mapserv_zoomdefault()
{
  this.mode = map;
  this.extent = this.defaultextent;
  this.cellsize = AdjustExtent(this.extent, this.width, this.height);
  this.draw();
}

function Mapserv_setextent(minx, miny, maxx, maxy)
{
  this.extent[0] = minx;
  this.extent[1] = miny;
  this.extent[2] = maxx;
  this.extent[3] = maxy;

  this.cellsize = AdjustExtent(this.extent, this.width, this.height);

  if(this.minscale != -1 && this.getscale() < this.minscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.minscale);    
  }
  if(this.maxscale != -1 && this.getscale() > this.maxscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.maxscale);
  }
}

function Mapserv_setextentfromradius(x, y, radius)
{
  this.extent[0] = x - radius/2.0;
  this.extent[1] = y - radius/2.0;
  this.extent[2] = x + radius/2.0;
  this.extent[3] = y + radius/2.0;

  this.cellsize = AdjustExtent(this.extent, this.width, this.height);

  if(this.minscale != -1 && this.getscale() < this.minscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.minscale);    
  }
  if(this.maxscale != -1 && this.getscale() > this.maxscale) {
    x = (this.extent[2] + this.extent[0])/2;
    y = (this.extent[3] + this.extent[1])/2;
    this.setextentfromscale(x, y, this.maxscale);
  }
}

function Mapserv_zoomradius(x, y, radius)
{
  this.setextentfromradius(x, y, radius);
  this.draw();
}

function Mapserv_getscale()
{
  var gd, md;
  var InchesPerMapUnit = this.InchesPerMapUnit;

  md = (this.width-1)/(PixelsPerInch*InchesPerMapUnit);
  gd = this.extent[2] - this.extent[0];

  return(gd/md);
}

function Mapserv_setextentfromscale(x, y, scale)
{
  var InchesPerMapUnit = this.InchesPerMapUnit;

  if((this.minscale != -1) && (scale < this.minscale))
    scale = this.minscale;

  if((this.maxscale != -1) && (scale > this.maxscale))
    scale = this.maxscale;

  this.cellsize = (scale/PixelsPerInch)/InchesPerMapUnit;

  this.extent[0] = x - this.cellsize*this.width/2.0;
  this.extent[1] = y - this.cellsize*this.height/2.0;
  this.extent[2] = x + this.cellsize*this.width/2.0;
  this.extent[3] = y + this.cellsize*this.height/2.0;

  this.cellsize = AdjustExtent(this.extent, this.width, this.height);
}

function Mapserv_zoomscale(x, y, scale)
{  
  this.setextentfromscale(x, y, scale);
  this.draw();
}

function Mapserv_zoomin(x,y)
{
  this.zoomdir = 1;
  this.applyzoom(x,y);  
  this.draw();
  if(!DrawOnChange) this.boxon();
  this.zoomdir = 0;
}

function Mapserv_zoomout(x,y)
{
  if(!DrawOnChange) this.boxoff();
  this.zoomdir = -1;
  this.applyzoom(x,y);
  this.draw();
  if(!DrawOnChange) this.boxon();
  this.zoomdir = 0;
}

function Mapserv_pan(direction)
{
  if(!DrawOnChange) this.boxoff();
  this.zoomdir = 0;

  if(direction == 'n') {
    x = (this.width-1)/2.0;
    y = 0 - this.height*this.pansize + this.height/2.0;
  } else if(direction == 'nw') {
    x = 0 - this.width*this.pansize + this.width/2.0;
    y = 0 - this.height*this.pansize + this.height/2.0;
  } else if(direction == 'ne') {
    x = (this.width-1) + this.width*this.pansize - this.width/2.0;
    y = 0 - this.height*this.pansize + this.height/2.0;
  } else if(direction == 's') {
    x = (this.width-1)/2.0;
    y = (this.height-1) + this.height*this.pansize - this.height/2.0;
  } else if(direction == 'sw') {
    x = 0 - this.width*this.pansize + this.width/2.0;
    y = (this.height-1) + this.height*this.pansize - this.height/2.0;
  } else if(direction == 'se') {
    x = (this.width-1) + this.width*this.pansize - this.width/2.0;
    y = (this.height-1) + this.height*this.pansize - this.height/2.0;
  } else if(direction == 'e') {
    x = (this.width-1) + this.width*this.pansize - this.width/2.0;
    y = (this.height-1)/2.0;
  } else if(direction == 'w') {
    x = 0 - this.width*this.pansize + this.width/2.0;
    y = (this.height-1)/2.0;
  }
       
  this.applyzoom(x,y);
  this.draw();

  if(!DrawOnChange) this.boxon();
}

new Mapserv(0);

Mapserv.prototype.applybox = Mapserv_applybox; // create instance method
Mapserv.prototype.applyzoom = Mapserv_applyzoom;
Mapserv.prototype.applyreference = Mapserv_applyreference;
Mapserv.prototype.applyquerybox = Mapserv_applyquerybox;
Mapserv.prototype.applyquerypoint = Mapserv_applyquerypoint;
Mapserv.prototype.query = Mapserv_query;
Mapserv.prototype.draw = Mapserv_draw;
Mapserv.prototype.zoomdefault = Mapserv_zoomdefault;
Mapserv.prototype.setextent = Mapserv_setextent;
Mapserv.prototype.setextentfromradius = Mapserv_setextentfromradius;
Mapserv.prototype.zoomradius = Mapserv_zoomradius;
Mapserv.prototype.setextentfromscale = Mapserv_setextentfromscale;
Mapserv.prototype.zoomscale = Mapserv_zoomscale;
Mapserv.prototype.zoomin = Mapserv_zoomin;
Mapserv.prototype.zoomout = Mapserv_zoomout;
Mapserv.prototype.pan = Mapserv_pan;
Mapserv.prototype.setlayer = Mapserv_setlayer;
Mapserv.prototype.layersoff = Mapserv_layersoff;
Mapserv.prototype.getlayerlist = Mapserv_getlayerlist;
Mapserv.prototype.togglelayers = Mapserv_togglelayers;
Mapserv.prototype.getscale = Mapserv_getscale;
Mapserv.prototype.boxon = Mapserv_boxon;
Mapserv.prototype.boxoff = Mapserv_boxoff;

// Function definitions
function AdjustExtent(extent, width, height) 
{
  var cellsize = Math.max((extent[2] - extent[0])/width, (extent[3] - extent[1])/height);

  if(cellsize > 0) {
    var ox = Math.max((width - (extent[2] - extent[0])/cellsize)/2,0);
    var oy = Math.max((height - (extent[3] - extent[1])/cellsize)/2,0);

    extent[0] = extent[0] - ox*cellsize;
    extent[1] = extent[1] - oy*cellsize;
    extent[2] = extent[2] + ox*cellsize;
    extent[3] = extent[3] + oy*cellsize;
  }	

  return(cellsize);
}

function Extent2Polygon(extent)
{
  var polygon = new Array(10);

  polygon[0] = extent[0];
  polygon[1] = extent[3];
  polygon[2] = extent[2];
  polygon[3] = extent[3];
  polygon[4] = extent[2];
  polygon[5] = extent[1];
  polygon[6] = extent[0];
  polygon[7] = extent[1];
  polygon[8] = extent[0];
  polygon[9] = extent[3];

  return(polygon);
}
