/**
*                                Author: Vladimir Novick 
*                                       ( http://www.linkedin.com/in/vladimirnovick , vlad.novick@gmail.com )
* 
*    February 2010 
*/



TTipConfig = function(ttip, set) {
  set = set || '';
    ttip.fontColor          = 'black';                       
    ttip.fontFamily         = 'Arial, sans-serif';           
    ttip.fontSize           = '12pt';                        
    ttip.minWidth           = 100;                           
    ttip.maxWidth           = 400;                           
    ttip.delayTime          = 750;                           
    ttip.vOffset            = 10;                            
    ttip.hOffset            = 10;                            
    ttip.stem               = true;                          
    ttip.images             = './images';             
    ttip.ieImage            = 'ttip_ie.png';              
    ttip.ttipImage       = 'ttip.png';                 
    ttip.upLeftStem         = 'up_left.png';                 
    ttip.downLeftStem       = 'down_left.png';               
    ttip.upRightStem        = 'up_right.png';                
    ttip.downRightStem      = 'down_right.png';              
    ttip.closeButton        = 'close.png';                   
    ttip.closeButtonWidth   = 16;                            
    ttip.allowAJAX          = true;                          
    ttip.allowIframes       = true;                          
    ttip.trackCursor        = true;                          
    ttip.shadow             = 20;                            
    ttip.padding            = 10;                            
    ttip.stemHeight         = 32;                            
    ttip.stemOverlap        = 3;                             
    ttip.vOffset            = 1;                             
    ttip.hOffset            = 1;                             
    ttip.opacity            = 0.9;                           
    ttip.configured         = set || true;                   
}


var TTip = function () {
  this.trackCursor = true;
  document.onmousemove = this.setActiveCoordinates;

  var myObject = this.isIE() ? window : document;
  myObject.onscroll  = function(){TTip.prototype.nukeTooltip()};

  window.onbeforeunload = function(){
    TTip.prototype.nukeTooltip();
    ttipIsSuppressed = true;
  };

  if (this.isIE()) {
    this.suppress = true;
  }

  return this;
}

