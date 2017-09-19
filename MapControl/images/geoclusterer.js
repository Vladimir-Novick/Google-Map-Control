/**
*
* @version 1.0
* @author: Vladimir Novick    http://www.linkedin.com/in/vladimirnovick
*
*  Public Profile :   http://il.linkedin.com/in/vladimirnovick
*
*/




function PHelper(m) {
    this.setMap(m);
}
PHelper.prototype = new google.maps.OverlayView();
PHelper.prototype.draw = function () {
    if (!this.ready) {
        this.ready = true;
        google.maps.event.trigger(this, 'ready');
    }
};


function GCluster(m) {

    var clusters_ = [];
    var map_ = m;
    var maxZoom_ = null;
    var me_ = this;
    var gridSize_ = GGris_S;
    var leftItems_ = [];
    var mcfn_ = null;
    var pHelper_ = new PHelper(m);
    var maxZoomLavel = 19;
    var projection;


    closeInfo();

    this.getItem = function (id) {
        return clusters_[id];
    }

    /**
    * addItem.
    */
    this.addItem = function (item) {
        if (!item.latlng) return;
        if (!isItemInViewport_(item)) {
            //leftItems_.push(item);
            return;
        }

        var pos = this.projection.fromLatLngToDivPixel(item.latlng);
        var length_ = clusters_.length;
        var cluster = null;


        for (var i = length_ - 1; i >= 0; i--) {
            cluster = clusters_[i];

            var ptCenter = cluster.getPointerCenter();
            if (ptCenter === null) {
                continue;
            }

            if (pos.x >= ptCenter.x - gridSize_ && pos.x <= ptCenter.x + gridSize_ &&
							pos.y >= ptCenter.y - gridSize_ && pos.y <= ptCenter.y + gridSize_) {
                cluster.addItem(item);
                item.clusterID = cluster.id;

                return;
            }
        }

        createCluster(item, this.projection);
    };


    function createCluster(item, projection) {
        cluster = new Cluster(me_, gblMap, projection);
        cluster.id = clusters_.length - 1;
        clusters_.push(cluster);
        item.clusterID = cluster.id;
        cluster.addItem(item);



    }




    this.CreateNewCluster = function (item) {
        cluster = new Cluster(me_, gblMap);

        item.clusterID = cluster.id;
        clusters_.push(cluster);
        cluster.addItem(item);
    }


    this.getClusters = function () {
        return clusters_;
    }

    this.calculateDirection = function (myCenter) {
        var centerItem;
        for (var i = 0; i < clusters_.length; ++i) {
            centerItem = clusters_[i].getCenter();
            clusters_[i].destClusterID = myCenter.id;
        }
    }

    this.redraw_ = function () {
        closeInfo();
        for (var i = 0; i < clusters_.length; ++i) {
            clusters_[i].redraw_(true);
        }
    };


    this.checkMinCount = function () {
        for (var i = clusters_.length - 1; i > 0; i--) {
            if (clusters_[i].getItemSize() < Min_Items) {
                clusters_[i].unpuck_();
            }
        }
    };




    this.getProjectionHelper = function () {
        return pHelper_;
    };


    this.getClustersInViewport_ = function () {
        var clusters = [];
        var curBounds = gblMap.getBounds();
        for (var i = 0; i < clusters_.length; i++) {
            if (clusters_[i].isInBounds(curBounds)) {
                clusters.push(clusters_[i]);
            }
        }
        return clusters;
    };


    function addleftItems_() {
        if (leftItems_.length === 0) {
            return;
        }
        var leftItems = leftItems_.slice(0);
        leftItems_.length = 0;
        for (i = 0; i < leftItems.length; ++i) {
            me_.addItem(leftItems[i]);
        }
    }


    function reAddItems_(items) {
        var len = items.length;
        for (var i = len - 1; i >= 0; --i) {
            me_.addItem(items[i]);
        }
        addleftItems_();
    }

    this.clear = function () {
        for (var i = 0; i < clusters_.length; ++i) {
            if (typeof clusters_[i] !== "undefined" && clusters_[i] !== null) {
                clusters_[i].clear();
            }
        }
        clusters_ = [];
        leftItems_ = [];
        if (mcfn_) {
            google.maps.event.removeListener(mcfn_);
            mcfn_ = null;
        }
    };


    this.addItems = function (items) {

        this.projection = pHelper_.getProjection();
        for (var i = 0; i < items.length; ++i) {
            this.addItem(items[i]);
        }

        this.redraw_();
        mcfn_ = google.maps.event.addListener(gblMap, "bounds_changed", function () {
            me_.resetViewport();
            ResCPi();
        });
    };


    function isItemInViewport_(item) {
        return gblMap.getBounds().contains(item.latlng);
    }


    this.getGridSize_ = function () {
        return gridSize_;
    };


    this.resetViewport = function () {
        var clusters = this.getClustersInViewport_();
        var tmpItems = [];
        var removed = 0;
        for (var i = 0; i < clusters.length; ++i) {
            var cluster = clusters[i];
            var oldZoom = cluster.getCurrentZoom();
            if (oldZoom === null) {
                continue;
            }
            var curZoom = gblMap.getZoom();
            if (curZoom !== oldZoom) {


                var citms = cluster.getItems();
                for (j = 0; j < citms.length; ++j) {
                    tmpItems.push(citms[j]);
                }
                cluster.clear();
                removed++;
                for (j = 0; j < clusters_.length; ++j) {
                    if (cluster === clusters_[j]) {
                        clusters_.splice(j, 1);
                    }
                }
            }
        }

        reAddItems_(tmpItems);
        this.redraw_();
    };

    this.onClickMarker = function (cluster) {
    };

}


