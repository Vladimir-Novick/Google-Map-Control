/**
* @version 1.0
* @author: Vladimir Novick    http://www.linkedin.com/in/vladimirnovick
*
*/
function PanelFind(){
};


PanelFind.prototype.clear = function() {
    this.items = new Array();
    gVarId = 0;
    var el = $("#searchwell");
    el.empty();
    var el_all =$("#idFindDiv");
    el_all.css('width','900px');
    el_all.css('height', '1260px');

    el.css("width","900px");
  //  el.css("height","900px");


    var idTitleDiv = $("#idTitleDiv");
    idTitleDiv.css("width","20px");
    idTitleDiv.css("height","20px");



    this.Context = $("<table />");
    this.Context.attr("class", "ContextTable");
    this.Context.resize(function(arg) {
        panelFind.ResizeContext(panelFind.Context);
    });
    this.Context.attr("id", "idContextTable");
    this.Context.attr("border", "0");
    this.Context.attr("nowrap", "nowrap");
    this.Context.attr("cellspacing", "0");
    this.Context.attr("cellpadding", "0");
    el.append(this.Context);
    this.lastRow = 0;

};

PanelFind.prototype.Add = function(strDescription, script) {

    var styleLine = "table_line0";
    if ((this.NumLine % 2) == 1) {
        styleLine = "table_line1";
    }

};



function doSearchF(address) {
    LocalSearch.doSearch(address);
};


PanelFind.prototype.AddRow = function(script) {
    var tbl = this.Context;



    var styleLine = "table_line0";
    if (((this.lastRow ) % 2) == 1) {
        styleLine = "table_line1";
    }


    var row = $('<tr />');
    tbl.append(row);

    var cellLeft = $('<td />');
    cellLeft.attr("class", styleLine);
    cellLeft.attr("nowrap", "nowrap");
    cellLeft.append($(script));
    row.append(cellLeft);
    this.lastRow++;


    var row2 = $('<tr />');
    tbl.append(row2);
   
    var cellLeft1 = $("<td />");
    cellLeft1.attr("class", "sp_h_line");
   
    row2.append(cellLeft1);


};


PanelFind.prototype.generateLink = function(text, script, style) {
    var a = $('<a />');
    var link = "javascript:" + script + "; return 0;";
    a.attr("class", style);
    a.attr('href', link);
    a.html(text);
    return a;
};


function LocalSearch(){
}


function RestoreSearchWindow() {

}



LocalSearch.prototype.Init = function() {
    this.gLocalSearch = null;
    this.gMap = gblMap;

    this.serviceSearch = new google.maps.places.PlacesService(this.gMap);



    this.gSelectedResults = [];
    this.gCurrentResults = [];
    this.gSearchForm = null;

    this.gYellowIcon = new google.maps.MarkerImage(
      "images/mm_20_find.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    this.gRedIcon = new google.maps.MarkerImage(
      "images/mm_20_yellow.png.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    this.gSmallShadow = new google.maps.MarkerImage(
      "images/mm_20_shadow.png",
      new google.maps.Size(22, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));


    
    
}

LocalSearch.prototype.unselectMarkers = function() {
for (var i = 0; i < this.gCurrentResults.length; i++) {
        this.gCurrentResults[i].unselect();
    }
}

LocalSearch.prototype.doSearch = function(query) {
    //  LocalSearch.gLocalSearch.execute(query);
    var bounds = this.gMap.getBounds();
    var center = this.gMap.getCenter();
    var
        ne = bounds.getNorthEast();


    // r = radius of the earth in statute miles
    var r = 3963.0;  

    // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    var lat1 = center.lat() / 57.2958; 
    var lon1 = center.lng() / 57.2958;
    var lat2 = ne.lat() / 57.2958;
    var lon2 = ne.lng() / 57.2958;

    // distance = circle radius from center to Northeast corner of bounds
    var Radius = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));


    var request = {
        location: center,
        radius: '50000',
        query: query

    };
      LocalSearch.serviceSearch.textSearch(request, callbackSearch);


    //var request = {
    //    bounds: this.gMap.getBounds(),
    //    keyword: query
    //};
    //LocalSearch.serviceSearch.radarSearch(request, callback);



    //var request = {
    //    location: center,
    //    radius: Radius,
    //    types: query
    //};
    //LocalSearch.serviceSearch.search(request, callbackSearch);

}


