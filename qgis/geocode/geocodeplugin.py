from PyQt4.QtCore import *
from PyQt4.QtGui import *
from geopy import geocoders  
from qgis.core import *
from dialog import GeocoderPluginGui
import resources
import os
import tempfile

class GeocodePlugin:

  # ----------------------------------------- #
  def __init__(self, iface):
    # save reference to the QGIS interface
    self.iface = iface
    self.outfile = os.path.join(tempfile.gettempdir(), "geocoded_addresses.txt")
    try:
        self.key = open(os.path.join( os.path.expanduser("~"), ".yahoo_appid")).read()
    except:
        self.key = None

  # ----------------------------------------- #
  def initGui(self):
    # create action that will start plugin configuration
    self.action = QAction(QIcon(":/plugins/testplug/icon.xpm"), "Geocode Addresses", self.iface.getMainWindow())
    self.action.setWhatsThis("Geocoder plugin")
    QObject.connect(self.action, SIGNAL("activated()"), self.run)

    # add toolbar button and menu item
    self.iface.addToolBarIcon(self.action)
    self.iface.addPluginMenu("&Geocoder", self.action)

    # connect to signal renderComplete which is emitted when canvas rendering is done
    QObject.connect(self.iface.getMapCanvas(), SIGNAL("renderComplete(QPainter *)"), self.renderTest)

  # ----------------------------------------- #
  def unload(self):
    # remove the plugin menu item and icon
    self.iface.removePluginMenu("&Geocoder",self.action)
    self.iface.removeToolBarIcon(self.action)

    # disconnect form signal of the canvas
    QObject.disconnect(self.iface.getMapCanvas(), SIGNAL("renderComplete(QPainter *)"), self.renderTest)


  # ----------------------------------------- #
  def run(self):
    # create and show a configuration dialog 
    flags = Qt.WindowTitleHint | Qt.WindowSystemMenuHint | Qt.WindowMaximizeButtonHint 
    gui = GeocoderPluginGui(self.iface.getMainWindow(),flags)

    # connect to the submitAddresses signal which triggers the geocoding engine
    QObject.connect(gui, SIGNAL("submitAddresses(QString )"), self.geocode)

    # connect to the submitOutput signal which sets the output text file
    QObject.connect(gui, SIGNAL("submitOutput(QString )"), self.setOutput)

    # connect to the submitKey signal which sets the yahoo api key
    QObject.connect(gui, SIGNAL("submitKey(QString )"), self.setKey)

    gui.show()
    self.gui = gui
   
  # ----------------------------------------- #
  def setOutput(self, outfile):
    outfile = str(outfile)
    if outfile != "": 
        self.outfile = outfile

  # ----------------------------------------- #
  def setKey(self, key):
    key = str(key)
    if key != "": 
        self.key = key

  # ----------------------------------------- #
  def geocode(self, addressText):

    # Create a progress indicator
    prog = QProgressDialog("Geocoder","Cancel",0,100,self.iface.getMainWindow())
    prog.setMinimumDuration(0)
    prog.setValue(0)
    prog.setWindowTitle('Geocoder')
    prog.setLabelText('Geocoding addresses...')
    prog.setModal(True)
    prog.forceShow()

    # Create a geocoder
    gc = geocoders.Yahoo(self.key) 
    self.errors = False

    #
    # Alternative geocoding engines are possible but I've found
    # it very difficult to get them to work reliably
    #
    # gc = geocoders.Google('API_KEY')
    # gc = geocoders.VirtualEarth()
    # gc = geocoders.GeocoderDotUS()
    # gc = geocoders.GeoNames()
    # gc = geocoders.MediaWiki("http://wiki.case.edu/%s")  
    # gc = geocoders.SemanticMediaWiki("http://wiki.case.edu/%s",  
    #                                  attributes=['Coordinates'],  
    #                                  relations=['Located in'])  
    
    # get list of addresses
    addresses = str(addressText).strip().split('\n')
   
    # set progress bar range
    prog.setRange(0,len(addresses))
    
    # strip out whitespace
    addresses = [address.strip() for address in addresses]

    # open files for output and error logging
    self.fh = open(self.outfile, 'w')
    self.fh.write('place|lon|lat\n')
    self.fh.flush()
    self.fhe = open( os.path.join(tempfile.gettempdir(), "geocode_errors.txt"), 'w')

    # Loop through and geocode
    counter = 0
    for a in addresses:
        prog.setValue(counter)
        if prog.wasCanceled():
           self.fh.close()
           self.fhe.close()
           print "######## geocoding canceled"
           break
        if a != "":
            try:
                place, (lat, lon) = gc.geocode(a)
                outline = '|'.join([place, str(lon), str(lat)])
                print outline
                self.fh.write(outline + "\n")
                self.fh.flush
            except Exception, e:
                self.fhe.write(a + "," + str(e) + "\n")
                self.fhe.flush()
                self.errors = True
                print "Geocode error with", a
        counter = counter + 1

    self.fh.close()
    self.fhe.close()

    prog.setValue(len(addresses))
    if self.errors:
        mb=QMessageBox(self.iface.getMainWindow())
        mb.information(mb, "Geocoding errors encountered", "Some locations could not be geocoded; check %s" % \
                           os.path.join(tempfile.gettempdir(), "geocode_errors.txt"))
        
    layerPath = "%s?delimiter=|&xField=lon&yField=lat" % self.outfile
    layerName = os.path.basename(self.outfile).split('.')[0]
    layerProvider = "delimitedtext"

    # display layer
    self.iface.addVectorLayer(layerPath, layerName, layerProvider)
    self.iface.getMapCanvas().refresh()
    


  # ----------------------------------------- #
  def renderTest(self, painter):
    # use painter for drawing to map canvas
    pass