TTip.prototype.showTooltip = function(evt,caption,sticky,width,height) {

  if (!this.configured) {
    TTipConfig(this,'GBubble');
  }

  
  
  this.stopTrackingX = this.trackCursor ? 100 : 10;
  this.stopTrackingY = this.trackCursor ? 50  : 10;

  
  
  if (this.isIE() && document.readyState.match(/complete/i)) {
    this.suppress = false;
  }

  
  if (this.suppress || ttipIsSuppressed) {
    return false;
  }

  
  if (tooltipIsSuppressed && !sticky) {
    return false;
  }

  
  if (this.opacity && this.opacity < 1) {
    this.opacity = parseInt(parseFloat(this.opacity) * 100);
  }
  else if (this.opacity && this.opacity == 1) {
    this.opacity = 100;
  }
  else {
          this.opacity = 100;
       }

  
  if (this.isKonqueror()) {
    this.allowFade = false;
    this.opacity   = 100;
  }

  
  
  if (this.isIE() && this.allowFade) {
    this.opacity = 100;
  }

  
  var mouseOver = evt.type.match('mouseover','i');  

  
  if (!mouseOver) {
    sticky = true;
    this.fadeOK = false;
    
    if (ttipIsVisible) {
      this.hideTooltip();
    }
  }
  else {
    this.fadeOK = this.allowFade;
  }

  
  if (ttipIsVisible && !ttipIsSticky && mouseOver) {
    return false;
  }

  
  if (ttipIsVisible && ttipIsSticky && !sticky) {
    return false;
  }

  
  
  var el = this.getEventTarget(evt);
  if (sticky && mouseOver && this.isSameElement(el,this.currentElement)) {
    return false;
  }  
  this.currentElement = el;
  
  
  this.elCoords = this.getLoc(el,'region');

  
  if (!sticky) {
    var mouseoutFunc = el.onmouseout;
    var closeTTip = function() { 
      TTip.prototype.hideTooltip();
      
      if (mouseoutFunc) {
        mouseoutFunc();
      }
    }
    if (!mouseOver) {
      el.onmouseup  = function() {return false};
    }
    el.onmouseout = closeTTip;
  }  
  
  ttipIsSticky = sticky;

  this.hideTooltip();

  
  this.currentHelpText = this.getAndCheckContents(caption);

  
  if (!this.currentHelpText) {
    return false;
  }

  this.width  = width;
  this.height = height;
  this.actualWidth = null;

  
  this.hideTooltip();

  
  
  
  this.container = document.createElement('div');
  this.container.id = 'ttipPreloadContainer';
  document.body.appendChild(this.container);
  this.setStyle(this.container,'position','absolute');
  this.setStyle(this.container,'top',-8888);
  this.setStyle(this.container,'font-family',this.fontFamily);
  this.setStyle(this.container,'font-size',this.fontSize);

  
  this.currentHelpText = this.currentHelpText.replace(/\&amp;/g, '&amp;amp');
  this.container.innerHTML = unescape(this.currentHelpText);
  
  
  if (this.images) {

    
    this.ttipImage  = this.ttipImage  ? this.images +'/'+ this.ttipImage  : false;
    this.ieImage       = this.ieImage       ? this.images +'/'+ this.ieImage       : false;

    
    this.upLeftStem    = this.upLeftStem    ? this.images +'/'+ this.upLeftStem    : false;
    this.upRightStem   = this.upRightStem   ? this.images +'/'+ this.upRightStem   : false;
    this.downLeftStem  = this.downLeftStem  ? this.images +'/'+ this.downLeftStem  : false;
    this.downRightStem = this.downRightStem ? this.images +'/'+ this.downRightStem : false;

    this.closeButton   = this.closeButton   ? this.images +'/'+ this.closeButton   : false;

    this.images        = false;
  }

  
  
  
  
  
  
  if (this.ieImage && (this.isIE() || this.isChrome())) {
    if (this.isOldIE() || this.opacity || this.allowFade) {    
      this.ttipImage = this.ieImage;
    }
  }

  
  if (!this.preloadedImages) {
    var images = new Array(this.ttipImage, this.closeButton);
    if (this.ieImage) {
      images.push(this.ieImage);
    }
    if (this.stem) {
      images.push(this.upLeftStem,this.upRightStem,this.downLeftStem,this.downRightStem);
    }
    var len = images.length;
    for (var i=0;i<len;i++) {
      if ( images[i] ) {
        this.preload(images[i]);
      }
    }
    this.preloadedImages = true;
  }

  currentTTipClass = this;

  
  if (!mouseOver) {
    this.setActiveCoordinates(evt);
  }

  
  this.currentEvent = evt;

  
  evt.cancelBubble  = true;

  
  var delay = mouseOver ? this.delayTime : 1;
  this.timeoutTooltip = window.setTimeout(this.doShowTooltip,delay);
  this.pending = true;
}


TTip.prototype.preload = function(src) {
  var i = new Image;
  i.src = src;

  
  
  this.setStyle(i,'position','absolute');
  this.setStyle(i,'top',-8000);
  document.body.appendChild(i);
  document.body.removeChild(i);
}





TTip.prototype.doShowTooltip = function() {
  var self = currentTTipClass;

  
  if (ttipIsVisible) {
    return false;  
  }
 
  if (!self.parent) {
    if (self.parentID) {
      self.parent = document.getElementById(self.parentID);
    }
    else {
      self.parent = document.body;
    }
    self.xOffset = self.getLoc(self.parent, 'x1');
    self.yOffset = self.getLoc(self.parent, 'y1');
  }

  
  
  window.clearTimeout(self.timeoutFade);
  if (!ttipIsSticky) {
    self.setStyle('visibleTTipElement','display','none');
  }

  
  self.parseIntAll();

  
  var ttip = self.makeTTip();

  
  var pageWidth   = YAHOO.util.Dom.getViewportWidth();
  var pageCen     = Math.round(pageWidth/2);
  var pageHeight  = YAHOO.util.Dom.getViewportHeight();
  var pageLeft    = YAHOO.util.Dom.getDocumentScrollLeft();
  var pageTop     = YAHOO.util.Dom.getDocumentScrollTop();
  var pageMid     = pageTop + Math.round(pageHeight/2);
  self.pageBottom = pageTop + pageHeight;
  self.pageTop    = pageTop;
  self.pageLeft   = pageLeft;
  self.pageRight  = pageLeft + pageWidth;

  
  var vOrient = self.activeTop > pageMid ? 'up' : 'down';
  var hOrient = self.activeRight > pageCen ? 'left' : 'right';
  
  
  var helpText = self.container.innerHTML;
  self.actualWidth = self.getLoc(self.container,'width');
  if (!isNaN(self.actualWidth)) {
    self.actualWidth += 10;
  }
  self.parent.removeChild(self.container);
  var wrapper = document.createElement('div');
  wrapper.id = 'contentWrapper';
  self.contents.appendChild(wrapper);
  wrapper.innerHTML = helpText;

  
  self.setTTipStyle(vOrient,hOrient,pageWidth,pageLeft);

  
  if (ttipIsSticky) {
    self.addCloseButton();
  }

  ttipIsVisible = true;
  self.pending = false;  

  
  self.showHide();

  self.startX = self.activeLeft;
  self.startY = self.activeTop;

  self.fade(0,self.opacity,self.fadeIn);
}

