INST_DIR = /home/perry/.qgis/python/plugins/geocode

PYRCC = /usr/bin/pyrcc4
PYUIC = /usr/bin/pyuic4

RC_PY_FILE = resources.py
UI_PY_FILE = gui.py

all: $(RC_PY_FILE) $(UI_PY_FILE)

install: all
	rm -rf $(INST_DIR)
	mkdir -p $(INST_DIR)/geopy
	cp *.py $(INST_DIR)/
	cp geopy/* $(INST_DIR)/geopy

clean:
	rm -f $(RC_PY_FILE) $(UI_PY_FILE)
	rm -f *.pyc

zip:
	cd ~/.qgis/python/plugins && zip -r ~/Desktop/geocode.zip geocode

$(RC_PY_FILE): resources.qrc
	$(PYRCC) -o $(RC_PY_FILE) resources.qrc

$(UI_PY_FILE): gui.ui
	$(PYUIC) -o $(UI_PY_FILE) gui.ui

