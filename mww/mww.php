<?php
 include('mww.config.php');
?>
<script language="JavaScript" src="<?=$baseurl?>/javascript/shape.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/popup.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/mapserv_new.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/cross-browser.com/x/x_core.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/cross-browser.com/x/x_event.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/cross-browser.com/x/x_dom.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/cross-browser.com/x/x_drag.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/wz_jsgraphics.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/dbox_new.js" type="text/javascript" ></script>
<script language="JavaScript" src="<?=$baseurl?>/javascript/dcontainer.js" type="text/javascript" ></script>
<script language="JavaScript" type="text/javascript">

<?php

if (!extension_loaded("MapScript")) {
    dl($mapscript);
}

// Check for mapfile
if (!$mapfile) {
   print '<h1> Mapfile is not set! </h1>'; 
} else { 
   $mapfile = preg_replace('/\.\.\//','',$mapfile);
   $map = ms_newMapObj($mapfile);

   $geometrytypes = array( MS_LAYER_POINT    => 'point',
                           MS_LAYER_LINE     => 'line',
                           MS_LAYER_POLYGON  => 'polygon'
                         );

   print " // Global variables used in mapserv.js\n";
   print "  var Width=" . $map->width . ";\n";
   print "  var Height=" . $map->height . ";\n";
   print "  var Fullextent=new Array(" . $map->extent->minx . "," . $map->extent->miny . "," . $map->extent->maxx . "," . $map->extent->maxy . ");\n";
   print "  var Mapfile=\"" . $mapfile . "\";\n";
   print "  var Projection=\"" . $map->getProjection() . "\";\n";
   print "  var Units=" . $map->units . ";\n";
   print "  var Refextent=new Array(" . $map->reference->extent->minx . "," . $map->reference->extent->miny . "," . $map->reference->extent->maxx . "," . $map->reference->extent->maxy . ");\n";
   print "  var Refwidth=" . $map->reference->width . ";\n";
   print "  var Refheight=" . $map->reference->height . ";\n";
   print "  var ImageDir='" . $imagedir . "';\n";
   if (!$map->web->minscale) {
      $minscale = 1024;
   } else {
      $minscale = $map->web->minscale;
   } 
   if (!$map->web->maxscale) {
      $maxscale = 40000000;
   } else {
      $maxscale = $map->web->maxscale;
   } 
   print "  var Minscale=" . $minscale . ";\n";
   print "  var Maxscale=" . $maxscale . ";\n";
   print "  var MapServer=\"" . $cgiurl . "\";\n";
   print "  var QueryServer=MapServer;\n";
   print "  var Interface=\"dhtml\";\n";
 
   // Loop through Layers
   $numlayers = $map->numlayers;
   $layerJs =  "  var Layers= new Array(";
   $groupJs =  "  var Layergroups= new Array(";
   $statusJs = "  var Layerstatus= new Array(";
   $diglayersJs =  "  var DigLayers= new Array(";
   $digtypeJs = "  var DigType= new Array(";
   for ($i = $numlayers - 1; $i >= 0 ; $i = $i - 1) {
     $myLayer = $map->getlayer($i);
     $shortName = $myLayer->name;
     $layerJs .= ",'" . $shortName . "'";

     $group = $myLayer->group;
     $groupJs .= ",'" . $group . "'";

     $status = $myLayer->status;
     $statusJs .= "," . $status;

     // If it's an editable postgis layer
     if ($myLayer->connectiontype == MS_POSTGIS && strpos($myLayer->connection,'dbname=gisdata') == false && $myLayer->type != MS_LAYER_ANNOTATION) {
        $diglayersJs .= ",'" . $myLayer->name . "'";
        $digtypeJs .= ",'" . $geometrytypes[$myLayer->type] . "'";
     }
   }
   $layerJs .= ");\n";
   $groupJs .= ");\n";
   $statusJs .= ");\n";
   $diglayersJs .= ");\n";
   $digtypeJs .= ");\n";
   print str_replace("Array(,","Array(",$layerJs);
   print str_replace("Array(,","Array(",$statusJs);
   print str_replace("Array(,","Array(",$groupJs);
   print str_replace("Array(,","Array(",$diglayersJs);
   print str_replace("Array(,","Array(",$digtypeJs);
}
?>
</script>
<script language="JavaScript" src="<?= $baseurl ?>/javascript/mww.js" type="text/javascript"></script>
<link rel="stylesheet" href="<?= $baseurl ?>/css/global.css" type="text/css">
