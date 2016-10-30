var CanvasModule = (function() {

  var attachMouseEvents = function(canvas) {
    if (canvas.attachEvent) //if IE (and Opera depending on user setting)
        canvas.attachEvent("on"+getMousewheelevt(), zoom_canvas);
    else if (canvas.addEventListener) //WC3 browsers
        canvas.addEventListener(getMousewheelevt(), zoom_canvas, false);

    canvas.onmousedown = onmousedown;
    canvas.onmouseup = onmouseup;
    canvas.onmousemove = onmousemove;
  }

  function getMousewheelevt(){
    return (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" ;
  }

  return {
    attachMouseEvents: attachMouseEvents
  };
  
})();
