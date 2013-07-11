/*jslint browser: true, nomen: true*/
/*global $, jQuery, console, L, Workout, TomTomSiteOffSet, TomTomLang, i18, formatTime, createGraph*/

var map, layers, coordinates, displayType, chart, wo, currentLocation, cache, startDate;

startDate = new Date();
displayType = { map: 0, speedchart: 1, pacechart: 4, none: 2, loading: 3 };
cache = [];

/**
 * Map pre-setup
 */
function initMap()
{
    "use strict";
    
    // Map base layers
    layers = {
        "TomTom": new L.tileLayer('https://b.api.tomtom.com/lbs/map/3/basic/1/{z}/{x}/{y}.png?key=d8f9uzdkd3hpuq55qpsdtsx8')
    };
    layers.TomTom.setOpacity(0.3);

    // Create Map
    map = new L.Map('map', {
        center: [90,0],    
        zoom: 4,
        maxZoom: 18,
        layers: [layers.TomTom],
        attributionControl: false
    });
    
    map.invalidateSize(false);
}

/**
 * Map post-setup
 */
function mapPostSetup()
{
    "use strict";
    
    var polyline, startIcon, endIcon;
    
    // Workout path (NOTE: passing the "path" variable into L.polyline converts the x/y arrays into LatLng objects
    polyline = L.polyline(wo.path.slice(0), { color: "#00cccc", clickable: false }).addTo(map);
    map.fitBounds(polyline.getBounds());

    // Start marker
    startIcon = L.icon({
        iconUrl: '../media/images/map-startpoint.png',
        iconSize:     [25, 25],
        iconAnchor:   [12, 12]
    });
    L.marker(wo.path[0], { icon: startIcon, clickable: false }).addTo(map);

    // End marker
    endIcon = L.icon({
        iconUrl: '../media/images/map-endpoint.png',
        iconSize:     [25, 25],
        iconAnchor:   [12, 12]
    });
    L.marker(wo.path[wo.path.length - 1], { icon: endIcon, clickable: false }).addTo(map);
}

/**
 * @param which
 */
function toggleActivity(aType)
{
    "use strict";
    
    switch (aType) {
        case displayType.map:
            $("#map-container").show();
            $("#pace").hide();
            $("#speed").hide();
            $("#error").hide();
            $("#loading").hide();
            break;
        case displayType.pacechart:
            $("#map-container").hide();
            $("#pace").show();
            $("#speed").hide();
            $("#error").hide();
            $("#loading").hide();
            break;
        case displayType.speedchart:
            $("#map-container").hide();
            $("#pace").hide();
            $("#speed").show();
            $("#error").hide();
            $("#loading").hide();
            break;
        case displayType.loading:
            $("#map-container").hide();
            $("#pace").hide();
            $("#speed").hide();
            $("#error").hide();
            $("#loading").show();
            break;
        default:
            $("#map-container").hide();
            $("#pace").hide();
            $("#speed").hide();
            $("#error").show();
            $("#loading").hide();
    }
}

/**
 * 
 */
function removeImgClasses()
{
    "use strict";
    
    $('div#img-dist, div#img-pace, div#img-burned, div#img-rate, div#img-cadence, div#img-speed').removeClass (function (index, css) {
        return (css.match (/\bdist\S+/g) || []).join(' ');
    });
}

/**
 * leaflet.js callback
 * @param feature
 * @param layer
 */
function onEachFeature(feature, layer)
{
    "use strict";
    
    var popupContent = "";
    if (feature.properties && feature.properties.popupContent) {
        popupContent = feature.properties.popupContent;
    }
    layer.bindPopup(popupContent);
}
/**
 * 
 */
function clearMap()
{
    "use strict";
    
    var i;

    $(".leaflet-marker-pane").empty();

    for (i in map._layers)
    {
        if (map._layers.hasOwnProperty(i))
        {
            if (map._layers[i]._path !== undefined)
            {
                try
                {
                    map.removeLayer(map._layers[i]);
                }
                catch(ignore) {}
            }
        }
    }
    
    $("#map").css("-webkit-transform", "");
}

/**
 * 
 * @param String activityName
 */
function addImgClass(activityName)
{
    "use strict";
    
    $('div.c1').removeClass('RUN SWIM CYCLE TREADMILL').addClass(activityName);
}

/**
 * 
 */
