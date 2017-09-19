/**
*                                Author: Vladimir Novick 
*                                       ( http://www.linkedin.com/in/vladimirnovick , vlad.novick@gmail.com )
* 
*    February 2010 
*/



function GetInnerHtml(divName){
    p = $(divName)[0];
    return p.innerHTML;
}

function setCenterMarker2(event, caurrentLatLng) {
    $('.contextmenu').remove();
     setCenterMarker(caurrentLatLng);
}

function setCenterMarker(caurrentLatLng) {

    if (gblCenterMarker != null) {
        gblCenterMarker.close();
    }

    if (gbl_centerIconMarker2) {
        gbl_centerIconMarker2.setMap(null);
        gbl_centerIconMarker2 = null;
    }


    gblCenterMarker = new DistanceWidget(gblMap, caurrentLatLng, "Your custom location", 2);
    DoCSEventDistance(" (*) ", "Your custom location", caurrentLatLng.lat(), caurrentLatLng.lng());
}

/** * Creates a point on the earth's surface at the supplied latitude / longitude *
 * @constructor 
 * @param {Number} lat: latitude in numeric degrees 
 * @param {Number} lon: longitude in numeric degrees 
 * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km 
 */
 
 
 function LatLon(lat, lon, rad)
 {  if (typeof rad == 'undefined') rad = 6371;
 // earth's mean radius in km  
 this.m_precision = 4;
 this._lat = lat;
 this._lon = lon;
 this._radius = rad;
 }
 

 
 LatLon.prototype.distanceTo = function(point, precision)
 {  
 // default 4 sig figs reflects typical 0.3% accuracy of spherical model  
 
 if (typeof precision == 'undefined') { this.m_precision = 4; }
   else this.m_precision = precision;
 var R = this._radius;
 var lat1 = this._lat.toRad();
 var lon1 = this._lon.toRad();
 var lat2 = point._lat.toRad();
 var lon2 = point._lon.toRad();
 var dLat = lat2 - lat1;
 var dLon = lon2 - lon1;
 var a = 0;
 a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
 Math.cos(lat1) * Math.cos(lat2)  *           Math.sin(dLon/2) * Math.sin(dLon/2);
 var c = 0;
 c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 var d = 0;
 d=  R * c;
 return d.toPrecisionFixed(m_precision);
 }
 
  LatLon.prototype.getDistance = function(aLat,aLng)
 {  
 // default 4 sig figs reflects typical 0.3% accuracy of spherical model  
 
 
 var R = this._radius;
 var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
 var lat2 = aLat.toRad(), lon2 = aLng.toRad();
 var dLat = lat2 - lat1;
 var dLon = lon2 - lon1;
 var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
 Math.cos(lat1) * Math.cos(lat2)  *           Math.sin(dLon/2) * Math.sin(dLon/2);
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 var d = R * c;
 return d.toPrecision(4);
 }

LL.dH = function(alat1, alon1, alat2, alon2) {
var R = 6371.0;
var dLat = alat2.toRad() - alat1.toRad();
var dLon = alon2.toRad() - alon1.toRad();
var lat1 = alat1.toRad();
var lat2 = alat2.toRad();
var a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
Math.cos(lat1) * Math.cos(lat2) *
Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);
var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
var d = R * c;
return d;
};



LL.distCosineLaw = function(lat1, lon1, lat2, lon2) {
var R = 6371.0;
var d = Math.acos(Math.sin(lat1.toRad()) * Math.sin(lat2.toRad()) +
Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.cos((lon2 - lon1).toRad())) * R;
return d;
};


LL.bearing = function(lat1, lon1, lat2, lon2) {
lat1 = lat1.toRad(); lat2 = lat2.toRad();
var dLon = (lon2 - lon1).toRad();
var y = Math.sin(dLon) * Math.cos(lat2);
var x = Math.cos(lat1) * Math.sin(lat2) -
Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
return Math.atan2(y, x).toBrng();
};


LL.prototype.destPoint = function(brng, d) {
var R = 6371; // earth's mean radius in km
var lat1 = this.lat.toRad(), lon1 = this.lon.toRad();
brng = brng.toRad();
var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) +
     Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));
var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
 Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));
 lon2 = (lon2 + Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180...+180
 if (isNaN(lat2) || isNaN(lon2)) return null;
 return new LL(lat2.toDeg(), lon2.toDeg());
};


function LL(lat, lon) {
this.lat = lat;
this.lon = lon;
};


LL.prototype.toString = function() {
  return this.lat.toLat() + ', ' + this.lon.toLon();
};


String.prototype.parseDeg = function() {
var deg
if (!isNaN(this)) return Number(this)
var degLL = this.replace(/^-/, '').replace(/[NSEW]/i, '')
var dms = degLL.split(/[^0-9.]+/)
for (var i in dms) if (dms[i] == '') dms.splice(i, 1)
switch (dms.length) {
    case 3:
        deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600; break
    case 2:
        deg = dms[0] / 1 + dms[1] / 60; break
    case 1:
        if (/[NS]/i.test(this)) degLL = '0' + degLL
        deg = dms[0].slice(0, 3) / 1 + dms[0].slice(3, 5) / 60 + dms[0].slice(5) / 3600; break
    default: return NaN
}
if (/^-/.test(this) || /[WS]/i.test(this)) deg = -deg
return deg
}
// note: whitespace at start/end will split() into empty elements (except in IE)


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// extend Number object with methods for converting degrees/radians

Number.prototype.toRad = function() {  // convert degrees to radians
    return this * Math.PI / 180;
};

Number.prototype.toDeg = function() {  // convert radians to degrees (signed)
    return this * 180 / Math.PI;
};