TTip.prototype.addCloseButton = function () {
  var self         = currentTTipClass;
  var margin       = Math.round(self.padding/2);
  var closeWidth   = self.closeButtonWidth || 16;
  var ttipTop   = self.getLoc('visibleTTipElement','y1') + margin + self.shadow;
  var TTipLeft  = self.getLoc('topRight','x2') - self.closeButtonWidth - self.shadow - margin;
  var closeButton  = document.getElementById('closeButton');

  if (!closeButton) {
    closeButton = new Image;
    closeButton.setAttribute('id','closeButton');
    closeButton.setAttribute('src',self.closeButton);
    closeButton.onclick = function() {
      TTip.prototype.nukeTooltip();
    };
    self.setStyle(closeButton,'position','absolute');
    document.body.appendChild(closeButton);
  }

  
  if (self.isIE()) {
    TTipLeft = TTipLeft - 5;
  }

  self.setStyle(closeButton,'top',ttipTop);
  self.setStyle(closeButton,'left',TTipLeft);
  self.setStyle(closeButton,'display','inline');
  self.setStyle(closeButton,'cursor','pointer');
  self.setStyle(closeButton,'z-index',999999999);
}



TTip.prototype.makeTTip = function() {
  var self = currentTTipClass;

  var ttip = document.getElementById('visibleTTipElement');
  if (ttip) {
    self.hideTooltip();
  }

  ttip = document.createElement('div');
  ttip.setAttribute('id','visibleTTipElement');
  self.parent.appendChild(ttip);
  self.activeTTip = ttip;

  self.parts = new Array();
  var parts = new Array('contents','topRight','bottomRight','bottomLeft');
  for (var i=0;i<parts.length;i++) {
    var child = document.createElement('div');
    child.setAttribute('id',parts[i]);
    ttip.appendChild(child);
    if (parts[i] == 'contents') self.contents = child;
    self.parts.push(child);
  }
  

  if (self.displayTime)  {
    self.timeoutAutoClose = window.setTimeout(this.hideTooltip,self.displayTime);
  }
  return ttip;
}