function displayChart()
{
    "use strict";
    
    var units, toolTipFormatter, target, xAxisData, color;
    
    switch (wo.activityTypeId) {
        case wo.activityType.run:
        case wo.activityType.treadmill:
            // Show pace
            target = "pace-chart";
            color = "#f0d000";
            xAxisData = wo.pace.data;
            units = (wo.units.pace !== undefined) ? wo.units.pace.toUpperCase() : "";
            toolTipFormatter = function(){
                return '<b>'+i18['TIME']+': '+formatTime(this.x)+'</b><br/>' + '<b>'+i18['DISTANCE']+': '+wo.distance[this.key].toFixed(2)+'<span style="font-size:.8em;text-transform:uppercase;font-weight:bold">'+wo.units.distance+'</span></b><br/>'+i18['PACE']+': ' + this.y + '<span style="font-size:.8em;text-transform:uppercase;">' + units + '</span>';
            };
            break;
        default:
            // Show speed
            target = "speed-chart";
            color = "#00ccff";
            xAxisData = wo.speed.data;
            units = (wo.units.speed !== undefined) ? wo.units.speed.toUpperCase() : "";
            toolTipFormatter = function(){
                return '<b>'+i18['TIME']+': '+formatTime(this.x)+'</b><br/>' + '<b>'+i18['DISTANCE']+': '+wo.distance[this.key].toFixed(2)+'<span style="font-size:.8em;text-transform:uppercase;font-weight:bold">'+wo.units.distance+'</span></b><br/>'+i18['SPEED']+': ' + this.y + '<span style="font-size:.8em;text-transform:uppercase;">' + units + '</span>';
            };
    }

    
    if (chart)
    {
        chart.destroy();
    }
    
    chart = createGraph(target, { data: wo.time }, { data: xAxisData, unit: units }, color, toolTipFormatter, { remove: function(){ console.log("removing chart"); } });
}

/**
 * 
 * @param {Object} status
 * @param {Object} msg
 */
function parseTrackCallback(status, msg)
{
    "use strict";
    
    if (status === true)
    {
        if (wo.path.length > 0)
        {
            // Display map data
            clearMap();
            toggleActivity(displayType.map);
            map.invalidateSize(false);
            mapPostSetup();
        }
        else
        {
            // Display chart data
            displayChart();
            switch(wo.activityTypeId) {
                case wo.activityType.run:
                case wo.activityType.treadmill:
                    toggleActivity(displayType.pacechart);
                    break;
                case wo.activityType.bike:
                case wo.activityType.swim1:
                case wo.activityType.swim2:
                default:
                    toggleActivity(displayType.speedchart);
                    break;
            }
            
        }
    }
    else
    {
        toggleActivity(displayType.none);
    }
}

/**
 * 
 * @param {Object} data
 */