Number.prototype.toBrng = function() {  // convert radians to degrees (as bearing: 0...360)
    return (this.toDeg() + 360) % 360;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// extend Number object with methods for presenting bearings & lat/longs

Number.prototype.toDMS = function() {  // convert numeric degrees to deg/min/sec
    var d = Math.abs(this);  // (unsigned result ready for appending compass dir'n)
    d += 1 / 7200;  // add  second for rounding
    var deg = Math.floor(d);
    var min = Math.floor((d - deg) * 60);
    var sec = Math.floor((d - deg - min / 60) * 3600);
    // add leading zeros if required
    if (deg < 100) deg = '0' + deg; if (deg < 10) deg = '0' + deg;
    if (min < 10) min = '0' + min;
    if (sec < 10) sec = '0' + sec;
    return deg + '\u00B0' + min + '\u2032' + sec + '\u2033';
};

Number.prototype.toLat = function() {  // convert numeric degrees to deg/min/sec latitude
    return this.toDMS().slice(1) + (this < 0 ? 'S' : 'N');  // knock off initial '0' for lat!
}

Number.prototype.toLon = function() {  // convert numeric degrees to deg/min/sec longitude
    return this.toDMS() + (this > 0 ? 'E' : 'W');
}

Number.prototype.toPrecision = function(fig) {  // override toPrecision method with one which displays 
    if (this == 0) return 0;                      // trailing zeros in place of exponential notation
    var scale = Math.ceil(Math.log(this) * Math.LOG10E);
    var mult = Math.pow(10, fig - scale);
    return Math.round(this * mult) / mult;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */




function DeleteMarker(id) {

    for (var i = 0; i < m_.length; i++) {
        if (m_[i].id == id) {
            if (marker.setMap) {
                marker.setMap(null);
            }
            m_.splice(i, 1);
            return; 
        }
    }
    return false;
}







function findMarker(id) {
    var st;
    for (var i = 0; i < m_.length; i++) {
        st = m_[i].id;
        if (st === id) {
            return m_[i]; 
        }
    }
    return null;
}


function viewMarkerLink(id) {

    f_screen(false);
    var st;
    for (var i = 0; i < m_.length; i++) {
        st = m_[i].id;
        if (st === id) {

            if (gblMap.getZoom() < 15) {
                gblMap.setZoom(17);
            }

            gblMap.setCenter(m_[i].gCode);

            selectMarker(m_[i]);
            
            break ;
        }
    }
    return false;
}



function setListMarker(id) {

    var st;
    for (var i = 0; i < m_.length; i++) {
        st = m_[i].id;
        if (st === id) {

            if (gblMap.getZoom() < 8) {
                gblMap.setZoom(10);
            }

            gblMap.setCenter(m_[i].gCode);

            selectMarker(m_[i]);

            return true;
        }


    }
    return false;
}


function setHotelMarker(id) {
    var st;
    for (var i = 0; i < m_.length; i++) {
        st = m_[i].id;
        if (st === id) {

            if (gblMap.getZoom() < 15) {
                gblMap.setZoom(17);
            }

            gblMap.setCenter(m_[i].gCode);

            selectHotelMarker(m_[i]);
            setPointer(m_[i])
            doN();
            return true;
        }


    }
    doN();
    return false;
}


function setSelectedMarker(id) {

    var st;


    for (var i = 0; i < m_.length; i++) {
        st = m_[i].id;
        if (st === id) {

            if (gblMap.getZoom() < 15) {
                gblMap.setZoom(17);
            }

            gblMap.setCenter(m_[i].gCode);
            selectMarker(m_[i]);
            setPointer(m_[i])
            doN();
            return true;
        }


    }
    doN();
    return false;
}


function DAR(d, i) {
    this.md = d;
    this.id = i;
}





function ShowNearbyHotels(id) {
    closeInfo();
    var s = new Array();
    var currentMarker;
	currentMarker = findMarker(id);
    var dist;

    if (( currentMarker != null) && (currentMarker.LatLon)) {

        DoCSEventDistance(currentMarker.letter, currentMarker.title, currentMarker.lat, currentMarker.lng);
        
        for (var i = 1; i < m_.length; i++) {
            p = m_[i];
            if (p.id == i) {
                p.myDistance = 0;
                p.MyLocation = "";
            } else {
			    if ((p.gCode) && (p.gCode.lat)){
                dist = currentMarker.LatLon.getDistance(p.gCode.lat(), p.gCode.lng());
                p.myDistance = dist;
                p.MyLocation = currentMarker.cST;
				
                if (p.cS == "") {
                    s.push(new DAR(dist, i));
                }
				}
            }
        }

        var bounds = new google.maps.LatLngBounds();
        s.sort(function(a, b) { return a.md - b.md });

        for (var i = 1; i < s.length; i++) {
            p = s[i].id;
            bounds.extend(m_[p].gCode);
            if (i > 7) break;
        }
        bounds.extend(currentMarker.getPosition());
        gblMap.fitBounds(bounds);
        gblMap.setCenter(bounds.getCenter());

    }
}


function onClickMarker(theMarker) {
    selectMarker(theMarker);
}


function ondblclickMarker(theMarker) {

    var zoomLevel = gblMap.getZoom() + 2;
    gblMap.setCenter(theMarker.getPosition());
    gblMap.setZoom(zoomLevel);
    
}



function onmouseoverMarker(theMarker) {
    infoWindow.setContent(theMarker.cST);
    infoWindow.setPosition(theMarker.getPosition());
    infoWindow.open(gblMap);
    infoWindow.isOpen = true;
}


function ClipCopyText(text) {
    window.clipboardData.setData("Text", text);
}


var poi_ = null;

function setPointer(theMarker) {
    var poz = new google.maps.LatLng(parseFloat(theMarker.lat),
                                         parseFloat(theMarker.lng));
    var img = new google.maps.MarkerImage("./images/pointer.gif", new google.maps.Size(30, 9), new google.maps.Point(0, 0), new google.maps.Point(15, 20));
    if (poi_ == null) {
        poi_ = new google.maps.Marker({
            map: map,
            position: poz,

            icon: img
        });
        poi_.setZIndex(90);


        google.maps.event.addListener(poi_, 'rightclick', function (event) {

            google.maps.event.trigger(gblMap, 'rightclick', event);

        });        


    } else {
        poi_.setPosition(poz);
    }
}

function selectMarker(theMarker) {

    var info = "<table><tr><td class='items_nF_td' >";
    
        info += theMarker.cST;



        if (theMarker.m_distance) {
            info += "</td></tr><tr><td class='dist_c'>";
            info += "<table><tr><td class='dist_c'>";
            if (typeof (iCC) != "undefined") {
                info += "<b> " + theMarker.m_distance + "</b> km from Center of " + iCC.cST + "";
            }
            info += "</td></tr></table>";
        
       }

    if (theMarker.myDistance != 0) {
        info += "</td></tr><tr><td>";
        info += "<table><tr><td class='dist_c'>";
        info += "<b>" + theMarker.myDistance + " km</b> from " + theMarker.MyLocation;
        info += "</td></tr></table>";
    }


    info += "</td></tr><tr><td>";


    if (theMarker.Link) {
        if (theMarker.Link.length > 0) {
            info += "<table class='tab_footer' width=100%>";
            for (j = 0; j < theMarker.Link.length; j++) {
                info += "<tr class='items_footer_tr'><td class = 'items_footer_td' >";
                info += "<img src='./Images/ballon.png' />" + theMarker.Link[j];
                info += "</td></tr>";
                
            }
            info += "<tr><td class='dist_c'>"
            info += "<a href=JavaScript:ClipCopyText('" + theMarker.lat + "," + theMarker.lng + "')>"
            info += "<img src='./Images/tbic_copy.png' border=0 /></a>"
            info += theMarker.lat + "," + theMarker.lng;
            info += "</td></tr>";
            info += "</table>";
        }
    }

    info += "</td></tr></table>";
    infoWindowSelected.setContent(info);
    if (theMarker.gCode != null) {
        infoWindowSelected.setPosition(theMarker.gCode);
    } else {
       infoWindowSelected.setPosition(theMarker.getPosition());
    }
    infoWindowSelected.open(gblMap);
    infoWindowSelected.isOpen = true;
}



function onmouseoutMarker(theMarkerInfo) {
    closeInfo();
}

function MI_C(id, infoScreen, status ) {
   this.id = id;
    this.cS = "";
    this.m_distance = 0;

    this.myDistance = 0;
    this.MyLocation = "";
    this.info = null;
    this.gCode = null;
    this.lat = 0;
    this.lng = 0;    
    this.cST = infoScreen;
}







 function zoomIn() 
 {
     gblMap.zoomIn();
            contextmenu.style.visibility="hidden";
 }      
 function zoomOut() 
 {
     gblMap.zoomOut();
           contextmenu.style.visibility="hidden";
 }      
 function zoomInHere() 
 {
           var point = gblMap.fromContainerPixelToLatLng(clickedPixel)
           gblMap.zoomIn(point,true);
           contextmenu.style.visibility="hidden";
 }      
 function zoomOutHere() 
 {
          var point = gblMap.fromContainerPixelToLatLng(clickedPixel)
          gblMap.setCenter(point,gblMap.getZoom()-1); 
          contextmenu.style.visibility="hidden";
 }      
 function centreMapHere() 
 {
         var point = gblMap.fromContainerPixelToLatLng(clickedPixel)
         gblMap.setCenter(point);
         contextmenu.style.visibility="hidden";
 }


 function initDOM() {
     DOMReady = true;
 }

 function onGoogleAJAXAPILoad() {
     gblLoader.LoadNext();
 }

 function onGoogleSearchAPILoad() {
     GSearchAPIReady = true;
     if (GMapAPIReady) {
         gblLoader.LoadNext();
     }
 }

 function onGoogleMapAPILoad() {
     GMapAPIReady = true;
     if (GSearchAPIReady) {
         gblLoader.LoadNext();
     }
 }




 function initialize() {





     google.maps.Marker.prototype.MI = function MI(id, infoScreen, status) {
         this.id = id;
         this.cS = "";
         this.m_distance = 0;

         this.LatLon = null;
         this.myDistance = 0;
         this.lat = 0;
         this.lng = 0;
         this.MyLocation = "";
         this.info = null;
         this.gCode = null;
         this.cST = infoScreen;
         this.Link = new Array();

         this.geometryBounds = null;
     }




     google.maps.LatLng.prototype.destinationLatLng = function(bearing, dist) {
         var R = 6371;
         var toRad = Math.PI / 180;
         var lat1 = this.lat() * toRad;
         var lng1 = this.lng() * toRad;
         bearing = bearing * toRad;
         var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist / R) +
                        Math.cos(lat1) * Math.sin(dist / R) * Math.cos(bearing));
         var lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(dist / R) * Math.cos(lat1),
                               Math.cos(dist / R) - Math.sin(lat1) * Math.sin(lat2));
         lng2 = (lng2 + Math.PI) % (2 * Math.PI) - Math.PI;
         var pint = new google.maps.LatLng(lat2 / toRad, lng2 / toRad);
         return pint;
     }
     
     
 
 
 
 
     gblLoader = new Loader();
     onGoogleAJAXAPILoad();
 }


 function Loader() {
     this.onReady = false;
 }

