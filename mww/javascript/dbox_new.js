// Global variables
var dBox_Debug=false;

var dBox_BusyMessage='fetching map...';
var dBox_NotBusyMessage='';

//
// Object constructor
//

function dBox(name) {
  if(dBox_Debug) alert("Constructing dBox named '"+ name +"'.");

  this.name = name; 

  // some reasonable defaults  
  this.color = 'red';
  this.thickness = 1;

  this.width = 0;
  this.height = 0;

  this.box = true;
  this.line = false;
  this.verbose = false;

  this.canvas = null; // DHTML elements
  this.anchor = null;  

  this.cursor= 'crosshair';
  this.jitter = 10;

  this.x1 = this.y1 = this.x2 = this.y2 = -1;
  this.offsetx = this.offsety = 0;
  this.drag = false;

  this.x = new Array(); // arrays to hold coordinates
  this.y = new Array();
  this.length = 0;
  this.area = 0;

  this.graphics;

  this.polygon_vertices = new Array();
  
  this.waiting = false; // are we waiting for a new image?
}

//
// Object prototypes
//

function dBox_initialize() {
  // anchor *must* exist as a IMG in the document
  this.anchor = window.xGetElementById(this.name);
  this.anchor.parentObject = this;
  this.anchor.onload = dBox_onload;

  this.width = xWidth(this.anchor);
  this.height = xHeight(this.anchor);
 
  // create the canvas for the box sides
  this.canvas = document.createElement('div');

  // set some properties
  this.canvas.style.position = 'absolute';  
  this.canvas.id = this.name + "_canvas";
  this.canvas.parentObject = this;
  document.body.appendChild(this.canvas);

  xResizeTo(this.canvas, this.width, this.height);
  xMoveTo(this.canvas, xPageX(this.anchor), xPageY(this.anchor));
  xClip(this.canvas, 0, this.width, this.height, 0);
  xShow(this.canvas);

  this.offsetx = xLeft(this.canvas);
  this.offsety = xTop(this.canvas);

  this.polygon_vertices = new Array();

  if(xIE4Up) {
    xAddEventListener(this.anchor, 'mousedown', dBox_mousedown, true);
    xAddEventListener(this.anchor, 'mousemove', dBox_mousemove, true);
    xAddEventListener(this.anchor, 'mouseup', dBox_mouseup, true);
    xAddEventListener(this.anchor, 'mouseover', dBox_mouseenter, true);
    xAddEventListener(this.anchor, 'mouseout', dBox_mouseexit, true);
    xEnableDrag(this.anchor, dBox_drag, dBox_drag, dBox_drag);
  } else {
    xAddEventListener(this.canvas, 'mousedown', dBox_mousedown, true);
    xAddEventListener(this.canvas, 'mousemove', dBox_mousemove, true);
    xAddEventListener(this.canvas, 'mouseup', dBox_mouseup, true);
    xAddEventListener(this.canvas, 'mouseover', dBox_mouseenter, true);
    xAddEventListener(this.canvas, 'mouseout', dBox_mouseexit, true);
    xEnableDrag(this.canvas, dBox_drag, dBox_drag, dBox_drag);
  }

  // create the graphics object to use the canvas
  this.graphics = new jsGraphics(this.canvas.id);
  this.graphics.setColor(this.color);
  this.graphics.setStroke(this.thickness);  
}

function dBox_sync() {
  xMoveTo(this.canvas, xPageX(this.anchor), xPageY(this.anchor));
  this.offsetx = xLeft(this.canvas);
  this.offsety = xTop(this.canvas);
}

function dBox_boxon() {
  this.box = true;
  this.line = false;
}

function dBox_boxoff() {
  this.line = false;
  this.box = false;
  this.x1 = this.x2; 
  this.y1 = this.y2;
  this.paint();

  // user SHOULD provide this handler
  if(window.reset_handler) reset_handler(this.name, Math.min(this.x1, this.x2)-this.offsetx, Math.min(this.y1, this.y2)-this.offsety, Math.max(this.x1, this.x2)-this.offsetx, Math.max(this.y1, this.y2)-this.offsety);
}