function presentWorkout(data)
{
    "use strict";
    
    var details, track, url, avgSpeed, avgPace, caloriesBurned, avgCadence, avgRate, activityTypeId;
    
    if (data.error !== undefined)
    {
        switch (data.error)
        {
            case 0:
                window.location.href = TomTomSiteOffSet + "content/" + TomTomLang + "/no-data-message";
                break;
        }
        $(".tomtomtabs").tomtomtabs("pageUpdateComplete", true);
        return;
    }
    
    toggleActivity(displayType.loading);
    
    // Show link for activity details
    details = $("#wo-details");
    if (details !== undefined && details.length > 0)
    {
        details.attr("href", details.attr("href").split("?")[0] + "?id=" + data.workout_id);
    }
        
    removeImgClasses();
    addImgClass(data.activity_name);
    
	if (data.avg_speed == 0){
		avgSpeed = '&nbsp;-';
	} else {
		avgSpeed = data.avg_speed;
	}
	if (data.avg_pace == 0){
		avgPace = '&nbsp;-';
	} else {
		avgPace = data.avg_pace;
	}
	if (data.calories_burned == 0){
		caloriesBurned = '&nbsp;-';
	} else {
		caloriesBurned = data.calories_burned;
	}
	if (data.avg_cadence == 0){
		avgCadence = '&nbsp;-';
	} else {
		avgCadence = data.avg_cadence;
	}
	if (data.avg_hr == 0){
		avgRate = '&nbsp;-';
	} else {
		avgRate = data.avg_hr;
	}
	
	if (data.activity_name === 'CYCLE' || data.activity_name === 'SWIM'){
		$('span#paceLabel').hide();
		$('span#avgPace').hide();
		$('span#paceFormat').hide();
		$('span#speedLabel').show();
		$('span#avgSpeed').show();
		$('span#speedFormat').show();
        $('span#avgSpeed').html(avgSpeed);
        $('span#speedFormat').html(data.avg_speed_format);
	} else {
		$('span#speedLabel').hide();
		$('span#avgSpeed').hide();
		$('span#speedFormat').hide();
		$('span#paceLabel').show();
		$('span#avgPace').show();
		$('span#paceFormat').show();
		$('span#avgPace').html(avgPace);
		$('span#paceFormat').html(data.avg_pace_format);
	}
	
    $('span#distance').html(data.distance);
    $('span#caloriesBurned').html(caloriesBurned);
    $('span#avgCadence').html(avgCadence);
    $('span#avgRate').html(avgRate);
    $('span#durationTimeHour').html(data.time_taken.substr(0,2));
    $('span#durationTimeMin').html(data.time_taken.substr(3,2));
    $('span#durationTimeSec').html(data.time_taken.substr(6,2));
    
    centerWorkoutStats();
    
    clearMap();
    
    activityTypeId = (Number(data.main_activity_type_id));
    
    if ((activityTypeId === wo.activityType.bike || activityTypeId === wo.activityType.run) && data.route_key !== null)
    {
        // GETTING KML
        track = new L.KML("get_route_kml/" + data.route_key, {onEachFeature: onEachFeature, async: true});
        track.on("loaded", function(e) {
            
            // Distance marker
            //var ll = track.latLngs[track.latLngs.length - 1];
            //var distanceMarker = L.divIcon({ className: 'tomtom-marker', html: '<div><strong>DISTANCE</strong>&nbsp;&nbsp;' + data.distance + '</div>' });
            //map.addLayer(L.marker(ll, {icon: distanceMarker}));
            
            toggleActivity(displayType.map);
            map.invalidateSize(false);
            map.fitBounds(e.target.getBounds());
            
            e.target.eachLayer(function(innerLayer) {
                //outerLayer.eachLayer(function(innerLayer) {
                    if (innerLayer._layers !== undefined) {
                        $.each(innerLayer._layers, function(key, value) {
                            if (value._icon !== undefined) {
                                if (value._icon.src.indexOf("marker_type_id=4") > 0) {
                                    //start marker
                                    value._icon.src = "../media/images/map-startpoint.png";
                                } else if (value._icon.src.indexOf("marker_type_id=5") > 0) {
                                    //end marker
                                    value._icon.src = "../media/images/map-endpoint.png";
                                }
                            }
                        });
                    }
                //});
            });
            
            $(".tomtomtabs").tomtomtabs("pageUpdateComplete", true);
        });
        map.addLayer(track);
    }
    else
    {
        // NOT GETTING KML
        url = TomTomSiteOffSet + "activity/get_workout_track/" + data.workout_id;
        
        if (cache[url] !== undefined)
        {
            wo = new Workout();
            wo.activityTypeId = activityTypeId;
            wo.parseTrack(cache[url], parseTrackCallback);
            $(".tomtomtabs").tomtomtabs("pageUpdateComplete");
        }
        else
        {
            $.ajax({
                'async': true,
                'global': false,
                'url': url,
                'dataType': "json",
                'success': function(data, textStatus, jqXHR){
                    cache[url] = data;
                    wo = new Workout();
                    wo.activityTypeId = activityTypeId;
                    wo.parseTrack(data, parseTrackCallback);
                },
                "error": function(jqXHR, textStatus, errorThrown ){
                    toggleActivity(displayType.none);
                },
                "complete": function(jqXHR, textStatus){
                    $(".tomtomtabs").tomtomtabs("pageUpdateComplete");
                }
            });
        }
    }
}

