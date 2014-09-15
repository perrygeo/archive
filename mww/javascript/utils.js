function decode(string) 
{
  return unescape(string.replace(/\+/g, " "));
}

/*
** This function parses comma-separated name=value argument pairs from
** the query string of the URL. It stores the name=value pairs in 
** properties of an object and returns that object. 
*/
function getargs() {
  var args = new Object();
  var query = location.search.substring(1);   // Get query string.
  var pairs = query.split("&");               // Break at ampersand.
  for(var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');          // Look for "name=value".
    if (pos == -1) continue;                  // If not found, skip.
    var argname = pairs[i].substring(0,pos);  // Extract the name.
    var value = pairs[i].substring(pos+1);    // Extract the value.
    args[argname] = decode(value);            // Store as a property.
  }
  return args;                                // Return the object.
}

/*
** Various functions to set form elements once they've been displayed.
*/
function set_checkbox(element, value)
{
  if(element.value == value) {
    element.checked = true;
    return true;
  }

  return false;
}

function set_checkbox_multiple(element, values)
{
  element.checked = false;
  for(var j=0; j<values.length; j++) {
    if(element.value == values[j])
      element.checked = true;
  }
}

function get_radio(element) {
  for(var i=0; i<element.length; i++) {
    if(element[i].checked) 
      return element[i].value;
  }  
}

function set_radio(element, value) 
{ 
  for(var i=0; i<element.length; i++) {
    if(element[i].value == value) {
      element[i].checked = true;
      return true;
    }
  }

  return false;
}

function set_radio_multiple(element, values)
{
  for(var i=0; i<element.length; i++) {    
    for(var j=0; j<values.length; j++) {
      if(element[i].value == values[j])
	element[i].checked = true;
    }
  }
}

function set_select(element, value) 
{
  for(var i=0;i<element.length;i++) {
    if((element.options[i].value == value) || (element.options[i].text == value)) {
      element.options[i].selected = true;
      return true;
    }
  }

  return false;
}

function get_select(element) 
{
  for(var i=0;i<element.length;i++) {
    if(element.options[i].selected) {
      if(element.options[i].value) return element.options[i].value;
      else return element.options[i].text;
    }    
  }

  return false;
}

function set_select_multiple(element, values)
{
  for(var k = 0; k < values.length; k++) {
    for(var j = ((element.length)-1); j >=0 ; j--) {	
      if(element.options[j].value == values[k])
	element.options[j].selected = true;
    }
  }
}

/*
** Functions to manipulate arrays of objects
*/
function lookup_object_array(array, property, value) {
  for(var i=0; i<array.length; i++)
    if(array[i][property] == value) return array[i];
  return null; // not found
}

function sort_object_array(array, property) 
{
  var length = array.length;
    
  for (var i=0; i<(length-1); i++) {
    for (var j=i+1; j<length; j++) { 
      if (array[j][property] < array[i][property]) { 
        var dummy = array[i]; 
        array[i] = array[j]; 
        array[j] = dummy; 
      } 
    } 
  } 
}

/*
** Function to retrieve the value of a URL as a javascript string.
*/
function get_content(url) {
  var content;

  if(document.all) { // IE version     
    // older versions (IE4 and some IE5.0) might be using MSXML2.XMLHTTP.4.0
    var xml = new ActiveXObject("Microsoft.XMLHTTP"); 
    xml.Open( "GET", url, false );
    xml.Send()
    content = xml.responseText;
  } else { // Mozilla/Netscrap 6+ version     
    var xml = new XMLHttpRequest();
    xml.open("GET",url,false);
    xml.send(null);
    content = xml.responseText;
  }

  return(content);
}

/*
** Random number functions
**
** The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)
** See:  http://www.msc.cornell.edu/~houle/javascript/randomizer.html
*/
rnd.today=new Date();
rnd.seed=rnd.today.getTime();

function rnd() {
        rnd.seed = (rnd.seed*9301+49297) % 233280;
        return rnd.seed/(233280.0);
};

function rand(number) {
        return Math.ceil(rnd()*number);
};
