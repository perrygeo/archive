# load TestPlugin class from file testplugin.py
from geocodeplugin import GeocodePlugin

def name():
  return "Geocode plugin"

def description():
  return "Geocodes addresses"

def version():
  return "Version 0.13"

def classFactory(iface):
  return GeocodePlugin(iface)