function dBox_lineon() {
  this.box = false;
  this.line = true;  
  this.x = new Array();
  this.y = new Array();
  this.area = this.length = 0;
  this.paint();
  this.polygon_vertices = new Array(); 
}

function dBox_lineoff() {
  // go ahead and turn off the drawing
  this.boxoff();

  // clear the set of points
  // otherwise, next time they call lineoff() the old points will still be stored!
  this.polygon_vertices = new Array();

  // clear the display
  this.paint();
}

function dBox_reset() {
  window.status = dBox_NotBusyMessage;
  this.x1 = this.x2 = (this.width - 1)/2 + this.offsetx; // center of image
  this.y1 = this.y2 = (this.height - 1)/2 + this.offsety;
  
  // MP
  if (this.name == 'main') {
   //alert(this.name);
    window.toggleRedraw('off')
   };    

  // user SHOULD provide this handler
  if(window.reset_handler) reset_handler(this.name, this.x1, this.y1, this.x1, this.y1);

  this.sync();
  this.paint();
  this.waiting = false;
}

function dBox_setimage(url) {
  this.waiting = true;
  window.status = dBox_BusyMessage;
  this.anchor.src = url;


  // netscape 6 doesn't invoke the onload method each time (dammit) so we call it manually here
  // if(is.nav6) this.onload();
}

function dBox_paint() {    
  var x, y, w, h;

  if(this.x1==this.x2 && this.y1==this.y2) {    
    this.graphics.clear();
    if(this.line) {
      for(var i=1; i<this.x.length; i++)
        this.graphics.drawLine(this.x[i-1]- this.offsetx, this.y[i-1]- this.offsety, this.x[i]- this.offsetx, this.y[i]- this.offsety);
    }
    if (this.polygon_vertices.length <= 1) {
       this.graphics.drawEllipse(this.x[this.x.length-1]-this.offsetx-2,this.y[this.y.length-1]-this.offsety-2,3,3);
    }
  } else {
    if(this.box) {
      w = Math.abs(this.x1-this.x2);
      h = Math.abs(this.y1-this.y2);
      x = Math.min(this.x1, this.x2) - this.offsetx; // UL corner of box
      y = Math.min(this.y1, this.y2) - this.offsety;

      if(dBox_Debug) window.status = "h:" + h + " w:" + w + " x:" + x + " y:" + y;
     
      this.graphics.clear();
      this.graphics.drawRect(x,y,w,h);
    } else if(this.line) {      
      this.graphics.clear();      
      for(var i=1; i<this.x.length; i++)
        this.graphics.drawLine(this.x[i-1]- this.offsetx, this.y[i-1]- this.offsety, this.x[i]- this.offsetx, this.y[i]- this.offsety);
    }
    if (this.polygon_vertices.length == 1) {
       this.graphics.drawEllipse(this.x[this.x.length-1]-this.offsetx-2,this.y[this.y.length-1]-this.offsety-2,3,3);
    }
  }

  this.graphics.paint();
}

dBox.prototype.initialize = dBox_initialize;
dBox.prototype.sync = dBox_sync;
dBox.prototype.boxoff = dBox_boxoff;
dBox.prototype.boxon = dBox_boxon;
dBox.prototype.lineoff = dBox_lineoff;
dBox.prototype.lineon = dBox_lineon;
dBox.prototype.reset = dBox_reset;
dBox.prototype.setimage = dBox_setimage;
dBox.prototype.paint = dBox_paint;

//
// Event helper functions
//

function dBox_distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function dBox_onload() {
  this.parentObject.reset();
}

