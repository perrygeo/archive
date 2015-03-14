# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'gui.ui'
#
# Created: Sun May 11 16:25:57 2008
#      by: PyQt4 UI code generator 4.3.3
#
# WARNING! All changes made in this file will be lost!

from PyQt4 import QtCore, QtGui

class Ui_Dialog(object):
    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(QtCore.QSize(QtCore.QRect(0,0,609,507).size()).expandedTo(Dialog.minimumSizeHint()))

        self.label = QtGui.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(10,10,501,21))
        self.label.setObjectName("label")

        self.label_2 = QtGui.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(10,340,201,21))
        self.label_2.setObjectName("label_2")

        self.lineOutput = QtGui.QLineEdit(Dialog)
        self.lineOutput.setGeometry(QtCore.QRect(220,330,281,31))
        self.lineOutput.setObjectName("lineOutput")

        self.buttonBrowse = QtGui.QPushButton(Dialog)
        self.buttonBrowse.setGeometry(QtCore.QRect(500,330,83,28))
        self.buttonBrowse.setObjectName("buttonBrowse")

        self.pbnCancel = QtGui.QPushButton(Dialog)
        self.pbnCancel.setGeometry(QtCore.QRect(510,460,83,28))
        self.pbnCancel.setObjectName("pbnCancel")

        self.pbnOK = QtGui.QPushButton(Dialog)
        self.pbnOK.setGeometry(QtCore.QRect(420,460,83,28))
        self.pbnOK.setObjectName("pbnOK")

        self.txtAddressList = QtGui.QTextBrowser(Dialog)
        self.txtAddressList.setGeometry(QtCore.QRect(20,30,561,281))
        self.txtAddressList.setReadOnly(False)
        self.txtAddressList.setObjectName("txtAddressList")

        self.lineKey = QtGui.QLineEdit(Dialog)
        self.lineKey.setEnabled(True)
        self.lineKey.setGeometry(QtCore.QRect(180,380,321,31))
        self.lineKey.setObjectName("lineKey")

        self.labelKey_2 = QtGui.QLabel(Dialog)
        self.labelKey_2.setEnabled(True)
        self.labelKey_2.setGeometry(QtCore.QRect(10,410,127,21))
        self.labelKey_2.setObjectName("labelKey_2")

        self.labelKey = QtGui.QLabel(Dialog)
        self.labelKey.setEnabled(True)
        self.labelKey.setGeometry(QtCore.QRect(10,390,191,21))
        self.labelKey.setObjectName("labelKey")

        self.labelKey_3 = QtGui.QLabel(Dialog)
        self.labelKey_3.setEnabled(True)
        self.labelKey_3.setGeometry(QtCore.QRect(140,410,301,21))
        self.labelKey_3.setObjectName("labelKey_3")

        self.retranslateUi(Dialog)
        QtCore.QMetaObject.connectSlotsByName(Dialog)

    def retranslateUi(self, Dialog):
        Dialog.setWindowTitle(QtGui.QApplication.translate("Dialog", "QGIS Geocoder Plugin", None, QtGui.QApplication.UnicodeUTF8))
        self.label.setText(QtGui.QApplication.translate("Dialog", "Enter a list of addresses to geocode (one address or placename per line)", None, QtGui.QApplication.UnicodeUTF8))
        self.label_2.setText(QtGui.QApplication.translate("Dialog", "Output pipe-delimited text file", None, QtGui.QApplication.UnicodeUTF8))
        self.buttonBrowse.setText(QtGui.QApplication.translate("Dialog", "Browse", None, QtGui.QApplication.UnicodeUTF8))
        self.pbnCancel.setText(QtGui.QApplication.translate("Dialog", "Cancel", None, QtGui.QApplication.UnicodeUTF8))
        self.pbnOK.setText(QtGui.QApplication.translate("Dialog", "Geocode", None, QtGui.QApplication.UnicodeUTF8))
        self.labelKey_2.setText(QtGui.QApplication.translate("Dialog", "<html><head><meta name=\"qrichtext\" content=\"1\" /><style type=\"text/css\">\n"
        "p, li { white-space: pre-wrap; }\n"
        "</style></head><body style=\" font-family:\'Sans Serif\'; font-size:9pt; font-weight:400; font-style:normal; text-decoration:none;\">\n"
        "<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><a href=\"https://developer.yahoo.com/wsregapp/\"><span style=\" text-decoration: underline; color:#0000ff;\">Get a Yahoo API Key</span></a></p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.labelKey.setText(QtGui.QApplication.translate("Dialog", "Yahoo Geocoder API Key", None, QtGui.QApplication.UnicodeUTF8))
        self.labelKey_3.setText(QtGui.QApplication.translate("Dialog", "(paste key in ~/.yahoo_appid to set default)", None, QtGui.QApplication.UnicodeUTF8))