Loader.prototype.LoadNext = function() {
     if (this.onReady) return;
     this.onReady = true;
     MainLoader();
 }





function MainLoader() {     
panelFind = new PanelFind();
directionsService = new google.maps.DirectionsService();
gRedIcon = new google.maps.MarkerImage("./images/mm_20_red.png", new google.maps.Size(12, 20), new google.maps.Point(0, 0), new google.maps.Point(6, 20));
gYellowIcon = new google.maps.MarkerImage("./images/mm_20_yellow.png", new google.maps.Size(12, 20), new google.maps.Point(0, 0), new google.maps.Point(6, 20));
gRedIcon = new google.maps.MarkerImage("./images/mm_20_red.png", new google.maps.Size(12, 20), new google.maps.Point(0, 0), new google.maps.Point(6, 20));
gSmallShadow = new google.maps.MarkerImage(      "./images/mm_20_shadow.png",      new google.maps.Size(22, 20),      new google.maps.Point(0, 0),      new google.maps.Point(6, 20));
gFindIcon = new google.maps.MarkerImage("./images/mm_20_find.png", new google.maps.Size(22, 20), new google.maps.Point(0, 0), new google.maps.Point(6, 20));





bounds = new google.maps.LatLngBounds();

bountsCity = new google.maps.LatLngBounds();
LocalSearch = new LocalSearch();
window.geocoder = new google.maps.Geocoder();
    var myOptions = {
        zoom: 4,
        center: new google.maps.LatLng('32.0667', '34.7667'),
        navigationControl: true,
 //       language: 'en',
        navigationControlOptions: { style: google.maps.NavigationControlStyle.ZOOM_PAN },
        mapTypeId: google.maps.MapTypeId.ROADMAP ,
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
    var d = document.getElementById("mapDiv");
    window.gblMap = new google.maps.Map(d, myOptions);
    window.map = gblMap;

   

    var maj = {visible:false}
     var rendererOptions = {markerOptions:maj}
     directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
     directionsDisplay.setMap(gblMap);


     var polyOptionsW = {
         strokeColor: '#4ca94c',
         strokeOpacity:0.8
     }

     var rendererOptions2 = { 
     markerOptions: maj,
     polylineOptions: polyOptionsW
     }
    directionsDisplayW = new google.maps.DirectionsRenderer(rendererOptions2);
    directionsDisplayW.setMap(gblMap);




    gblMap.enableKeyDragZoom();
    infoWindow = new google.maps.InfoWindow( {maxWidth:350,autoScroll:true });
    infoWindowSelected = new google.maps.InfoWindow({ maxWidth: 350, autoScroll: true });
    infoWindowSelected.isOpen = false;

    clusterTooltip = new ClusterTooltip();

    LocalSearch.Init()

        map = gblMap;

        google.maps.event.addListener(gblMap, "rightclick", function (event) {

            showContextMenu(event.latLng);
        
         });
        google.maps.event.addListener(gblMap, "click", function (event) {
            if ($('.contextmenu')) {
                $('.contextmenu').remove();
            }

            ;
        });
 


    panelFind.clear();


    sysCompleted();

}

function initEvents() {

}

function getCanvasXY(caurrentLatLng) {
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
         map.getBounds().getNorthEast().lat(),
         map.getBounds().getSouthWest().lng()
     );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
    var caurrentLatLngOffset = new google.maps.Point(
         Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
         Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
     );
    return caurrentLatLngOffset;
}
function setMenuXY(caurrentLatLng) {
    var mapWidth = $('#map').width();
    var mapHeight = $('#map').height();
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = getCanvasXY(caurrentLatLng);
    var x = clickedPosition.x - 6;
    var y = clickedPosition.y -6;

    if ((mapWidth - x) < menuWidth)
        x = x - menuWidth;
    if ((mapHeight - y) < menuHeight)
        y = y - menuHeight;

    $('.contextmenu').css('left', x);
    $('.contextmenu').css('top', y);
};




