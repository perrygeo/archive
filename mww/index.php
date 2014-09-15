<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<title> Mapserver Web Widgets Example Template </title>
<?php
  /*
   * Determine the mapfile to display & load the mww.php library
   */
  error_reporting(0);
  if (!$_REQUEST['mapfile']) {
    $mapfile = '/home/perrygeo/mapfiles/world.map';
  } else {
    $mapfile = $_REQUEST['mapfile'];
  }
  include("mww.php"); 
  
?>
<link rel="stylesheet" href="css/style1.css" type="text/css">
<script type="text/javascript">
 function show(div,tab) {
   // Turn everything off
   document.getElementById('navDiv').style.display = 'none';
   document.getElementById('legendDiv').style.display = 'none';
   document.getElementById('layersDiv').style.display = 'none';
   document.getElementById('navTab').className = 'tab';
   document.getElementById('legendTab').className = 'tab';
   document.getElementById('layersTab').className = 'tab';
   // Turn selected on
   document.getElementById(div).style.display = 'block';
   tab.className = 'tabOn';
 }
</script>

</head>
<body>


<!-------------------------------------------------------
  SITE NAV BAR 
  ---------------------------------------------------- -->


<!-------------------------------------------------------
  LEFT COLUMN 
  ---------------------------------------------------- -->

<table>
<tr><td colspan="3">

<div id="header">
 <table width="100%">
  <tr> 
   <td>
   <p class="headerText">Mapserver Web Widgets Example Template </p>
   </td>
  </tr>
 </table>
</div>

<div id="navbar">
  <a href="http://www.hostgis.com">HostGIS</a> :: 
  <a href="http://mapserver.gis.umn.edu"> Mapserver</a>
</div>

</td></tr>

<tr valign=top>
 <td align="left">

<div>
 <table>
  <tr valign=top>
   <td align=center>
   <script language="javascript" type="text/javascript">
     mww.zoombar.draw();
   </script>
    <script language="javascript" type="text/javascript">
      mww.toolbar.draw(); 
    </script>
   </td>
  </tr>
 </table>
</div>

</td>

<!-------------------------------------------------------
  MIDDLE COLUMN 
  ---------------------------------------------------- -->
<td align=left>
   <script language="javascript" type="text/javascript">
     mww.display.setColor('red');
     mww.display.draw(); 
   </script>
</td>


<td align="left">

<!-------------------------------------------------------
  RIGHT COLUMN 
  ---------------------------------------------------- -->
   <script language="javascript" type="text/javascript">
       mww.resize.draw(); 
   </script>

   <script language="javascript" type="text/javascript">
      mww.refmap.draw(); 
   </script>

<!-- Options menu -->
<div style="margin:5px; padding:5px; ">
  <span class="tab" id="legendTab" onMouseOver="" onMouseOut="" onClick="show('legendDiv',this);">
    Legend
  </span>
  <span class="tab" id="layersTab" onMouseOver="" onMouseOut="" onClick="show('layersDiv',this);">
    Layers
  </span>
  <span class="tab" id="navTab" onMouseOver="" onMouseOut="" onClick="show('navDiv',this);">
    Navigation
  </span>  
</div>

<!-- Page -->
<div id="page">
  <div class="pageDiv" id="layersDiv" style="display:none;">
    <h5> Layers </h5>
    <script language="javascript" type="text/javascript">
      mww.layers.draw();      
    </script>
  </div>

  <div class="pageDiv" id="legendDiv" style="display:none;">
    <h5> Legend </h5>
   <script language="javascript" type="text/javascript">
     mww.legend.draw();
   </script>
  </div>

  <div class="pageDiv" id="navDiv" style="display:none;">
   <h5> Navigation Tools </h5>
   <script language="javascript" type="text/javascript">
     mww.measurement.draw();
   </script>
   <hr/>
   Coordinates :
   <script language="javascript" type="text/javascript">
     mww.coordinates.decimalPlaces = 3;
     //mww.coordinates.displayMode = 'dm';
     mww.coordinates.draw();
   </script>
   <hr/>
   <script language="javascript" type="text/javascript">
     mww.scalebar.draw();
   </script><br/><br/><br/>
   <hr/>
   <script language="javascript" type="text/javascript">
     mww.scalebox.draw();
   </script>
   <hr/>
   <script language="javascript" type="text/javascript">
     mww.compass.draw();
   </script>

  </div>

</div>

</td>
</tr>
</table>

</body>
</html>