TTip.prototype.setTTipStyle = function(vOrient,hOrient,pageWidth,pageLeft) {
  var self = currentTTipClass;
  var ttip = self.activeTTip;

  if (typeof(self.shadow) != 'number') self.shadow = 0;
  if (!self.stem) self.stemHeight = 0;

  var fullPadding   = self.padding + self.shadow;
  var insidePadding = self.padding;
  var outerWidth    = self.actualWidth + fullPadding;
  var innerWidth    = self.actualWidth;  

  self.setStyle(ttip,'position','absolute');
  self.setStyle(ttip,'top',-9999);
  self.setStyle(ttip,'z-index',1000000);

  if (self.height) {
    self.setStyle('contentWrapper','height',self.height-fullPadding);
  }

  if (self.width) {
    self.setStyle(ttip,'width',self.width);  
    innerWidth = self.width - fullPadding;
    if (ttipIsSticky) {
      innerWidth -= self.closeButtonWidth;
    }
    self.setStyle('contentWrapper','width',innerWidth);
  }
  else {
    self.setStyle(ttip,'width',outerWidth);
    self.setStyle('contentWrapper','width',innerWidth);
  }

  
  if (!self.width && self.maxWidth && outerWidth > self.maxWidth) {
    self.setStyle(ttip,'width',self.maxWidth);
    self.setStyle('contentWrapper','width',self.maxWidth-fullPadding);
  }
  
  if (!self.width && self.minWidth && outerWidth < self.minWidth) {
    self.setStyle(ttip,'width',self.minWidth);
    self.setStyle('contentWrapper','width',self.minWidth-fullPadding);
  }

  self.setStyle('contents','z-index',2);
  self.setStyle('contents','color',self.fontColor);
  self.setStyle('contents','font-family',self.fontFamily);
  self.setStyle('contents','font-size',self.fontSize);
  self.setStyle('contents','background','url('+self.ttipImage+') top left no-repeat');
  self.setStyle('contents','padding-top',fullPadding);
  self.setStyle('contents','padding-left',fullPadding);

  self.setStyle('bottomRight','background','url('+self.ttipImage+') bottom right no-repeat');
  self.setStyle('bottomRight','position','absolute');
  self.setStyle('bottomRight','right',0-fullPadding);
  self.setStyle('bottomRight','bottom',0-fullPadding);
  self.setStyle('bottomRight','height',fullPadding);
  self.setStyle('bottomRight','width',fullPadding);
  self.setStyle('bottomRight','z-index',-1);

  self.setStyle('topRight','background','url('+self.ttipImage+') top right no-repeat');
  self.setStyle('topRight','position','absolute');
  self.setStyle('topRight','right',0-fullPadding);
  self.setStyle('topRight','top',0);
  self.setStyle('topRight','width',fullPadding);

  self.setStyle('bottomLeft','background','url('+self.ttipImage+') bottom left no-repeat');
  self.setStyle('bottomLeft','position','absolute');
  self.setStyle('bottomLeft','left',0);
  self.setStyle('bottomLeft','bottom',0-fullPadding);
  self.setStyle('bottomLeft','height',fullPadding);
  self.setStyle('bottomLeft','z-index',-1);

  if (this.stem) {
    var stem = document.createElement('img');
    self.setStyle(stem,'position','absolute');
    ttip.appendChild(stem);
 
    if (vOrient == 'up' && hOrient == 'left') {  
      stem.src = self.upLeftStem;
      var height_ = self.stemHeight + insidePadding - self.stemOverlap;
      self.setStyle(stem,'bottom',0-height_);
      self.setStyle(stem,'right',0);             
    }
    else if (vOrient == 'down' && hOrient == 'left') {
      stem.src = self.downLeftStem;
      var height_ = self.stemHeight - (self.shadow + self.stemOverlap);
      self.setStyle(stem,'top',0-height_);
      self.setStyle(stem,'right',0);
    }
    else if (vOrient == 'up' && hOrient == 'right') {
      stem.src = self.upRightStem;
      var height_ = self.stemHeight + insidePadding - self.stemOverlap;
      self.setStyle(stem,'bottom',0-height_);
      self.setStyle(stem,'left',self.shadow);
    }
    else if (vOrient == 'down' && hOrient == 'right') {
      stem.src = self.downRightStem;
      var height_ = self.stemHeight - (self.shadow + self.stemOverlap);
      self.setStyle(stem,'top',0-height_);
      self.setStyle(stem,'left',self.shadow);
    }
    if (self.fadeOK && self.isIE()) {
      self.parts.push(stem);
    }
  }

  if (self.allowFade) {
    self.setOpacity(1);
  }
  else if (self.opacity) {
    self.setOpacity(self.opacity);
  }

  
  if (hOrient == 'left') {
    var pageWidth = self.pageRight - self.pageLeft;
    var activeRight = pageWidth - self.activeLeft;
    self.setStyle(ttip,'right',activeRight);
  }
  else {
    var activeLeft = self.activeRight - self.xOffset;
    self.setStyle(ttip,'left',activeLeft);
  }

  
  var overflow = ttipIsSticky ? 'auto' : 'hidden';
  self.setStyle('contentWrapper','overflow',overflow);

  
  if (ttipIsSticky) {
    self.setStyle('contentWrapper','margin-right',self.closeButtonWidth);
  }

  
  
  
  var ttipLeft   = self.getLoc(ttip,'x1');
  var ttipRight  = self.getLoc(ttip,'x2');
  var scrollBar     = 20;

  if (hOrient == 'right' && ttipRight > (self.pageRight - fullPadding)) {
    var width_ = (self.pageRight - ttipLeft) - fullPadding - scrollBar;
    self.setStyle(ttip,'width',width_);
    self.setStyle('contentWrapper','width',width-fullPadding);
  }
  else if (hOrient == 'left' && ttipLeft < (self.pageLeft + fullPadding)) {
    var width_ = (ttipRight - self.pageLeft) - fullPadding;
    self.setStyle(ttip,'width',width_);
    self.setStyle('contentWrapper','width',width-fullPadding);
  }

  
  var ttipWidth  = self.getLoc(ttip,'width');
  var ttipHeight = self.getLoc(ttip,'height');

  
  var vOverlap = self.isOverlap('topRight','bottomRight');
  var hOverlap = self.isOverlap('bottomLeft','bottomRight');
  if (vOverlap) {
    self.setStyle('topRight','height',ttipHeight-vOverlap[1]);
  }
  if (hOverlap) {
    self.setStyle('bottomLeft','width',ttipWidth-hOverlap[0]);
  }

  
  if (vOrient == 'up') {
    var activeTop = self.activeTop - ttipHeight;
    self.setStyle(ttip,'top',activeTop);
  }
  else {
    var activeTop = self.activeBottom;
    self.setStyle(ttip,'top',activeTop);
  }

  
  var ttipTop    = self.getLoc(ttip,'y1');
  var ttipBottom = self.height ? ttipTop + self.height : self.getLoc(ttip,'y2');
  var deltaTop      = ttipTop < self.pageTop ? self.pageTop - ttipTop : 0;
  var deltaBottom   = ttipBottom > self.pageBottom ? ttipBottom - self.pageBottom : 0;

  if (vOrient == 'up' && deltaTop) {
    var newHeight = ttipHeight - deltaTop;
    if (newHeight > (self.padding*2)) {
      self.setStyle('contentWrapper','height',newHeight-fullPadding);
      self.setStyle(ttip,'top',self.pageTop+self.padding);
      self.setStyle(ttip,'height',newHeight);
    }
  }
  if (vOrient == 'down' && deltaBottom) {
    var newHeight = ttipHeight - deltaBottom - scrollBar;
    if (newHeight > (self.padding*2) + scrollBar) {
      self.setStyle('contentWrapper','height',newHeight-fullPadding);
      self.setStyle(ttip,'height',newHeight);
    }
  }

  
  var iframe = ttip.getElementsByTagName('iframe');
  if (iframe[0]) {
    iframe = iframe[0];
    var w = self.getLoc('contentWrapper','width');
    if (ttipIsSticky && !this.isIE()) {
      w -= self.closeButtonWidth;
    }
    var h = self.getLoc('contentWrapper','height');
    self.setStyle(iframe,'width',w);
    self.setStyle(iframe,'height',h);
    self.setStyle('contentWrapper','overflow','hidden');
  }

  
  self.setStyle('topRight','height', self.getLoc(ttip,'height'));
  self.setStyle('bottomLeft','width', self.getLoc(ttip,'width'));

  self.hOrient = hOrient;
  self.vOrient = vOrient;
}