function Cluster(gCl, m, m_projection) {
    var center_ = null;
    var items_ = [];


    this.projection = m_projection;
    var clusterMarker_ = null;
    var zoom_ = gblMap.getZoom();
    var ptCenter = null;

    this.getItems = function () {
        return items_;
    };



    this.getPointerCenter = function () {
        return this.ptCenter;
    }

    this.unpuck_ = function () {

        while (this.getItemSize() > 1) {
            t_item = items_.pop();
            gCluster.CreateNewCluster(t_item);
        }
    }


    this.getDivXY = function () {
        var ph = gCluster.getProjectionHelper();
        var projection = ph.getProjection();
        var centerxy = projection.fromLatLngToDivPixel(center_);
        return centerxy;
    }


    this.isInBounds = function (bounds) {
        if (center_ === null) {
            return false;
        }
        if (!bounds) {
            bounds = gblMap.getBounds();
        }
        var ph = gCluster.getProjectionHelper();
        var projection = ph.getProjection();
        var sw = projection.fromLatLngToDivPixel(bounds.getSouthWest());
        var ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());
        var mapcenter = gblMap.getCenter();
        var centerxy = projection.fromLatLngToDivPixel(center_);
        this.xy = centerxy;
        var inViewport = true;
        var gridSize = gCluster.getGridSize_();
        if (zoom_ !== gblMap.getZoom()) {
            var dl = gblMap.getZoom() - zoom_;
            gridSize = Math.pow(2, dl) * gridSize;
        }
        if (ne.x !== sw.x && (centerxy.x + gridSize < sw.x || centerxy.x - gridSize > ne.x)) {
            inViewport = false;
        }
        if (inViewport && (centerxy.y + gridSize < ne.y || centerxy.y - gridSize > sw.y)) {
            inViewport = false;
        }
        return inViewport;
    };

    /**
    * Get cluster center.
    */
    this.getCenter = function () {
        return center_;
    };

    this.getXY = function () {
        return this.xy;
    };

    /**
    * Add a marker.
    */
    this.addItem = function (item) {
        if (center_ === null) {
            center_ = item.latlng;
            this.ptCenter = this.projection.fromLatLngToDivPixel(center_);
        }
        items_.push(item);
    };




    /**
    * Get current zoom level of this cluster.
    */
    this.getCurrentZoom = function () {
        return zoom_;
    };

    this.redraw_ = function () {
        if (!this.isInBounds()) {
            return;
        }
        if (clusterMarker_ == null) {
            clusterMarker_ = new ClMarker_(gblMap, this, gCluster.onClickMarker);
        }
    }

    /**
    * Remove all the markers from this cluster.
    */
    this.clear = function () {
        if (clusterMarker_ !== null) {
            if (clusterMarker_.setMap) {
                clusterMarker_.setMap(null);
                clusterMarker_ = null;
            }
        }
        items_ = [];
    };

    /**
    * Get number of markers.
    */
    this.getItemSize = function () {
        return items_.length;
    };
}