function SetStartMarker(Lat) {
    if (startMarker != null) {
        startMarker.setMap(null);
        startMarker = null;
    }
    startMarker = new google.maps.Marker({
        map: map,
        title: "Direction from Here",
        position: Lat,
        icon: "images/get_directions_start_big.png"
    });


    google.maps.event.addListener(startMarker, 'rightclick', function (event) {

        google.maps.event.trigger(gblMap, 'rightclick', event);

    });

    startMarker.setVisible(true);
    startMarker.setZIndex(10);
    $('.contextmenu').remove();
    calcRoute(Lat);
}


var startMarker = null;
var endMarker = null;
var poliLine = null;
var waitMarker = null;

var directionsDisplay = null;
var directionsDisplayW = null;

var directionDisplay = null;
var directionsService = null;


function calcRoute(latlng) {
    if ((startMarker == null) || (endMarker == null)) {
        directionsDisplay.setMap(null);
        directionsDisplayW.setMap(null);
        if (poliLine != null) {
            poliLine.setMap(null);
            poliLine = null;
        }
        return;

    }

    $('#GEOINFO')[0].innerHTML = '';
    $('#DRIVEINFO')[0].innerHTML = '';
    $('#DRIVEINFOTitle')[0].innerHTML = '';
    $('#WALKINFO')[0].innerHTML = '';
    $('#WALKINFOTitle')[0].innerHTML = '';


    if (waitMarker != null) {
        waitMarker.setMap(null);
        waitMarker = null;
    }

    waitMarker = new google.maps.Marker({
        map: map,
        title: "Wait",
        position: latlng,
        icon: "images/spinner.gif"
    });
    waitMarker.setVisible(true);
    waitMarker.setZIndex(10);


    var request = {
        origin: startMarker.position,
        destination: endMarker.position,
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: google.maps.DirectionsTravelMode["DRIVING"]
    };
    if (poliLine != null) {
        poliLine.setMap(null);
        poliLine = null;
    }
    directionsService.route(request, function (response, status) {
        waitMarker.setMap(null);
        waitMarker = null;
        if (status == google.maps.DirectionsStatus.OK) {
            var route = response.routes[0];

            var txtRoute = "";
            var steps = "";
            // For each route, display summary information.
            i = 0;

            txtRoute += route.legs[i].start_address + "\n to ";
            txtRoute += route.legs[i].end_address + "\n";
            txtRoute += route.legs[i].distance.text + "";


            var myRoute = route.legs[i];

            for (var i = 0; i < myRoute.steps.length; i++) {
                steps += '' + (i + 1) + ') ' + myRoute.steps[i].distance.text + ' ' + myRoute.steps[i].instructions + '|';
            }






            directionsDisplay.setMap(map);
            directionsDisplay.setDirections(response);
            startMarker.setTitle(txtRoute);
            endMarker.setTitle(txtRoute);
            $('#GEOINFO')[0].innerHTML = txtRoute;
            $('#DRIVEINFO')[0].innerHTML = steps;
            $('#DRIVEINFOTitle')[0].innerHTML = route.legs[0].distance.text;
            $('#WALKINFO')[0].innerHTML = '';

            var request2 = {
                origin: startMarker.position,
                destination: endMarker.position,
                travelMode: google.maps.DirectionsTravelMode["WALKING"]
            };


            waitMarker = new google.maps.Marker({
                map: map,
                title: "Wait",
                position: latlng,
                icon: "images/spinner.gif"
            });
            waitMarker.setVisible(true);
            waitMarker.setZIndex(10);



            directionsService.route(request2, function (response, status) {
                waitMarker.setMap(null);
                waitMarker = null;
                if (status == google.maps.DirectionsStatus.OK) {
                    var distanceW = response.routes[0].legs[0].distance.text;

                    var steps = '';
                    var myRoute = response.routes[0].legs[0];

                    for (var i = 0; i < myRoute.steps.length; i++) {
                        steps += '' + (i + 1) + ') ' + myRoute.steps[i].distance.text + ' ' + myRoute.steps[i].instructions + '|';
                    }


                    txtRoute += '\n Walking ( green line) :' + distanceW;
                    startMarker.setTitle(txtRoute);
                    endMarker.setTitle(txtRoute);
                    $('#GEOINFO')[0].innerHTML = txtRoute;
                    $('#WALKINFO')[0].innerHTML = steps;
                    $('#WALKINFOTitle')[0].innerHTML = distanceW;

                    directionsDisplayW.setMap(map);
                    directionsDisplayW.setDirections(response);



                }
            });

        } else {
            directionsDisplay.setMap(null);
            directionsDisplayW.setMap(null);
            var polyOptions = {
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3
            }

            poliLine = new google.maps.Polyline(polyOptions);
            poliLine.setMap(map);
            var path = poliLine.getPath();
            path.push(startMarker.position);
            path.push(endMarker.position);

            /*
            var p1 = new LatLon(new Number(startMarker.position.lat), new Number(startMarker.position.lng));
            var txt = p1.getDistance(new Number(endMarker.position.lat), new Number(endMarker.position.lng));
            startMarker.title = "Distance: " + txt + "km";
            endMarker.title = "Distance: " + txt + "km";
            */
        }
    });
}




