// Global variables
var dContainer_Debug=false;

// dLegend constructor
function dContainer(name) {
  if(dContainer_Debug) alert("Constructing dContainer named '"+ name +"'.");

  this.name = name;

  this.width = 0;
  this.height = 0;
  
  this.scroll = false;
  this.style = null;

  this.container = null; // DHTML elements
  this.anchor = null; 
}

function dContainer_initialize() {
  // anchor *must* exist in the document (most likely as a div or an img)
  this.anchor = window.xGetElementById(this.name);
  this.anchor.parentObject = this;
  this.anchor.onload = dBox_onload;

  this.width = xWidth(this.anchor);
  this.height = xHeight(this.anchor);
 
  // create the container for the content
  this.container = document.createElement('div');

  // set some properties
  this.container.id = this.name + "_container";
  this.container.parentObject = this;

  if(this.style) this.container.style.cssText = this.style;
  this.container.style.position = 'absolute';  
  if(this.scroll) this.container.style.overflow = 'AUTO';
  document.body.appendChild(this.container);

  xResizeTo(this.container, this.width, this.height);
  xMoveTo(this.container, xPageX(this.anchor), xPageY(this.anchor));
  xClip(this.container, 0, this.width, this.height, 0);
  xShow(this.container);
}

function dContainer_sync() {
  xResizeTo(this.container, this.width, this.height);
  xMoveTo(this.container, xPageX(this.anchor), xPageY(this.anchor));
  xClip(this.container, 0, this.width, this.height, 0);
}

function dContainer_setcontent(content) {
  // is the content a URL?
  if(content.indexOf("http://") == 0 || content.indexOf("https://") == 0 || content.indexOf("ftp://") == 0) {
    var text;
    var xml;

    if(document.all) { // IE version     
      // older versions (IE4 and some IE5.0) might be using MSXML2.XMLHTTP.4.0
      xml = new ActiveXObject("Microsoft.XMLHTTP"); 
      xml.Open( "GET", content, false );
      xml.Send()
      text = xml.responseText;
    } else { // Mozilla/Netscrap 6+ version     
      xml = new XMLHttpRequest();
      xml.open("GET", content, false);
      xml.send(null);
      text = xml.responseText;
    }

    xInnerHtml(this.container, text);
  } else {
    xInnerHtml(this.container, content);
  }
}

dContainer.prototype.initialize = dContainer_initialize;
dContainer.prototype.sync = dContainer_sync;
dContainer.prototype.setcontent = dContainer_setcontent;