/**
* ClMarker_ creates a marker that shows the number of markers that
*/
function ClMarker_(m, cluster, clickCallback) {
    this.cluster_ = cluster;
    this.latlng_ = cluster.getCenter();
    var count = cluster.getItemSize();
    var curL = gblMap.getZoom();
    this.count_ = count;
    if ((count == 1) || (curL >= 19)) {
        if (count == 1) {
            var infoL = cluster.getItems()[0].info[5];
            if (infoL == "2") {
                this.icon_ = "./images/mm_20_noactive.png";
            } else if (infoL == "1") {
                this.icon_ = "./images/mm_20_delta.png";
            } else {
                this.icon_ = "./images/mm_20_red.png";
            }
        } else {
            this.icon_ = "./images/mm_20_red.png";
        }
        this.width_ = 12;
        this.height_ = 20;



    } else {
        if (count <= 10) {
            this.icon_ = "./images/m1r.gif";
            this.width_ = 20;
            this.height_ = 20;
        } else {
            this.icon_ = "./images/m1r.gif";
            this.width_ = 20;
            this.height_ = 20;
        }


    }




    this.clickCallback_ = clickCallback;
    this.setMap(m);
}



ClMarker_.prototype = new google.maps.OverlayView();



ClMarker_.prototype.getPos = function () {
    this.projection_ = this.getProjection();
    this.pos = this.projection_.fromLatLngToDivPixel(this.latlng_);
    this.pos.x -= parseInt(this.width_ / 2, 10);
    this.pos.y -= parseInt(this.height_ / 2, 10);
    return this.pos;
}


ClMarker_.prototype.draw = function () {
    this.getPos();
    this.div_.style.left = this.pos.x + "px";
    this.div_.style.top = this.pos.y + "px";
    var txtColor = 'white';

    var m_newStyle = '';




    this.div_.style.height = this.height_ + 'px';

    this.div_.style.width = this.width_ + 'px';
    this.div_.style.textAlign = 'center';
    this.div_.style.backgroundImage = "url(" + this.icon_ + ")";
    this.div_.style.lineHeight = this.height_ + 'px';


    if (this.count_ != 1) {
        this.div_.innerHTML = "&nbsp;" + this.count_ + "&nbsp;";
    } else {
        this.div_.innerHTML = "&nbsp;&nbsp;&nbsp;";
    }

    this.getPanes().overlayShadow.appendChild(this.div_);
    this.div_.style.zIndex = 100;

    var cluster = this.cluster_;


    google.maps.event.addDomListener(this.div_, "dblclick", function () {
        ShowCluster(cluster);
    });




    google.maps.event.addDomListener(this.div_, "click", function (e) {
        OnClickCluster(e, cluster);
    });








    google.maps.event.addDomListener(this.div_, 'mouseover', function (e) {
        clusterTooltip.show(e, cluster);
    });

    google.maps.event.addDomListener(this.div_, 'mouseout', function () {
        clusterTooltip.hide();
    });



};