function removeDistanceMarkers() {
    if (endMarker != null) {
        endMarker.setMap(null);
        endMarker = null;
    }

    if (startMarker != null) {
        startMarker.setMap(null);
        startMarker = null;
    }


    if (poliLine != null) {
            poliLine.setMap(null);
            poliLine = null;
    }



    if (waitMarker != null) {
        waitMarker.setMap(null);
        waitMarker = null;
    }


    directionsDisplay.setMap(null);
    directionsDisplayW.setMap(null);


    $('.contextmenu').remove();
}


function SetEndMarker(lat) {
    if (endMarker != null) {
        endMarker.setMap(null);
        endMarker = null;
    }





    endMarker = new google.maps.Marker({
        map: map,
        title: "Direction to Here",
        position: lat,
        icon: "images/get_directions_end_big.png"
    });

    google.maps.event.addListener(endMarker, 'rightclick', function (event) {

        google.maps.event.trigger(gblMap, 'rightclick', event);

    });

    endMarker.setVisible(true);
    endMarker.setZIndex(10);
    $('.contextmenu').remove();
    calcRoute(lat);


}




function showContextMenu(caurrentLatLng) {

    var contextmenuDir;

    $('.contextmenu').empty();
    $('.contextmenu').remove();
    contextmenuDir = document.createElement("div");
    contextmenuDir.className = 'contextmenu';
    var strMenu = "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"SetStartMarker(new google.maps.LatLng" + caurrentLatLng + ")\"><img src='images/get_directions_start.png'>&nbsp;Direction from Here</div>"
    strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"SetEndMarker(new google.maps.LatLng" + caurrentLatLng + ")\"><img src='images/get_directions_end.png'>&nbsp;Direction to Here</div>";

    strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"removeDistanceMarkers()\"><img src='images/btn.remove.gif'>&nbsp;Remove directions</div>";
    strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"map.setZoom(map.getZoom()+1);$('.contextmenu').remove();\" ><img src='images/zoom_in.png'>&nbsp;Zoom In</div>";
    strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"map.setZoom(map.getZoom()-1);$('.contextmenu').remove();\"><img src='images/zoom_out.png'>&nbsp;Zoom Out</div>";
    strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"setCenterPointerHere(new google.maps.LatLng" + caurrentLatLng + ");$('.contextmenu').remove();\"><img src='images/btn.point.png'>&nbsp;Center here</div>";

    if (gblCenterMarker != null) {
        strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"gblCenterMarker.showRegion();$('.contextmenu').remove();\"><img src='images/btn.show.region.png'>&nbsp;Show Region</div>";
   
        strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"gblCenterMarker.close();gblCenterMarker=null;$('.contextmenu').remove();\"><img src='images/btn.region.remove.gif'>&nbsp;Remove Region</div>";
    
    }
    strMenu += "<div class=context onmouseover='OnOver(this)' onmouseout='Out(this)' onclick=\"setCenterMarker2(this,new google.maps.LatLng" + caurrentLatLng + ");\"><img src='images/anchor.gif'>&nbsp;Show Region</div>";


   
    contextmenuDir.innerHTML = strMenu;
    $(gblMap.getDiv()).append(contextmenuDir);

    setMenuXY(caurrentLatLng);

    contextmenuDir.style.visibility = "visible";
    contextmenuDir.style.zIndex = 1000;
}

