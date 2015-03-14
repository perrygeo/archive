from PyQt4.QtCore import *
from PyQt4.QtGui import *

from qgis.core import QgsContextHelp

from gui import Ui_Dialog
import resources

class GeocoderPluginGui(QDialog, Ui_Dialog):
  def __init__(self, parent, fl):
    QDialog.__init__(self, parent, fl)
    
    self.setupUi(self)
    
  def on_buttonBrowse_released(self):
    qd=QFileDialog()
    f=qd.getSaveFileName()
    if len(f) > 0:
      self.lineOutput.setText(f)
 
  def on_pbnOK_released(self):
    self.hide()
    self.emit(SIGNAL("submitOutput(QString )"), self.lineOutput.text() )
    self.emit(SIGNAL("submitKey(QString )"), self.lineKey.text() )
    self.emit(SIGNAL("submitAddresses(QString )"), self.txtAddressList.toPlainText() )
    self.done(1)

  def on_pbnCancel_clicked(self):
    self.close()