ClMarker_.prototype.onAdd = function () {
    if (this.div_ == null) {
        var div = document.createElement("div");
        div.style.visibility = 'visible';
        div.style.position = "absolute";
        div.style.height = GGris_S + "px";
        div.style.width = GGris_S + "px";
        div.style.fontFamily = "Verdana";
        div.style.fontSize = "8px";
        div.style.cursor = "pointer";
        div.style.color = "white";
        div.style.zOrder = 100;
        this.div_ = div;
        var cluster = this.cluster_;
        var callback = this.clickCallback_;
        cluster.div = div;
        this.div_onclick = this.clickCallback_;
    }





};

ClMarker_.prototype.remove = function () {
    this.div_.parentNode.removeChild(this.div_);
};




function ClusterTooltip() {
    this.isOpen = false;

    this.div = document.getElementById("DivTooltip");

}



ClusterTooltip.prototype.show = function (e, cluster) {
    var context = "<table border=1 ><tr><td nowrap class='ttipc'> ";
    var curL = gblMap.getZoom();

    if ((cluster.getItemSize() == 1) || (curL >= 19)) {
        context += "Hotel: " + cluster.getItems()[0].cST;
        for (var p = 1; p < cluster.getItemSize(); p++) {
            context += "<br />" + cluster.getItems()[p].cST;
        }
    } else {
        context += "<b> Total items :" + cluster.getItemSize() + "</b>";
    }
    this.div.className = "Tooltip_on";
    this.div.innerHTML = context + "</td></tr></table>";
    this.div.style.opacity = 90;

    var p = this.getElementPosition(e.srcElement);
    this.div.style.left = (p.left + 20) + "px";
    this.div.style.top = (p.top + 20) + "px";

}

ClusterTooltip.prototype.hide = function () {
    this.div.className = "Tooltip_off";
    this.div.style.opacity = 90;
}

ClusterTooltip.prototype.getElementPosition = function (h) {
    var posX = h.offsetLeft;
    var posY = h.offsetTop;
    var parent = h.offsetParent;

    while (parent !== null) {







        if (parent !== document.body && parent !== document.documentElement) {
            posX -= parent.scrollLeft;
            posY -= parent.scrollTop;
        }
        posX += parent.offsetLeft;
        posY += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return {
        left: posX,
        top: posY
    };
};

function OnMouseOverCluster(cluster) {
}


function ShowClusterByID(id) {
    var cluster = gCluster.getItem(id);
    ShowCluster(cluster);
}

function ShowCluster(cluster) {
    closeInfo();
    if (typeof (cluster) == "undefined") { return; }
    if (cluster.getItemSize() != 1) {


        bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < cluster.getItemSize(); i++) {
            bounds.extend(cluster.getItems()[i].gCode);
        }
        gblMap.fitBounds(bounds);
        gblMap.setCenter(bounds.getCenter());

    }

}


function OnMouseOutCluster(cluster) {
    closeInfo();
}

function insStar(v1) {
    var v = v1;

    v = v.replace(/(.*)\( *([1-5])[ ]?[Ss][Tt][Aa][Rr][Ss]? *\)/, "<img src='./images/star$2.png' > $1");
    v = v.replace(/(.*)\( *([1-5])[ ]?[Ss][Tt][Aa][Rr][Ss]?[ ]?\+[ ]*\)/, "<img src='./images/star$2p.png' > $1");
    v = v.replace(/(.*)\( *([1-5])\.5[ ]*\)/, "<img src='./images/star$2p.png' > $1");
    v = v.replace(/(.*)\( *([1-5])[ ]?\*? ?\+ *\)/, "<img src='./images/star$2p.png' > $1");
    v = v.replace(/(.*)\( *([1-5])\.5 ?\*? *\)/, "<img src='./images/star$2p.png' > $1");
    v = v.replace(/(.*) *([1-5])\* *(\))/, "<img src='./images/star$2.png' > $1$3");
    v = v.replace(/(.*)\( *([1-5])[ ]?\*? *\)/, "<img src='./images/star$2.png' > $1");
    if (v.indexOf(".png") < 0) {
        v = "<img src='./images/star0.png' >" + v;
    }
    return v;
}