function setCenterPointerHere(latLng) {
    // SetDistanceFocus("Amsterdam~~52.370215999999~4.895168000000~ 0~");
    var str = "Your custom location~~" + latLng.lat() + "~" + latLng.lng() + "~" + "0~";
      SetDistanceFocus(str);
      DoCSEventDistance(" (*) ", "Your custom location", latLng.lat(), latLng.lng());
      if (gbl_centerIconMarker2) {
          gblMap.setCenter(gbl_centerIconMarker2.getPosition());
      }
  
}

function OnOver(Obj){
  Obj.style.backgroundColor = "#ffecb5";
}

function Out(Obj) {
    Obj.style.backgroundColor = "#d2d9e3";
}

function omMouseOverMap(e) {
}

function closeInfoSelected() {
    closeMapInfoWindow();
    if (infoWindowSelected.isOpen) {
        infoWindowSelected.close();
    }
}


function closeInfo() {
    closeMapInfoWindow();
    if (infoWindow.isOpen) {
        infoWindow.close();
    }
}

function SetCity(maddress) {
    var address = maddress.replace(/surrounding area/i, "")
    if (geocoder) {
        geocoder.geocode({ 'address': address, 'language': 'en' }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                bountsCity = new google.maps.LatLngBounds();
                bountsCity.extend(results[0].geometry.location);
                if (results[0].geometry.bounds) {
                    map.fitBounds(results[0].geometry.bounds);
                }
                map.setCenter(results[0].geometry.location);

                marker = new google.maps.Marker({
                    map: map,
                    title: results[0].formatted_address,
                    position: results[0].geometry.location,
                    icon: imageCityCenter
                });

                google.maps.event.addListener(marker, 'rightclick', function (event) {

                    google.maps.event.trigger(gblMap, 'rightclick', event);

                });

                marker.setVisible(true);
                marker.setZIndex(3);
                marker.gCode = results[0].geometry.location;

                marker.geometryBounds = results[0].geometry.bounds;
                var now = new Date();
                var ticks = now.getTime();
                marker.MI(address, null, null, null);
                marker.cST = "" + results[0].formatted_address;
                marker.lat = results[0].geometry.location.lat();
                marker.lng = results[0].geometry.location.lng();
                marker.LatLon = new LatLon(marker.lat, marker.lng);
                marker.letter = "Center";



                var link = "<a href=\"JavaScript:ShowNearbyHotels('0');\" >Show Nearby</a> " ;

                marker.Link[0] = link;

                m_.push(marker);
                marker.id = '0';


                iCC = marker;

                google.maps.event.addListener(marker, 'click', function(e) {
                    selectMarker(marker);
                    return e.returnValue;
                });

                map.setCenter(results[0].geometry.location);
            }


            bounds = new google.maps.LatLngBounds();
            setTimeout('CreateMarkerList()', 100);

        });
    }
}


function SetMarket() {
    setTimeout('SetMarketRun()', 0);
}





function create_panel_select(idTitle,searchList) {

    var el = document.getElementById("idTitle");

    el.innerHTML =  "Request: " + idTitle;

    for (var i = 0; i < searchList.length; i++) {
        var p = searchList[i];

    }
    f_screen(true);
}



function codeAddress(address) {

    if (setSelectedMarker(address)) {
        return;
    }


    if (geocoder) {
        geocoder.geocode({ 'address': address, 'language': 'en'  }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {


                map.setCenter(results[0].geometry.location);

                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: gFindIcon,
                    shadow: gSmallShadow
                });

                marker.setZIndex(10);

                google.maps.event.addListener(marker, 'rightclick', function (event) {

                    google.maps.event.trigger(gblMap, 'rightclick', event);

                });


                var info1 = "Query: " + address + "<br /> Result: " + results[0].formatted_address;

                if (typeof (iCC) != "undefined") {
                    if (iCC != null) {

 

                        var v2 = results[0].geometry.location.lat();
                        var v3 = results[0].geometry.location.lng();

                        var m_distance = iCC.LatLon.getDistance(v2, v3);

                        marker.m_distance = m_distance;

                    }
                }
                marker.lat = results[0].geometry.location.lat();
                marker.lng = results[0].geometry.location.lng();                
                marker.LatLon = new LatLon(marker.lat, marker.lng);
                marker.MI(address, info1, null, null);
                marker.cS = "1";
                m_.push(marker);

                setSelectedMarker(marker)


            } else {
                // alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}

function buildBound(center) {
    bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < m_.length; i++) {
        if (m_[i].position != null) {
            bounds.extend(m_[i].position);
        } else {
            bounds.extend(m_[i].latlng);
        }

    }
    if (m_.length > 0) {
        gblMap.fitBounds(bounds);
    } else { 
        gblMap.setCenter(center);
        gblMap.setZoom(11)
    }
 

}

function buildOptimalBound() {
    bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < m_.length; i++) {
        if (m_[i].position != null) {
            bounds.extend(m_[i].position);
        } else {
           bounds.extend(m_[i].latlng);
        }

   }


   if (gbl_centerIconMarker2) {
       bounds.extend(gbl_centerIconMarker2.position);
   }



   if (m_.length > 0) {
       gblMap.setCenter(bounds.getCenter());
       gblMap.fitBounds(bounds);

   } else {
        gblMap.setZoom(11);
    }
    doN();
}

function ClearMarkers() {
    var new_m_ = new Array();
    if (poi_) {
        poi_.setMap(null);

    }
    poi_ = null

    if (waitMarker != null) {
        waitMarker.setMap(null);
        waitMarker = null;
    }

    if (startMarker != null) {
        startMarker.setMap(null);
        startMarker = null;
    }
    if (endMarker != null) {
        endMarker.setMap(null);
        endMarker = null;
    }

    directionsDisplay.setMap(null);

    for (var i = 0; i < m_.length; i++) {

        if (m_[i].cS.length == 0) {
            new_m_.push(m_[i]);
        } else {
        if (m_[i].setMap) {
            m_[i].setMap(null);
        }
        }
    }
    m_ = new_m_;
    doN();

}