TTip.prototype.fade = function(opacStart, opacEnd, millisec) {
  var self = currentTTipClass || new TTip;
  if (!millisec || !self.allowFade) {
    return false;
  }

  opacEnd = opacEnd || 100;

  
  var speed = Math.round(millisec / 100);
  var timer = 0;
  for(o = opacStart; o <= opacEnd; o++) {
    self.timeoutFade = setTimeout('TTip.prototype.setOpacity('+o+')',(timer*speed));
    timer++;
  }
}

TTip.prototype.setOpacity = function(opc) {
  var self = currentTTipClass;
  if (!self || !opc) return false;

  var o = parseFloat(opc/100);

  
  var parts = self.isIE() ? self.parts : [self.activeTTip];

  var len = parts.length;
  for (var i=0;i<len;i++) {
    self.doOpacity(o,opc,parts[i]);
  }
}

TTip.prototype.doOpacity = function(op,opc,el) {
  var self = currentTTipClass;
  if (!el) return false;

  
  self.setStyle(el,'opacity',op);

  
  self.setStyle(el,'filter','alpha(opacity='+opc+')');

  
  self.setStyle(el,'MozOpacity',op);

  
  self.setStyle(el,'KhtmlOpacity',op);
}

TTip.prototype.nukeTooltip = function() {
  this.hideTooltip(1);
}