function ShowActiveCheck(obj) {
    obj.src = "./Images/checkOn.png";
}
function ShowPassiveCheck(obj) {
    obj.src = "./Images/check.png";
}

function BookF(a1, a2) {
    var el = document.getElementById("OperationDCC");
    el.innerText = "Book|" + a1 + "|" + a2;
    doFire("DCC")
}



function getScreenHeight() {
    var viewportwidth;
    var viewportheight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

    else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
    }

    // older versions of IE

    else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }
    return viewportheight;
}



function OnClickCluster(e, cluster) {

    if (cluster.getItemSize() == 1) {
        SetRecordLine(cluster.getItems()[0].id);
    }
    var curL = gblMap.getZoom();

    var m_context = "<table class='mouse_items_list' with=100%>";
    m_context += "<tr><td>";
    if (cluster.getItemSize() > 2) {
        m_context += "<div class='overTab'>";
    } else {
        m_context += "<div>";
    }
    m_context += "<table with=100%>";
    var items_ = cluster.getItems();
    var showDistance = false;
    var lineClass;
    var tempTitleLine;
    var i = 0;
    for (var pk = 0; pk < cluster.getItemSize(); pk++) {
        i = pk;
        if ((i % 2) == 1) {
            lineClass = "items_L1";
        } else {
            lineClass = "items_L0";
        }



         m_context += "<tr class='" + lineClass + "_tr' ><td class = '" + lineClass + "_td' >";




         m_context += "<table>";



        m_context += "<tr class='" + lineClass + "_tr' >";
        m_context += "<td colspan=3 class='" + lineClass + "_td' >";
        m_context += insStar(items_[i].cST);
        m_context += "</td></tr>";

        var t = items_[pk].info[4].split('^');
        var tp;

        for (i1 = 1; i1 < t.length; i1 = i1 + 3) {

            m_context += "<tr >";
            m_context += "<td class = PMtd nowrap >";
            m_context += "<a class = PMtd  href=\"javascript:";
            m_context += "BookF(" + t[i1 + 1] + "," + items_[i].id + ")";
            m_context += "\" title=\"Book\" >";
            m_context += t[i1];
            m_context += "</a></td>";
            m_context += "<td class = PZtd >";
            tp = t[i1 + 2];
            if (tp.substring(0, 1) === '+') {
                  m_context += "<a href=\"javascript:";
                  m_context += "BookF(" + t[i1 + 1] + "," + items_[i].id + ")";
                  m_context += "\" title=\"Book\" >";
                  m_context += "<img class = PZtd border= 0 src='./Images/";
                  m_context += "check.png' ";
                  m_context += " onmouseover='ShowActiveCheck(this)' onmouseout='ShowPassiveCheck(this)' ";
                  m_context += " /></a>";
            } else {
                  m_context += "<img class = PZtd border= 0 width=16px src='./Images/";
                  m_context += "uncheck.png";
                  m_context += "' />";
           }
           m_context += "</td>";
           m_context += "<td class = PZtd >";
           m_context += tp.substring(1);
           m_context += "</td>";

           m_context += "</tr>";
       }

       m_context += "<tr><td colspan=3 class=dis_text>";
      if (typeof (iCC) != 'undefined') {
            m_context += "Distance :";
            m_context += " <b>" + items_[0].m_distance + " km </b>";
            showDistance = true;
      }

      if (items_[0].myDistance != 0) {
        m_context += " Location: " + items_[0].MyLocation + "";
    }
      m_context += "</td></tr>";
      m_context += "</table>";
      m_context += "</td></tr>";
    }


    m_context += "</table>";

    m_context += "</div>";
    m_context += "</td>";
    m_context += "</tr><tr class='items_footer_tr' ><td  class = 'items_footer_td' >";
    m_context += " <b> Total items :" + cluster.getItemSize() + "</b></td></tr>";

    if ((cluster.getItemSize() > 1) && (curL < 19)) {
        m_context += "<tr><td class='items_footer_td'  ><a href='javascript:ShowClusterByID(";
        m_context += cluster.id;
        m_context += ");' class='open_link' >Click here to open this region</a></td></tr>";
    }


    if (showDistance) {
        m_context += "<tr><td class=dis_text>";
        m_context += "Distance from: " + iCC.cST ;
        m_context += "</td></tr>";
    }

     
    m_context += "</table>";
    var isBottom = true;


    var ptCenter = GetElementDivPosition(e.srcElement);
    if (ptCenter === null) {
        return;
    }



    var wP = ptCenter.y;
    var LeftPos = document.body.offsetWidth / 2 > ptCenter.x;

    if (document.body.offsetHeight / 2 > wP) {

        var contextSpan;
        var infoWindowSpan;
        if (LeftPos) {
            contextSpan = document.getElementById("MapInfoContext");
            infoWindowSpan = document.getElementById("MapInfoWindow");
        } else {
            contextSpan = document.getElementById("MapInfoContext2");
            infoWindowSpan = document.getElementById("MapInfoWindow2");
        }
        contextSpan.innerHTML = m_context;




        var divM;
        var divW;

        if (LeftPos) {
            divM = document.getElementById('MapInfoWindow').offsetHeight;
            divW = document.getElementById('MapInfoWindow').offsetWidth;

            infoWindowSpan.style.top = ptCenter.y + 10;
            infoWindowSpan.style.left = ptCenter.x - 26;
            infoWindowSpan.style.display = 'block';
            infoWindowSpan.style.visibility = "visible";


        } else {
            divM = document.getElementById('MapInfoWindow2').offsetHeight;
            divW = document.getElementById('MapInfoWindow2').offsetWidth;

            infoWindowSpan.style.top = ptCenter.y + 10;
            infoWindowSpan.style.left = ptCenter.x - 202;
            infoWindowSpan.style.display = 'block';
            infoWindowSpan.style.visibility = "visible";

        }






    } else {



        var contextSpan;
        var infoWindowSpan;

        if (LeftPos) {
            contextSpan = document.getElementById("MapInfoContextB");
            infoWindowSpan = document.getElementById("MapInfoWindowB");
        } else {
            contextSpan = document.getElementById("MapInfoContextB2");
            infoWindowSpan = document.getElementById("MapInfoWindowB2");
        }
        contextSpan.innerHTML = m_context;





        var divM;
        var divW;


        var deltaW = -38;
        if (LeftPos) {
            divM = document.getElementById('MapInfoWindowB').offsetHeight;
            divW = document.getElementById('MapInfoWindowB').offsetWidth;

        } else {
            divM = document.getElementById('MapInfoWindowB2').offsetHeight;
            divW = document.getElementById('MapInfoWindowB2').offsetWidth;
            deltaW = -206;
        }


        infoWindowSpan.style.top = ptCenter.y - divM + 8;
        infoWindowSpan.style.left = ptCenter.x + deltaW;
        infoWindowSpan.style.display = 'block';
        infoWindowSpan.style.visibility = "visible";


    }


}