function callbackSearch(results, status) {
    panelFind.clear();
    LocalSearch.gCurrentResults = [];
    if (status != google.maps.places.PlacesServiceStatus.OK) {
        var node = $('<div>', {
            text: 'Not Found'
        });
        panelFind.AddRow(node);
     } else {
        for (var i = 0, result; result = results[i]; i++) {
            var place = results[i];
            LocalSearch.gCurrentResults.push(new LocalResult(place, gVarId));
            gVarId++;
        }
    }


 
    f_screen(true);


}



LocalSearch.prototype.OnLocalSearch = function() {
    if (!LocalSearch.gLocalSearch.results) {
        return;
    }

    panelFind.clear();


    LocalSearch.gCurrentResults = [];
    for (var i = 0; i < LocalSearch.gLocalSearch.results.length; i++) {
        LocalSearch.gCurrentResults.push(new LocalResult(LocalSearch.gLocalSearch.results[i], gVarId));
        gVarId++;
    }

    var attribution = LocalSearch.gLocalSearch.getAttribution();



    var first = LocalSearch.gLocalSearch.results[0];
    if (typeof (first) == "undefined") {
F
        panelFind.AddRow(node);
    } else {
        LocalSearch.gMap.setCenter(new google.maps.LatLng(parseFloat(first.lat),
                                             parseFloat(first.lng)));
    }
    f_screen(true);

}







function LocalResult(result,i) {
    var me = this;
    this.plase = result;
    this.letter = String.fromCharCode("A".charCodeAt(0) + i); 
    me.result_ = result;
    this.nLine = i;
    var now = new Date();
    var ticks = now.getTime();
    me.idFind = "" + ticks + "_" + i;
    this.id = this.idFind;
    
    
    
    me.marker_ = me.marker(result);



    this.letter = String.fromCharCode("A".charCodeAt(0) + i);
    me.marker_.letter = this.letter;
    
    var LetterIcon = new google.maps.MarkerImage(
      "http://www.google.com/mapfiles/marker" + this.letter + ".png",
      new google.maps.Size(20, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));

    this.Icon = LetterIcon;

    

    me.marker_.setOptions({ icon: LetterIcon });

    this.gCode = me.marker_.getPosition();

    me.marker_.LatLon = new LatLon(this.gCode.lat(), this.gCode.lng());

    me.htmlNode = this.CreateHtml();
    
    

    
   
    

    panelFind.AddRow(me.htmlNode);
}

LocalResult.prototype.node = function() {
    if (this.resultNode_) return this.resultNode_;
    return this.html();
};


LocalResult.prototype.marker = function (result) {
    var me = this;
    var poz = null;
    poz = new google.maps.LatLng(parseFloat(result.geometry.location.lat()),
                                         parseFloat(result.geometry.location.lng()));
    if (me.marker_) return me.marker_;

    var marker = me.marker_ = new google.maps.Marker({
        position: poz,
        icon: gYellowIcon, shadow: gSmallShadow, map: LocalSearch.gMap
    });

    marker.setZIndex(10);

    google.maps.event.addListener(marker, 'rightclick', function (event) {

        google.maps.event.trigger(gblMap, 'rightclick', event);

    });


    google.maps.event.addListener(marker, 'click', function(e) {
        selectMarker(marker);
        return e.returnValue;
    });




    var info1;
    info1 = me.getMarkerText();

    var m_distance = 0;

    if (typeof (iCC) != "undefined") {
        if (iCC != null) {
            var lat1 = iCC.position.lat();
            var lon1 = iCC.position.lng();
            var lat2 = poz.lat();
            var lon2 = poz.lng();

            m_distance = LL.dH(lat1, lon1,
                    lat2, lon2).toPrecision(4);

        }
    }


    marker.MI(me.idFind, info1, null, null);
    marker.cS = "1";
    marker.m_distance = m_distance;
    marker.gCode = marker.getPosition();
    marker.cST = info1;
    marker.lat = poz.lat();
    marker.lng = poz.lng();

    var link = "<a class='open_link'  href=\"javascript:ShowNearbyHotels('" + me.id + "');\" >Show Nearby</a> " ;

    marker.Link[0] = link;

    var t = this.result_.formatted_address;
    marker.setOptions({ title: t });
    m_.push(marker);


    return marker;
};