//
// Page load
//
$(function(){

    "use strict";
    
    wo = new Workout();
    
    toggleActivity(displayType.loading);
    
    $(".tomtomtabs").tomtomtabs({
        onSelectionChanged: function(workoutdata){
            presentWorkout(workoutdata);
        },
        formatString: "<span>{0}</span><br/>{1}",
        url : TomTomSiteOffSet + "activity/get_workouts/",
        mode: "dashboard"
    });
    
    
    $(window).bind("orientationchange resize", function() {
        centerWorkoutStats();
    });

    initMap();
    
    try
    {
        // Lifetime Totals
        $.ajax({
            'async': true,
            'global': false,
            'url': TomTomSiteOffSet + 'user/get_stats',
            'dataType': "json",
            'error': function(jqXHR, textStatus, errorThrown){
                console.log("Error receiving lifetime stats: " + errorThrown);
            },
            'success': function(data){
                
                var lifetimeStats, average;

                lifetimeStats = { cycle: { distance: { value: 0, unit: "" }, pace: { value: 0, unit: "" }, total: 0 }, run: { distance: { value: 0, unit: "" }, pace: { value: 0, unit: "" }, total: 0 }, swim: { distance: { value: 0, unit: "" }, pace: { value: 0, unit: "" }, total: 0 }, treadmill: { distance: { value: 0, unit: "" }, pace: { value: 0, unit: "" }, total: 0 } };
                
                $.each(data._embedded.stats, function(idx, stat){
                    switch (stat.activity_name)
                    {
                        case "RUN":
                            lifetimeStats.run.distance.value += stat.distance.value;
                            lifetimeStats.run.distance.unit = stat.distance.unit;
                            lifetimeStats.run.pace.value += stat.avg_pace.value;
                            lifetimeStats.run.pace.unit = stat.avg_pace.unit;
                            lifetimeStats.run.total++;
                            break;
                        case "CYCLE":
                            lifetimeStats.cycle.distance.value += stat.distance.value;
                            lifetimeStats.cycle.distance.unit = stat.distance.unit;
                            lifetimeStats.cycle.pace.value += stat.avg_speed.value;
                            lifetimeStats.cycle.pace.unit = stat.avg_speed.unit;
                            lifetimeStats.cycle.total++;
                            break;
                        case "SWIM":
                            lifetimeStats.swim.distance.value += stat.distance.value;
                            lifetimeStats.swim.distance.unit = stat.distance.unit;
                            lifetimeStats.swim.pace.value += stat.avg_speed.value;
                            lifetimeStats.swim.pace.unit = stat.avg_speed.unit;
                            lifetimeStats.swim.total++;
                            break;
			case "TREADMILL":
                            lifetimeStats.treadmill.distance.value += stat.distance.value;
                            lifetimeStats.treadmill.distance.unit = stat.distance.unit;
                            lifetimeStats.treadmill.pace.value += stat.avg_pace.value;
                            lifetimeStats.treadmill.pace.unit = stat.avg_pace.unit;
                            lifetimeStats.treadmill.total++;
                            break;
                    }
                });
                
                
                // Run
                if (lifetimeStats.run.distance.value > 0)
                {
                    $('#lifetime-run').toggle();
                    $('span#run_stat_distance').html(parseFloat(lifetimeStats.run.distance.value).toFixed(2) + "<sup>" + lifetimeStats.run.distance.unit);
                    if (lifetimeStats.run.pace.value !== 0 && lifetimeStats.run.total !== 0)
                    {
                        average = lifetimeStats.run.pace.value / lifetimeStats.run.total;
            			var average_minutes = Math.floor(average);
            			var average_seconds = parseFloat((average-average_minutes)*60).toFixed(0);
                        $('span#run_stat_pace').html(average_minutes +":" + average_seconds + "<sup>" + lifetimeStats.run.pace.unit);
                    }
                    else
                    {
                        $("#lifetime-run .img-averagespeed").hide();
                    }
                }
                
                // Bike
                if (lifetimeStats.cycle.distance.value > 0)
                {
                    $('#lifetime-ride').toggle();
                    $('span#ride_stat_distance').html(parseFloat(lifetimeStats.cycle.distance.value).toFixed(2) + "<sup>" + lifetimeStats.cycle.distance.unit);
                    if (lifetimeStats.cycle.pace.value !== 0 && lifetimeStats.cycle.total !== 0)
                    {
                        average = lifetimeStats.cycle.pace.value / lifetimeStats.cycle.total ;
                        $('span#ride_stat_speed').html(parseFloat(average).toFixed(2) + "<sup>" + lifetimeStats.cycle.pace.unit);
                    }
                    else
                    {
                        $("#lifetime-ride .img-averagespeed").hide();
                    }
                }
                
                // Swim
                if (lifetimeStats.swim.distance.value > 0)
                {
                    $('#lifetime-swim').toggle();
                    $('span#swim_stat_distance').html(parseFloat(lifetimeStats.swim.distance.value).toFixed(2) + "<sup>" + lifetimeStats.swim.distance.unit);
                    if (lifetimeStats.swim.pace.value !== 0 && lifetimeStats.swim.total !== 0)
                    {
                        average = lifetimeStats.swim.pace.value / lifetimeStats.swim.total;
                        $('span#swim_stat_speed').html(parseFloat(average).toFixed(2) + "<sup>" + lifetimeStats.swim.pace.unit);
                    }
                    else
                    {
                        $("#lifetime-swim .img-averagespeed").hide();
                    }
                }
		
		        // Treadmill
                if (lifetimeStats.treadmill.distance.value > 0)
                {
                    $('#lifetime-treadmill').toggle();
                    $('span#treadmill_stat_distance').html(parseFloat(lifetimeStats.treadmill.distance.value).toFixed(2) + "<sup>" + lifetimeStats.treadmill.distance.unit);
                    if (lifetimeStats.treadmill.pace.value !== 0 && lifetimeStats.treadmill.total !== 0)
                    {
                        average = lifetimeStats.treadmill.pace.value / lifetimeStats.treadmill.total;
			var average_minutes = Math.floor(average);
			var average_seconds = parseFloat((average-average_minutes)*60).toFixed(0);
                        $('span#treadmill_stat_pace').html(average_minutes +":" + average_seconds + "<sup>" + lifetimeStats.treadmill.pace.unit);
                    }
                    else
                    {
                        $("#lifetime-treadmill .img-averagespeed").hide();
                    }
                }
            }
        });
    
    }
    catch(ignore) {}
    
});
