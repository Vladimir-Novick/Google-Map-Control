/**
*                                Author: Vladimir Novick 
*                                       ( http://www.linkedin.com/in/vladimirnovick , vlad.novick@gmail.com )
* 
*    February 2010 
*/



 var geocoder = null;
 var map = null;

  var ICC = null;

  var clasterListner = null;
  
  var gRedIcon = null;

  var Min_Items = 6;
  var max_count_clasters = 30;
  var GGris_S = 27;

  var gVarId = 0;
  
  var gblP = null;


var currentTTipClass = null;
var ttipIsVisible = null;
var ttipIsSticky = null ;
var ttipInvisibleSelects = null;
var ttipIsSuppressed = null;
var tooltipIsSuppressed = null;

var mActView = null;

var gblLoader = null;


var DOMReady = false;
var GAJAXAPIReady = false;
var GSearchAPIReady = false;
var GMapAPIReady = false;

var InfoList = new Object();

var gYellowIcon = null; 
var gRedIcon  = null; 
var gSmallShadow  = null; 
var gFindIcon  = null;

var MarkList = null;

var gblMap = null;
  
  var m_ = new Array();

  var gCluster  = null ;

  var m_ContextMenuListener_ = null;


  var m_mouseMoveListener_ = null;

  var infoWindowSelected = null;

  var clusterTooltip = null;

  var markers = new Array();


  var markersStore = null;
  var panelFind = null;
  var LocalSearch = null;

  var bounds = null;

 

  var bountsCity = null; 
  var imageFind = './images/google-map-search.png';
  var imageHotelOK = './images/google-map-Auail.png';
  var imageHotelNo = './images/google-map-no-auail.png';
  var imageHotelSelected = './images/google-map-selected.png';
  var imageCityCenter = "./images/City_Center33.png";


  var CurrentMarkerInfo = null;
  var previewIcon = null;








  var infoCityCenter = null;



  var m_strCityInfo = null;



  var infoWindow = null;

  var contentString = null;
  
  var start = true;

  var infowindow = null;




  var storeInfo = null;