TTip.prototype.hideTooltip = function(override) { 
  
  if (override && typeof override == 'object') override = false;
  if (ttipIsSticky && !override) return false;
  var self = currentTTipClass;
  TTip.prototype.showHide(1);
  TTip.prototype.cleanup();

  if (self) {
    window.clearTimeout(self.timeoutTooltip);
    window.clearTimeout(self.timeoutFade);
    window.clearTimeout(self.timeoutAutoClose);
    if (ttipIsSticky) {
      self.currentElement = null;
    }
    self.startX = 0;
    self.startY = 0;
  }

  ttipIsVisible = false;
  ttipIsSticky  = false;
}


TTip.prototype.cleanup = function() {
  var self = currentTTipClass;
  var body;
  if (self) {
    body = self.parent   ? self.parent 
         : self.parentID ? document.getElementById(self.parentID) || document.body
         : document.body;
  }
  else {
    body = document.body;
  }

  var bubble = document.getElementById('visibleTTipElement');
  var close  = document.getElementById('closeButton');
  var cont   = document.getElementById('ttipPreloadContainer');
  if (bubble) { body.removeChild(bubble) } 
  if (close)  { body.removeChild(close)  }
  if (cont)   { body.removeChild(cont)   }
}




hideAllTooltips = function() {
  var self = currentTTipClass;
  if (!self) return;
  window.clearTimeout(self.timeoutTooltip);
  if (self.activeTTip) self.setStyle(self.activeTTip,'display','none');
  ttipIsVisible    = false;
  ttipIsSticky     = false;
  currentTTipClass = null;
}



TTip.prototype.setActiveCoordinates = function(evt) {
  var self = currentTTipClass;
  if (!self) {
    return true;
  }

  var evt = evt || window.event || self.currentEvent;
  if (!evt) {
    return true;
  }
  
  self.currentEvent = {};
  for (var i in evt) {
    self.currentEvent[i] = evt[i];
  }

  
  self.hOffset = self.hOffset || 1;
  self.vOffset = self.vOffset || 1;
  self.stemHeight = self.stem && self.stemHeight ? (self.stemHeight|| 0) : 0;

  var scrollTop  = 0;
  var scrollLeft = 0;

  var XY = self.eventXY(evt);
  adjustment   = self.hOffset < 20 ? 10 : 0;
  self.activeTop    = scrollTop  + XY[1] - adjustment - self.vOffset - self.stemHeight;
  self.activeLeft   = scrollLeft + XY[0] - adjustment - self.hOffset;
  self.activeRight  = scrollLeft + XY[0];
  self.activeBottom = scrollTop  + XY[1] + self.vOffset + 2*adjustment;

  
  
  if (ttipIsVisible && !ttipIsSticky) {
    var deltaX = Math.abs(self.activeLeft - self.startX);
    var deltaY = Math.abs(self.activeTop - self.startY);

    
    if (  XY[0] < self.elCoords.left || XY[0] > self.elCoords.right
       || XY[1] < self.elCoords.top  || XY[1] > self.elCoords.bottom ) {
      self.hideTooltip();
    }
    
    
    
    if (deltaX > self.stopTrackingX || deltaY > self.stopTrackingY) {
      self.hideTooltip();
    }
    else if (self.trackCursor) {
      var b = self.activeTTip;
      var bwidth  = self.getLoc(b,'width');
      var bheight = self.getLoc(b,'height');
      var btop    = self.getLoc(b,'y1');
      var bleft   = self.getLoc(b,'x1');

      if (self.hOrient == 'right') {
        self.setStyle(b,'left',self.activeRight);
      }
      else if (self.hOrient == 'left') {
        self.setStyle(b,'right',null);
        var newLeft = self.activeLeft - bwidth;
        self.setStyle(b,'left',newLeft);
      }

      if (self.vOrient == 'up') {
        self.setStyle(b,'top',self.activeTop - bheight);
      }
      else if (self.vOrient == 'down') {
        self.setStyle(b,'top',self.activeBottom);
      }
    }
  }

  return true;
}