function ClearFilterMarkers() {
    var new_m_ = new Array();
    for (var i = 0; i < m_.length; i++) {
        if (m_[i].cS.length > 0) {
            new_m_.push(m_[i]);
        } else {
        if (m_[i].setMap) {
            m_[i].setMap(null);
        }
        }
    }
    m_ = new_m_;
    doN();
}


function ClearAllMarkers() {
    for (var i = 0; i < m_.length; i++) {
        if (m_[i].setMap) {  
        m_[i].setMap(null);
        }
    }
m_ = new Array();
if (gCluster) {
    gCluster.clear();
}


if (poi_) {
    poi_.setMap(null);
    poi_ = null;
}



    doN();

}


var gblCenterMarker = null;

var  gbl_centerIconMarker2 = null;

function SetDistanceFocus(strDistanceLocation) {

    var buildBound = true;
    var currentPosition = null;

    if (gblCenterMarker != null) {
        currentPosition = gblCenterMarker.position;
        gblCenterMarker.close();
        gblCenterMarker = null;
        buildBound = false;
    }
    var arrLocation = strDistanceLocation.split("~");
    if (arrLocation.length < 4) {return;}
    var distanseKM = parseInt(arrLocation[4]);

    var pointMarker = new google.maps.LatLng(parseFloat(arrLocation[2]), parseFloat(arrLocation[3]));

    if (gbl_centerIconMarker2) {
        gbl_centerIconMarker2.setMap(null);
     }

    if (distanseKM > 0) {


              gblCenterMarker = new DistanceWidget(gblMap, pointMarker, arrLocation[0], distanseKM);
              gblCenterMarker.showFullRegion();
          } else {
              var centerIcon = new google.maps.MarkerImage("./images/centerGeo.png", new google.maps.Size(20, 34), new google.maps.Point(0, 0), new google.maps.Point(8, 32));

              var poz = null;
	          poz = new google.maps.LatLng(parseFloat(arrLocation[2]),
                                         parseFloat(arrLocation[3]));


              gbl_centerIconMarker2 = new google.maps.Marker({
                  draggable: false,
                  map: map,
                   position: poz,
                  title: arrLocation[0],
                  icon: centerIcon
              });

              gbl_centerIconMarker2.setVisible(true);


              google.maps.event.addListener(gbl_centerIconMarker2, 'rightclick', function (event) {

                  google.maps.event.trigger(gblMap, 'rightclick', event);

              });


              if ((currentPosition== null) || (poz.toString() != currentPosition.toString())) {
                  buildOptimalBound();
              }
          }


}


function SetDistancePoints(strDistanceLocation) {
    var arrLocation = strDistanceLocation.split("~");
    var PointIcon = new google.maps.MarkerImage("./images/point9x9.png", new google.maps.Size(9, 9), new google.maps.Point(0, 0), new google.maps.Point(0, 0));
    for (ipp = 0; ipp < arrLocation.length; ipp = ipp + 4) {
        var pointMarker = new google.maps.LatLng(parseFloat(arrLocation[ipp + 2]), parseFloat(arrLocation[ipp + 3]));

        var t_Marker = new google.maps.Marker({
            map: gblMap,
            title: arrLocation[ipp],
            position: pointMarker,
            icon: PointIcon
        });

        t_Marker.setZIndex(10);

        google.maps.event.addListener(t_Marker, 'rightclick', function (event) {

            google.maps.event.trigger(gblMap, 'rightclick', event);

        });



    }
}



function SetMarkersGeocode(strGeocods) {
    ShowLoading(true);
    MList("");
    ClearAllMarkers();
     MList(strGeocods);
     SetCity(m_strCityInfo[0]);
    }


    var s_bounds;


    function CreateMarkerList(arg) {
        var marker;
        var gCode;
        var info;
        var startPos = 1;
        if (arg) {
            startPos = arg;
            s_bounds = gblMap.getBounds();
        } else {
           s_bounds = gblMap.getBounds();
        }

        if (!MarkList) return;

        var t_JobCount = 0;


        for (var next = startPos; next < MarkList.length; next++) {

            if (t_JobCount > 800) {
                    setTimeout('CreateMarkerList(' + next + ')', 100);
                    return true;
            }

            t_JobCount++;
            
            info = MarkList[next].split("~");

            gCode = new google.maps.LatLng(parseFloat(info[1]), parseFloat(info[2]))


            var m_distance = 0;
            if (typeof (iCC) != "undefined") {
                m_distance = iCC.LatLon.getDistance(gCode.lat(), gCode.lng());
            }

            if (m_distance < 200) {


                marker = new MI_C(info[0], info[3], info[5]);


                marker.myIcon = gRedIcon;
                marker.cS = "";


                marker.lat = gCode.lat();
                marker.lng = gCode.lng();
                marker.latlng = gCode;





                marker.gCode = gCode;
                marker.m_distance = m_distance;
                marker.info = info;


                if (info[5] != "True") {
                    marker.myIcon = "./images/mm_20_noactive.png";
                }


                s_bounds.extend(gCode);


                start = false;
                m_.push(marker);
            }


        }
      //  map.fitBounds(s_bounds);
      //  map.setCenter(s_bounds.getCenter());
        buildOptimalBound();
        ShowLoading(false);
        SetAllMarkerAsVisible();
        doN();
    }


function MList(newVal) {
    if (typeof (newVal) == "string") {
        if (newVal.length == 0) {
            MarkList = new Array();
            this.nexIndex = -1;
        } else {
            start = true;
            MarkList = newVal.split("|");;
            this.nexIndex = 1;
            mapStore = null;
            m_strCityInfo = MarkList[0].split("~");;
            ShowLoading(true);
        }
    } else {
        if (this.nexIndex < 0) {
            return null;
        }

        if (!MarkList) return null;
        if (this.nexIndex >= MarkList.length) {
            buildOptimalBound();
            return null;
        }

        if (this.nexIndex >= MarkList.length) {
      
            this.nexIndex = -1;
            return null;
        }
        var ret = nexIndex;
        nexIndex++;

        return ret;

    }
}