function getScrollXY() {
    var scrOfX = 0;
    var scrOfY = 0;
    if (typeof (window.pageYOffset) == 'number') {
        //Netscape compliant
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return [scrOfX, scrOfY];
}


function GetElementDivPosition(h) {
    var posX = h.offsetLeft;
    var posY = h.offsetTop;
    var parent = h.offsetParent;

    while (parent !== null) {







        if (parent !== document.body && parent !== document.documentElement) {
            posX -= parent.scrollLeft;
            posY -= parent.scrollTop;
        }
        posX += parent.offsetLeft;
        posY += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return {
        x: posX,
        y: posY
    };
}


function selectHotelMarker(theMarker) {

    var m_context = "";

    m_context += "<table class='mouse_items_list' >";


    var lineClass;
    var tempTitleLine;
    lineClass = "items_L1";

    m_context += "<table>";
    m_context += "<tr class='" + lineClass + "_tr' >";
    m_context += "<td colspan=3 class='" + lineClass + "_td' >";
    m_context += insStar(theMarker.cST);
    m_context += "</td></tr>";

    var t = theMarker.info[4].split('^');
    var tp;

    for (i1 = 1; i1 < t.length; i1 = i1 + 3) {

        m_context += "<tr >";
        m_context += "<td class = PMtd >";
        m_context += "<a class = PMtd  href=\"javascript:";
        m_context += "BookF(" + t[i1 + 1] + "," + theMarker.id + ")";
        m_context += "\" title=\"Book\" >";
        m_context += t[i1];
        m_context += "</a></td>";
        m_context += "<td class = PZtd >";
        tp = t[i1 + 2];
        if (tp.substring(0, 1) === '+') {
            m_context += "<a href=\"javascript:";
            m_context += "BookF(" + t[i1 + 1] + "," + theMarker.id + ")";
            m_context += "\" title=\"Book\" >";
            m_context += "<img class = PZtd border= 0 src='./Images/";
            m_context += "check.png' ";
            m_context += " onmouseover='ShowActiveCheck(this)' onmouseout='ShowPassiveCheck(this)' ";
            m_context += " /></a>";
        } else {
            m_context += "<img class = PZtd border= 0 width=16px src='./Images/";
            m_context += "uncheck.png";
            m_context += "' />";
        }
        m_context += "</td>";
        m_context += "<td class = PZtd >";

        m_context += tp.substring(1);
        m_context += "</td>";

        m_context += "</tr>";
    }



    m_context += "<tr><td colspan=3 class=dis_text>";

    if (typeof (iCC) != 'undefined') {
        m_context += "Distance from <b>Center</b> of ";
        m_context += iCC.cST + " : <b>" + theMarker.m_distance + " km </b>";
    }
    m_context += "</td></tr>";
    if (theMarker.myDistance) {
        if (theMarker.myDistance != null) {
            if (theMarker.myDistance != 0) {
                m_context += "<tr><td colspan=3 class=dis_text>";
                m_context += "<b>" + theMarker.myDistance + " km</b> from " + theMarker.MyLocation + "";
                m_context += "</td></tr>";
            }
        }
    }
    m_context += "</table>";
    m_context += "</td></tr>";


    m_context += "</table>";



    infoWindowSelected.setContent(m_context);
    if (theMarker.gCode != null) {
        infoWindowSelected.setPosition(theMarker.gCode);
    } else {
        infoWindowSelected.setPosition(theMarker.getPosition());
    }
    infoWindowSelected.open(gblMap);
    infoWindowSelected.isOpen = true;
}



function CPi_(c) {
    var mdiv = document.getElementById("Pointer");
    var b_main = document.getElementById("mapDiv");
    gblP = c;
    if (c != null) {
        var ph = gCluster.getProjectionHelper();
        var projection = ph.getProjection();
        var centerxy = projection.fromLatLngToDivPixel(c);

        mdiv.style.visibility = 'visible';

        var m_posY = centerxy.y - 29;
        var m_posX = centerxy.x - 13;




        mdiv.style.top = m_posY;
        mdiv.style.left = m_posX;
    } else {
        mdiv.style.visibility = "hidden";
    }
}


function ResCPi() {
    CPi_(gblP);
}

function CPi(aLat, aLng) {
    var mdiv = document.getElementById("Pointer");
    if ((aLat != "") && (google.maps) && (gCluster)) {
        var m_centr = null;
        m_centr = new google.maps.LatLng(parseFloat(aLat), parseFloat(aLng));
        CPi_(m_centr);

    } else {
        CPi_(null);
    }

}


