var LastWindowOpened = "";

function closePopup() {

  if (LastWindowOpened != "") {
    if (eval("self." + LastWindowOpened)) {
      if (!(eval("self." + LastWindowOpened + ".closed"))) {
        eval ("self." + LastWindowOpened + ".close()");
      }
    }
  }
}



function openPopup(thisWidth,thisHeight,thisDocument,thisWindowName,windowtools) {

  OpenThisWindow = true;
  if (eval("self." + thisWindowName)){
    if (!(eval("self." + thisWindowName + ".closed"))) {
      eval ("self." + thisWindowName + ".focus()");
      OpenThisWindow = false;
    }
  }

  if (OpenThisWindow){
    if (LastWindowOpened != thisWindowName) {
      closePopup()
    }
     
    if (windowtools == null) {           
      var windowtools = "toolbar=0,location=0,directories=0,status=1,scrollbars=1,resizable=1,alwaysRaised=1,";
    }

    eval(thisWindowName + " = window.open(\"" + thisDocument + "\",\"" + thisWindowName + "\",\"" + windowtools + "width=" + thisWidth + ",height=" + thisHeight + ",top=10,left=10,screeny=25,screenx=50\")");
    LastWindowOpened = thisWindowName;
  }

}

function updatePopup(thisWidth,thisHeight,thisDocument,thisWindowName,windowtools) {

  OpenThisWindow = true;
  if (eval("self." + thisWindowName)){
    if (!(eval("self." + thisWindowName + ".closed"))) {
      eval ("self." + thisWindowName + ".focus()");
      eval ("self." + thisWindowName + ".location = \"" + thisDocument + "\"");
      OpenThisWindow = false;
    }
  }

  if (OpenThisWindow){
    if (LastWindowOpened != thisWindowName) {
      closePopup()
    }
                
    if (windowtools == null) {           
      var windowtools = "toolbar=0,location=0,directories=0,status=1,scrollbars=1,resizable=1,alwaysRaised=1,";
    }

    eval(thisWindowName + " = window.open(\"" + thisDocument + "\",\"" + thisWindowName + "\",\"" + windowtools + "width=" + thisWidth + ",height=" + thisHeight + ",top=10,left=10,screeny=25,screenx=50\")");
    LastWindowOpened = thisWindowName;
  }

}

function openPopup2(thisWidth,thisHeight,thisDocument,thisWindowName,windowtools) {
  if(windowtools == null) var windowtools = "toolbar=0,location=0,directories=0,status=1,scrollbars=1,resizable=1,alwaysRaised=1,";
  eval(thisWindowName + " = window.open(\"" + thisDocument + "\",\"" + thisWindowName + "\",\"" + windowtools + "width=" + thisWidth + ",height=" + thisHeight + ",top=10,left=10,screeny=25,screenx=50\")");
}