TTip.prototype.eventXY = function(event) {
  var XY = new Array(2);
  var e = event || window.event;
  if (!e) {
    return false;
  }
  if (e.pageX || e.pageY) {
    XY[0] = e.pageX;
    XY[1] = e.pageY;
    return XY;
  }
  else if ( e.clientX || e.clientY ) {
    XY[0] = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    XY[1] = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    return XY;
  }
}

TTip.prototype.getEventTarget = function(event) {
  var targ;
  var e = event || window.event;
  if (e.target) targ = e.target;
  else if (e.srcElement) targ = e.srcElement;
  if (targ.nodeType == 3) targ = targ.parentNode; 
  return targ;
}



TTip.prototype.setStyle = function(el,att,val) {
  if (!el) { 
    return false;
  }
  if (typeof(el) != 'object') {
    el = document.getElementById(el);
  }
  if (!el) {
    return false;
  }
  
  var v = val;

  if (val && att.match(/left|top|bottom|right|width|height|padding|margin/)) {
    val = new String(val);
    if (!val.match(/auto/)) {
      val += 'px';
    }
  }


  
  if (att == 'z-index') {
    if (el.style) {
      el.style.zIndex = parseInt(val);
    }
  }
  else {
    
    if (this.isIE() && att.match(/^left|right|top|bottom$/)  && !parseInt(val) && val != 0) {
      val = null;
    }

    YAHOO.util.Dom.setStyle(el,att,val);
  }
}


TTip.prototype.getLoc = function(el,request) {
  var region = YAHOO.util.Dom.getRegion(el);

  switch(request) {
    case ('y1') : return parseInt(region.top);
    case ('y2') : return parseInt(region.bottom);
    case ('x1') : return parseInt(region.left);
    case ('x2') : return parseInt(region.right);
    case ('width')  : return (parseInt(region.right)  - parseInt(region.left));
    case ('height') : return (parseInt(region.bottom) - parseInt(region.top));
    case ('region') : return region; 
  }

  return region;
}



TTip.prototype.parseIntAll = function() {
  this.padding     = parseInt(this.padding);
  this.shadow      = parseInt(this.shadow);
  this.stemHeight  = parseInt(this.stemHeight);
  this.stemOverlap = parseInt(this.stemOverlap);
  this.vOffset     = parseInt(this.vOffset);
  this.delayTime   = parseInt(this.delayTime);
  this.width       = parseInt(this.width);
  this.maxWidth    = parseInt(this.maxWidth);
  this.minWidth    = parseInt(this.minWidth);
  this.fadeIn      = parseInt(this.fadeIn) || 1000;
}




TTip.prototype.showHide = function(visible) {
  var self = currentTTipClass || new TTip;

  
  if (self.isOldIE()) {
    var ttipContents = document.getElementById('contentWrapper');
    if (!visible && ttipContents) {
      var ttipSelects = ttipContents.getElementsByTagName('select');
      var myHash = new Object();
      for (var i=0; i<ttipSelects.length; i++) {
        var id = ttipSelects[i].id || ttipSelects[i].name;
        myHash[id] = 1;
      }
      ttipInvisibleSelects = new Array();
      var allSelects = document.getElementsByTagName('select');
      for (var i=0; i<allSelects.length; i++) {
        var id = allSelects[i].id || allSelects[i].name;
        if (self.isOverlap(allSelects[i],self.activeTTip) && !myHash[id]) {
          ttipInvisibleSelects.push(allSelects[i]);
          self.setStyle(allSelects[i],'visibility','hidden');
        }
      }
    }
    else if (ttipInvisibleSelects) {
      for (var i=0; i < ttipInvisibleSelects.length; i++) {
        var id = ttipInvisibleSelects[i].id || ttipInvisibleSelects[i].name;
        self.setStyle(ttipInvisibleSelects[i],'visibility','visible');
     }
     ttipInvisibleSelects = null;
    }
  }

  
  if (self.hide) {
    var display = visible ? 'inline' : 'none';
    for (var n=0;n<self.hide.length;n++) {
      if (self.isOverlap(self.activeTTip,self.hide[n])) {
        self.setStyle(self.hide[n],'display',display);
      }
    }
  }
}