function dBox_mousedown(event) {
  var e = new xEvent(event);  
  var t;

  if(e.target.parentNode.parentObject)
    t = e.target.parentNode.parentObject;
  else
    t = e.target.parentObject;

  t.drag = true;
  t.x1 = t.x2 = e.pageX-2;
  t.y1 = t.y2 = e.pageY-2;

  if(t.line) {    
    t.x.push(t.x1);
    t.y.push(t.y1);
    if(t.x.length > 1) {
      var d = dBox_distance(t.x[t.x.length-1], t.y[t.y.length-1], t.x[t.x.length-2], t.y[t.y.length-2]);
      t.length += d;      
      if(t.verbose && window.measure_handler) measure_handler(t.name,d,t.length,t.x.length,-1);
      //alert("mouseDown " + t.name + "  " + d + " " + t.length);
      t.paint();
    }
  }
}

function dBox_mousemove(event) {
  var e = new xEvent(event);  
  var t;

  if(e.target.parentNode.parentObject)
    t = e.target.parentNode.parentObject;
  else
    t = e.target.parentObject;

  var x = e.pageX-2;
  var y = e.pageY-2;

  if(t.drag && !t.line) {
    t.x2 = x;
    t.y2 = y;
    if(!t.box) {      
      t.x1 = t.x2;
      t.y1 = t.y2;
    } else
      t.paint();
  }

  if(!t.waiting && t.verbose && window.mousemove_handler) mousemove_handler(t.name,x-t.offsetx,y-t.offsety);
}

function dBox_mouseup(event) {
  var e = new xEvent(event);
  var t;

  if(e.target.parentNode.parentObject)
    t = e.target.parentNode.parentObject;
  else
    t = e.target.parentObject;

  t.drag = false;

  if(t.box || t.line) {
    t.x2 = e.pageX-2;
    t.y2 = e.pageY-2;
  
    if((Math.abs(t.x1-t.x2) <= t.jitter) || (Math.abs(t.y1-t.y2) <= t.jitter)) {
      t.x2 = t.x1;
      t.y2 = t.y1;
    } else if(t.line) {
      if((t.x[t.x.length-1] != t.x2) && (t.y[t.y.length-1] != t.y2)) {
        t.x.push(t.x2);
        t.y.push(t.y2);
	if(t.x.length > 1) {
          var d = dBox_distance(t.x[t.x.length-1], t.y[t.y.length-1], t.x[t.x.length-2], t.y[t.y.length-2]);
          if(t.verbose && window.measure_handler) measure_handler(t.name,d,t.length,t.x.length,-1);
          t.length += d;
        }
      }
    }
    t.paint();
  } else {
    t.x2 = t.x1;
    t.y2 = t.y1;
  }

  // if they're editing a point layer and are drawing, force it to be a single point
  // by clearing the previous points
  if (t.line && mww.digitizer.geomtype=='point') {
    t.x = new Array( t.x2 );
    t.y = new Array( t.y2 );
    t.polygon_vertices = new Array();
  }

  // addon to log clicks' image-coordinates, for storing polygons
  t.polygon_vertices.push( new Point(coord_x,coord_y) );
  //t.polygon_vertices.push( new Point(t.x2,t.y2) );

  // user MUST provide this handler
  if(window.setbox_handler && !t.line) setbox_handler(t.name, Math.min(t.x1, t.x2)-t.offsetx, Math.min(t.y1, t.y2)-t.offsety, Math.max(t.x1, t.x2)-t.offsetx, Math.max(t.y1, t.y2)-t.offsety);
}

function dBox_mouseenter(event) {
  var e = new xEvent(event);
  var t;

  if(e.target.parentNode.parentObject)
    t = e.target.parentNode.parentObject;
  else
    t = e.target.parentObject;

  t.anchor.style.cursor = t.canvas.style.cursor = t.cursor;

  if(t.verbose && window.mouseenter_handler) window.mouseenter_handler(t.name);
}

function dBox_mouseexit(event) {
  var e = new xEvent(event);
  var t;

  if(e.target.parentNode.parentObject)
    t = e.target.parentNode.parentObject;
  else
    t = e.target.parentObject;

  t.anchor.style.cursor = t.canvas.style.cursor = "default";

  if(t.verbose && window.mouseexit_handler) window.mouseexit_handler(t.name);
}

function dBox_drag(event) { 
  // do nothing
}


