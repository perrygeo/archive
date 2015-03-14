#!/usr/bin/python

from mapnik import *

mapfile = "test_mapnik.xml"
m = Map(800, 400, "+proj=latlong +ellps=WGS84")
load_map(m, mapfile)
bbox = Envelope(Coord(-180.0, -90.0), Coord(180.0, 90.0))
m.zoom_to_box(bbox) 
render_to_file(m, 'mapnik_output.png', 'png') 