TTip.prototype.isOverlap = function(el1,el2) {
  if (!el1 || !el2) return false;
  var R1 = this.getLoc(el1,'region');
  var R2 = this.getLoc(el2,'region');
  if (!R1 || !R2) return false;
  var intersect = R1.intersect(R2);
  if (intersect) {
    
    intersect = new Array((intersect.right - intersect.left),(intersect.bottom - intersect.top));
  }
  return intersect;
}


TTip.prototype.isSameElement = function(el1,el2) {
  if (!el1 || !el2) return false;
  var R1 = this.getLoc(el1,'region');
  var R2 = this.getLoc(el2,'region');
  var same = R1.contains(R2) && R2.contains(R1);
  return same ? true : false;
}






TTip.prototype.getAndCheckContents = function(caption) {
  var originalCaption = caption;
  var notAllowed = 'are not allowed in popup ttips in this web site.  \
Please contact the site administrator for assistance.';
  var notSupported = 'AJAX is not supported for popup ttips in this web site.  \
Please contact the site administrator for assistance.';
  
  
  if (this.helpUrl && !this.allowAJAX) {
    alert('Sorry, you have specified help URL '+this.helpUrl+' but '+notSupported);
    return null;
  }

  
  if (caption.match(/^url:/)) {
    this.activeUrl = caption.replace(/^url:/,'');
    caption = '';
  }
  
  else if (caption.match(/^(https?:|\/|ftp:)\S+$/i)) {
    this.activeUrl = caption;
    caption = '';
  }

  
  if (this.activeUrl && !this.allowAJAX) {
    alert('Sorry, you asked for '+originalCaption+' but '+notSupported);
    return null;
  }  

  
  if (caption.match(/^load:/)) {
    var load = caption.split(':');
    if (!document.getElementById(load[1])) alert ('problem locating element '+load[1]);
    caption = document.getElementById(load[1]).innerHTML;
    this.loadedFromElement = true;
  }

  
  if (caption.match(/\<\s*iframe/i) && !this.allowIframes) {
    alert('Sorry: iframe elements '+notAllowed);
    return null;
  }

  
  if (caption.match(/\bon(load|mouse|click|unload|before)[^=]*=/i) && !this.allowEventHandlers) {
    alert('Sorry: JavaScript event handlers '+notAllowed);
    return null;
  }

  
  if (caption.match(/\<\s*script/i) && !this.allowScripts) {
    alert('Sorry: <script> elements '+notAllowed);
    return null;
  }

  
  this.currentHelpText = this.getContents(caption);
  this.loadedFromElement = false;
  
  return this.currentHelpText;;
}






TTip.prototype.getContents = function(section) {

  
  if (!this.helpUrl && !this.activeUrl) return section;

  
  if (this.loadedFromElement) return section;

  
  var url = this.activeUrl || this.helpUrl;
  url    += this.activeUrl ? '' : '?section='+section;

  
  this.activeUrl = null;

  var ajax;
  if (window.XMLHttpRequest) {
    ajax = new XMLHttpRequest();
  } else {
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (ajax) {
    ajax.open("GET", url, false);
    ajax.onreadystatechange=function() {
      
    };
    try {
      ajax.send(null);
    }
    catch (e) {
    
    }
    var txt = this.escapeHTML ? escape(ajax.responseText) : ajax.responseText;
    return  txt || section;
  }
  else {
    return section;
  }
}



TTip.prototype.isIE = function() {
  return document.all && !window.opera;
}


TTip.prototype.isOldIE = function() {
  if (navigator.appVersion.indexOf("MSIE") == -1) return false;
  var temp=navigator.appVersion.split("MSIE");
  return parseFloat(temp[1]) < 7;
}


TTip.prototype.isKonqueror = function() {
  return navigator.userAgent.toLowerCase().indexOf( 'konqueror' ) != -1;
}


TTip.prototype.isChrome = function() {
  return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}