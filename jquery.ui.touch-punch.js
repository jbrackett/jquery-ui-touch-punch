/*!
 * jQuery UI Touch Punch 0.1.0
 *
 * Copyright 2010, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 *
 *  Modifications by:
 *  Josh Brackett
 */
(function ($) {

  $.support.touch = "ontouchend" in document;

  if (!$.support.touch) {
    return;
  }

  var mouseProto  = $.ui.mouse.prototype,
      _mouseInit  = mouseProto._mouseInit,
      _mouseDown  = mouseProto._mouseDown,
      _mouseUp    = mouseProto._mouseUp,

      mouseEvents = {
        touchstart: 'mousedown',
        touchmove:  'mousemove',
        touchend:   'mouseup'
      };
  
  function getNativeEvent (event) {

    while(event && typeof event.originalEvent !== "undefined") {
      event=event.originalEvent;
    }

    return event;
  }
  
  function makeMouseEvent (event) {

    var touch = getNativeEvent(event).changedTouches[0];

    return $.extend(event, {
      type:    mouseEvents[event.type],
      which:   1,
      pageX:   touch.pageX,
      pageY:   touch.pageY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      clientX: touch.clientX,
      clientY: touch.clientY,
      target:  touch.target
		});
  }

  mouseProto._mouseInit = function () {

    var self = this;

    this.element.bind('touchstart.' + this.widgetName, function (event) {
      return self._mouseDown(makeMouseEvent(event));
    });

    _mouseInit.call(this);
  };

  mouseProto._mouseDown = function (event) {

    var self = this,
        ret  = _mouseDown.call(self, event);

    self._touchMoveDelegate = function (event) {
      return self._mouseMove(makeMouseEvent(event));
    };
    
    self._touchEndDelegate = function(event) {
      return self._mouseUp(makeMouseEvent(event));
    };

    $(document)
      .bind('touchmove.' + self.widgetName, self._touchMoveDelegate)
      .bind('touchend.' + self.widgetName, self._touchEndDelegate);

    return ret;
  };

  mouseProto._mouseUp = function (event) {

    var self = this;

    $(document)
      .unbind('touchmove.' + self.widgetName)
      .unbind('touchend.' + self.widgetName);

    return _mouseUp.call(self, event);
  };

})(jQuery);