LocalResult.prototype.select = function() {
    LocalSearch.unselectMarkers();
    this.selected_ = true;
    this.highlight(true);
    var help_context = this.html(true);
};

// Remove any highlighting on this result.
LocalResult.prototype.unselect = function() {
    this.selected_ = false;
    this.highlight(false);
};


LocalResult.prototype.html = function() {
    if (typeof (this.htmlNode) == "undefined") {
       this.htmlNode = this.CreateHtml();    
    }
    return this.htmlNode;
};


LocalResult.prototype.getMarkerText = function() {
    if (typeof (this.textNode_) == "undefined") {
        this.textNode =  this.result_.formatted_address;
    }
    return this.textNode;
};


LocalResult.prototype.createHTMLNode = function(htmlCode) {
    // create html node
    var htmlNode = document.createElement('span');
    htmlNode.innerHTML = htmlCode
    return htmlNode;
}
  



LocalResult.prototype.CreateHtml = function() {
    var me = this;
    var container = document.createElement("div");

    var tbl = document.createElement("table");

    container.appendChild(tbl);
    tbl.setAttribute("className", "ContextTable");
    tbl.setAttribute("width", "100%");
    tbl.setAttribute("border", "0");
    tbl.setAttribute("nowrap", "nowrap");
    tbl.setAttribute("cellspacing", "0");
    tbl.setAttribute("cellpadding", "0");
    var row = tbl.insertRow(0);
    var cellLeft0 = row.insertCell(0);
    cellLeft0.style.width = "20px";
    var img = document.createElement("img");
    img.src = "http://www.google.com/mapfiles/marker" + this.letter + ".png";
    var f = "eval(\"setListMarker('" + this.id + "')\");";
    img.setAttribute("onclick", f);
    img.style.height = "20px";
    img.style.width = "12px";
    cellLeft0.appendChild(img);
    var cellLeft1 = row.insertCell(1);
    var styleLine = "table_info0";
    if ((this.nLine % 2) == 1) {
        styleLine = "table_info1";
    }
    row.className = styleLine;

    var link_txt =  me.result_.formatted_address;

    var link = document.createElement('a');
    link.href = "#"; 
    link.onclick = new Function("viewMarkerLink('" + this.id + "')");
    link.appendChild(this.createHTMLNode( me.plase.formatted_address));

    cellLeft1.appendChild(link);



 

    return container;
};



LocalResult.prototype.sourceHtml = function() {
    var me = this;
    var container = document.createElement("div");
    container.className = "unselected";
    container.appendChild(me.result_.html.cloneNode(true));
    return container;
}


LocalResult.prototype.highlight = function(highlight) {
  
  
}

PanelFind.prototype.ResizeContext = function (arg) {




     

       var table_w = $(arg).width() ;
       var table_h =  $(arg).height() ;


       var idTitleDiv = $("#idTitleDiv");
       idTitleDiv.css('width',table_w + 'px');
       idTitleDiv.css('height','20px');        
       
        //var el1 = document.getElementById("searchwell");
        //el1.style.width = table_w  ;
        //el1.style.height = table_h;
        //el1.top = 20;   
        var myWidth;
        var myHeight = getClientHeight();
        var el = $("#idFindDiv");
        if (table_h > (myHeight/3)*2) {
            el.css('overflowY', 'scroll');
            el.css('overflowX', 'hidden');
            table_h = ((myHeight/3)*2) - 25;
            table_w = table_w + 25;
        } else {
            el.css('overflowY', 'hidden');
            el.css('overflowX', 'hidden');
        }

        el.css('top',(myHeight - table_h - 45 )+ 'px');
        el.css('width',( table_w +5 ) + 'px');
        el.css('height', ( table_h + 25 ) + 'px');
     
}

function f_screen(v) {
    var el =$("#idFindDiv");
    if (v) {
        el.css('visibility',"visible");
        el.css("display","block");
       
    } else {
        el.css('visibility', "hidden");
        el.css("display", "none");
    }
  
}

function RSW() {
    var el = document.getElementById("idFindDiv");
    if (el.style.visibility == "visible") {
        el.style.display = "none";
        el.style.visibility = "hidden"
    } else {
       el.style.visibility = "visible";
       el.style.display = "block";   
    }  
}