function SetMarketRun() {

        var marker;
        var next = MList();
        if (next == null) {
            
            map.fitBounds(bounds);
            map.setCenter(bounds.getCenter());
            SetAllMarkerAsVisible();
            OperationCompleted();
            buildOptimalBound();

        } else {

            var info = MarkList[next].split("~");

            var gCode = new google.maps.LatLng(parseFloat(info[1]), parseFloat(info[2]))

            var m_distance = 0;
            if (typeof (iCC) != "undefined") {
                m_distance = iCC.LatLon.getDistance(gCode.lat(), gCode.lng());
            }

            if (m_distance < 200) {


                marker = new MI_C(info[0], info[3], info[5]);


                marker.myIcon = gRedIcon;
                marker.cS = "";


                marker.lat = gCode.lat();
                marker.lng = gCode.lng();
                marker.latlng = gCode;





                marker.gCode = gCode;
                marker.m_distance = m_distance;
                marker.info = info;


                if (info[5] != "True") {
                     marker.myIcon = "./images/mm_20_noactive.png";
                }


                bounds.extend(gCode);


                start = false;
                m_.push(marker);
            }
            SetMarket();
        }


}


Array.prototype.findFirst = function(searchStr) {
    var returnArray = false;
    for (i = 0; i < this.length; i++) {
        if (typeof (searchStr) == 'function') {
            if (searchStr.test(this[i])) {
                if (!returnArray) { returnArray = [] }
                returnArray.push(i);
                return returnArray;
            }
        } else {
            if (this[i] === searchStr) {
                if (!returnArray) { returnArray = [] }
                returnArray.push(i);
                return returnArray;
            }
        }
    }
    return returnArray;
}






function setFilterMarker(strShowList) {
    do_wait_start();
    setTimeout('setFilterMarkerJob("' + strShowList + '")', 50);
}



function setFilterMarkerJob(strShowList) {
    var ListShow = null;
    ListShow = strShowList.split(',');
    selBounds = new google.maps.LatLngBounds();
    for (var i = 0; i < m_.length; i++) {
        if ((iCC == m_[i]) || (m_[i].cS.length != 0) ) {
            selBounds.extend(m_[i].position);
        } else if (ListShow.findFirst(m_[i].id) === false) {
           m_[i].visible=false;            
        } else {
            selBounds.extend(m_[i].position);
            m_[i].visible=true;           
        }

    }
    map.setCenter(selBounds.getCenter());
    map.fitBounds(selBounds);
    doN();
}



function SetAllMarkerAsVisible() {

    if (clasterListner != null ) {
       google.maps.event.removeListener(clasterListner); 
    }
    gCluster = new GCluster(gblMap);
    
	clasterListner = google.maps.event.addListener(map, "tilesloaded",
		   function ()
		   {
			  gCluster.clear();
			  gCluster.addItems(m_);
		   });

 			//  gCluster.clear();
 			//  gCluster.addItems(m_);
 			  ShowLoading(false);
    doN();
    
}







function getClientWidth() {
    
    return $(window).width();
}
function getClientHeight() {

    
    return $(window).height();
}


function doFire(objID) {

    var evObj = document.createEventObject("onclick");


    document.all(objID).fireEvent("onclick", evObj);
    evObj.cancelBubble = false;
}


function sysCompleted() {
    document.getElementById("idStatusLine").innerText = "OK";  
}


function OperationCompleted(){
    var el = document.getElementById( "Operation");
    el.innerText = "OperationCompleted";  
    doN("DCC");
}

function DoCSEventDistance(letter,cST, lat, lng){
    var el = document.getElementById( "OperationDCC");
    el.innerText = "Distance|" + lat + "|" + lng  +"|" + letter + "|" +  cST;
    doFire("DCC");
}


function SetRecordLine(line){
    var el = document.getElementById( "Operation");
    el.innerText = "SetRecordLine=" + line ;
    doFire("DCC");
}
function doN() {
    doFire("dN");
}

function ShowLoading(track) {
    if (track) {
        var waitdiv = document.getElementById("idWait");
        waitdiv.className = "div_load_on";
        var Tmap = document.getElementById("mapDiv");
        waitdiv.style.width = "" + Tmap.clientWidth  + "px";
        waitdiv.style.height = "" + Tmap.clientHeight + "px";
 //       waitdiv.style.zIndex = 10;
        var img = document.getElementById("loading_img");
        img.style.top = Tmap.clientHeight / 2 - 20;
        img.style.left = Tmap.clientWidth / 2 - 20;
        
        
    } else {
      document.getElementById("idWait").className = "div_load_off";    
    }
}


function closeMapInfoWindow() {
    var infoWindowSpanTop = document.getElementById("MapInfoWindow");
    infoWindowSpanTop.style.display = 'block';
    infoWindowSpanTop.style.visibility = 'hidden';
        var infoWindowSpanTop2 = document.getElementById("MapInfoWindowB");
    infoWindowSpanTop2.style.display = 'block';
    infoWindowSpanTop2.style.visibility = 'hidden';

    var infoWindowSpanTop3 = document.getElementById("MapInfoWindow2");
    infoWindowSpanTop3.style.display = 'block';
    infoWindowSpanTop3.style.visibility = 'hidden';
    
    var infoWindowSpanTop4 = document.getElementById("MapInfoWindowB2");
    infoWindowSpanTop4.style.display = 'block';
    infoWindowSpanTop4.style.visibility = 'hidden';    
}


function gblCheckInfoFindow(e) {
    closeInfo();
    clusterTooltip.hide();
    closeInfoSelected();
    closeMapInfoWindow();
}



        


 


