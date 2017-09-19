/**
* @version 1.0
* @author: Vladimir Novick    http://www.linkedin.com/in/vladimirnovick
*   
*/


InfoList.clear = function() {
    this.items = new Array();
    var el = document.getElementById("Info_searchwell");
    el.innerHTML = "";
    var el_all = document.getElementById("Info_idFindDiv");
    el_all.style.width = 900;
    el_all.style.height = 900;

    el.style.width = 900;
    el.style.height = 900;


    var idTitleDiv = document.getElementById("Info_idTitleDiv");
    idTitleDiv.style.width = 20;
    idTitleDiv.style.height = 20;

    this.Context = document.createElement("table");
    this.Context.setAttribute("className", "ContextTable");
    this.Context.onresize = new Function("Info_Resize();");
    this.Context.setAttribute("id", "Info_idContextTable");
    this.Context.setAttribute("border", "0");
    this.Context.setAttribute("nowrap", "nowrap");
    this.Context.setAttribute("cellspacing", "0");
    this.Context.setAttribute("cellpadding", "0");
    el.appendChild(this.Context);
    this.lastRow = 0;

};

InfoList.Add = function(strDescription, script) {

    var styleLine = "table_info0";
    if ((this.NumLine % 2) == 1) {
        styleLine = "table_info1";
    }

};


InfoList.AddRow = function(script) {
    var tbl = this.Context;


    var styleLine = "table_info0";
    if (((this.lastRow / 2) % 2) == 1) {
        styleLine = "table_info1";
    }


    var row = tbl.insertRow(this.lastRow);



    for (var icell = 0; icell < arguments.length; icell++) {

        var script1 = arguments[icell];
        var cellLeft = row.insertCell(icell);
        cellLeft.setAttribute("className", styleLine);
        cellLeft.setAttribute("nowrap", "nowrap");
        var t = typeof (script1);
        var insVal = script1;
        if (t != "object") {
            insVal = document.createTextNode(script1);
        }
        cellLeft.appendChild(insVal);
    }
    this.lastRow++;


    var row1= tbl.insertRow(this.lastRow);
    this.lastRow++;

    var cellLeft3 = row1.insertCell(0);
    cellLeft3.setAttribute("className", "sp_h_line");
    cellLeft3.innerHTML = " ";



};





InfoList.Show =  function(v) {

    var el = $("#Info_idFindDiv");
    if (v) {



        el.attr('class',"info_div");


    } else {
        el.attr('class',"info_div_hide");
        el.css('width','800px');
    }
}

function Info_Resize() {




    var el = $("#Info_idFindDiv");
    var table_element = $("#Info_idContextTable");
    var table_w = table_element.width();
    var table_h = table_element.height();


    var idTitleDiv = $("#Info_idTitleDiv");
    idTitleDiv.css('width',table_w+'px');
    idTitleDiv.css('height','20px');


    var myWidth;
    var myHeight = getClientHeight();
    if (table_h > 500) {
        table_h = 500;
    }
    el.css('top',(myHeight - table_h - 25) + 'px');
    el.css('width',table_w+'px') ;
    el.css('height',table_h+'px');

    var el1 = $("#info_searchwell");
    el1.css('width',table_w+'px');
    el1.css('height',(table_h + 25)+'px');

}


function loadScript(sScriptSrc, oCallback) {
    var oHead = document.getElementById('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = sScriptSrc;

    oScript.onload = oCallback;
    // IE 6 & 7
    oScript.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            oCallback();
        }
    }
    oHead.appendChild(oScript);
}