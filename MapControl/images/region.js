/**
*
* * @author: Vladimir Novick    http://www.linkedin.com/in/vladimirnovick  
*
*/

function DistanceWidget(map, position, centerDescription, startDistance) {
    this.set('map', map);
    this.set('position', position);

    var centerIcon = new google.maps.MarkerImage("./images/centerGeo.png", new google.maps.Size(20, 34), new google.maps.Point(0, 0), new google.maps.Point(8, 32));


    this.marker = new google.maps.Marker({
        draggable: true,
        title: centerDescription,
        icon: centerIcon
    });

    google.maps.event.addListener(this.marker, 'drag', function () {
        var position = this.get('position');
        var text = "position: " + position.lat() + ',' + position.lng();
        this.setTitle(text);
    });

    this.marker.setZIndex(10);

    // Bind the marker map property to the DistanceWidget map property
    this.marker.bindTo('map', this);

    // Bind the marker position property to the DistanceWidget position
    // property
    this.marker.bindTo('position', this);

    // Create a new radius widget
    this.radiusWidget = new RadiusWidget(startDistance);

    // Bind the radiusWidget map to the DistanceWidget map
    this.radiusWidget.bindTo('map', this);

    // Bind the radiusWidget center to the DistanceWidget position
    this.radiusWidget.bindTo('center', this, 'position');

    // Bind to the radiusWidgets' distance property
    this.bindTo('distance', this.radiusWidget);

    // Bind to the radiusWidgets' bounds property
    this.bindTo('bounds', this.radiusWidget);


    var me = this;
    google.maps.event.addListener(this.marker, 'dblclick', function () {
        // When a user double clicks on the icon fit to the map to the bounds
        map.fitBounds(me.get('bounds'));
    });

    google.maps.event.addListener(this.marker, 'rightclick', function (event) {

        google.maps.event.trigger(map, 'rightclick', event);

    });

    /*     google.maps.event.addListener(this, 'distance_changed', function () {
    var dist = this.get('distance');
    dist = Math.round(dist * 100) / 100
    });
    */
    map.fitBounds(me.get('bounds'));

}
DistanceWidget.prototype = new google.maps.MVCObject();

DistanceWidget.prototype.showRegion = function () {
    var me = this;
    var bounds = me.get('bounds');
    gblMap.setCenter(bounds.getCenter());
    gblMap.fitBounds(bounds);
  
}

DistanceWidget.prototype.showFullRegion = function () {
    var me = this;
    var bounds = me.get('bounds'); 
     gblMap.setCenter(bounds.getCenter());
    gblMap.fitBounds(bounds);
  
    gblMap.setZoom(gblMap.getZoom() + 1);
}

DistanceWidget.prototype.close = function () {
    this.radiusWidget.sizer.setMap(null);
    this.radiusWidget.circle.setMap(null);
    this.marker.setMap(null);
}


/**
* A radius widget that add a circle to a map and centers on a marker.
*
* @constructor
*/
function RadiusWidget(startDistance) {
    this.circle = new google.maps.Circle({
        strokeWeight: 2,
        fillColor: '#505c84',
        strokeColor: '#505c84',
        zIndex: 1
    });

    // Set the distance property value, default to 50km.
    this.set('distance', startDistance);

    // Bind the RadiusWidget bounds property to the circle bounds property.
    this.bindTo('bounds', this.circle);

    // Bind the circle center to the RadiusWidget center property
    this.circle.bindTo('center', this);

    // Bind the circle map to the RadiusWidget map
    this.circle.bindTo('map', this);

    // Bind the circle radius property to the RadiusWidget radius property
    this.circle.bindTo('radius', this);


    google.maps.event.addListener(this.circle, 'rightclick', function (event) {

        google.maps.event.trigger(gblMap, 'rightclick', event);

    });

    // Add the sizer marker
    this.addSizer_(startDistance);
}
RadiusWidget.prototype = new google.maps.MVCObject();


/**
* Update the radius when the distance has changed.
*/
RadiusWidget.prototype.distance_changed = function () {
    this.set('radius', this.get('distance') * 1000);
};


/**
* Add the sizer marker to the map.
*
* @private
*/
RadiusWidget.prototype.addSizer_ = function (startSize) {


    var dragIcon = new google.maps.MarkerImage("./images/sizer.png", null, null, null, new google.maps.Size(25, 25));

    var t = "Distance: " + Math.round(startSize * 100) / 100 + " km";

    this.sizer = new google.maps.Marker({
        draggable: true,
        title: t,
        icon: dragIcon
    });

    this.sizer.setZIndex(10);

    this.sizer.bindTo('map', this);
    this.sizer.bindTo('position', this, 'sizer_position');






    var me = this;
    google.maps.event.addListener(this.sizer, 'drag', function () {
        // Set the circle distance (radius)
        me.setDistance();
    });


    google.maps.event.addListener(this.sizer, 'rightclick', function (event) {

        google.maps.event.trigger(map, 'rightclick', event);

    });

};


/**
* Update the center of the circle and position the sizer back on the line.
*
* Position is bound to the DistanceWidget so this is expected to change when
* the position of the distance widget is changed.
*/
RadiusWidget.prototype.center_changed = function () {
    var bounds = this.get('bounds');

    // Bounds might not always be set so check that it exists first.
    if (bounds) {
        var lng = bounds.getNorthEast().lng();
        var latN = bounds.getSouthWest().lat();

        // Put the sizer at center, right on the circle.
        var position = new google.maps.LatLng(this.get('center').lat(), lng);
        var positionClose = new google.maps.LatLng(latN, this.get('center').lng);
        this.set('sizer_position', position);
        this.set('closer_position', positionClose);
    }
};


/**
* Calculates the distance between two latlng points in km.
* @see http://www.movable-type.co.uk/scripts/latlong.html
*
* @param {google.maps.LatLng} p1 The first lat lng point.
* @param {google.maps.LatLng} p2 The second lat lng point.
* @return {number} The distance between the two points in km.
* @private
*/
RadiusWidget.prototype.distanceBetweenPoints_ = function (p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};


/**
* Set the distance of the circle based on the position of the sizer.
*/
RadiusWidget.prototype.setDistance = function () {
    // As the sizer is being dragged, its position changes.  Because the
    // RadiusWidget's sizer_position is bound to the sizer's position, it will
    // change as well.
    var pos = this.get('sizer_position');
    var center = this.get('center');
    var distance = this.distanceBetweenPoints_(center, pos);

    // Set the distance property for any objects that are bound to it
    this.set('distance', distance);
    this.sizer.title = "Distance: " + Math.round(distance * 100) / 100 + " km";
};