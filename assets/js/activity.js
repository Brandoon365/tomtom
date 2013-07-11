/*jslint browser: true, devel: true, passfail: false, nomen: true, plusplus: true, unparam: true, todo: true, white: true */
/*global $, formatTime, i18, createGraph, L, formatDistance, Workout */

var config, coordinates, layers, map, currentLocation, wo, workoutId, distanceMarkers, maxSpeedIcon, maxSpeedMarker, maxHeightMarker, minHeightMarker, startDate, maxZ, i;
startDate  = new Date();
maxZ = 1000;

/**
 * Map pre-setup
 */
function mapPreSetup()
{
    "use strict";
    
    // Map base layers
    layers = {
        "TomTom": new L.tileLayer('http://b.api.tomtom.com/lbs/map/3/basic/1/{z}/{x}/{y}.png?key=d8f9uzdkd3hpuq55qpsdtsx8')
    };
    layers.TomTom.setOpacity(0.3);

    // Create Map
    map = new L.Map('map', {
        center: [39.828175, -98.5795],    
        zoom: 4,
        maxZoom: 18,
        layers: [layers.TomTom],
        attributionControl: false
    });
    
    // Bind distance/lap radio buttons
    $("#marker-type-distance, #marker-type-lap").change(function(evt){
        
        var markerType = $(evt.target).attr("id");
        switch(markerType)
        {
            case "marker-type-distance":
                $(".tomtom-lap-marker").hide();
                break;
            case "marker-type-lap":
                $(".tomtom-lap-marker").show();
                $(".tomtom-elevation-marker, .tomtom-speed-marker").hide();
                break;
        }
    });
}

/**
 * Map post-setup
 */
function mapPostSetup()
{
    "use strict";
    
    var polyline, startIcon, endIcon, minHeightIcon, minHeightMarker, maxHeightIcon, maxHeightMarker, i, lapIcon, curLocMarker;
    
    // Workout path (NOTE: passing the "path" variable into L.polyline converts the x/y arrays into LatLng objects
    if (wo.path.length > 0)
    {
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
    
    // Min height marker
    if (wo.elevation.min.ll !== null)
    {
        minHeightIcon = L.divIcon({ className: 'tomtom-elevation-marker', html: '<div>'+i18['Lowest Elevation']+'<br/><span>'+wo.elevation.min.height+'<sup>'+wo.elevation.units+'</sup> @ ' + formatDistance(wo.elevation.min.distance) + '<sup>'+wo.units.distance+'</sup></span></div>' });
        minHeightMarker = L.marker(wo.elevation.min.ll, { icon: minHeightIcon, zIndexOffset: 100 }).addTo(map);
        minHeightMarker.on("click mouseover", function(evt){
            
            var z = ++maxZ;
            $(evt.target._icon).css("z-index", z);
            evt.target._zIndex = z;
            
        });
    }
    
    // Max height marker
    if (wo.elevation.max.ll !== null)
    {
        maxHeightIcon = L.divIcon({ className: 'tomtom-elevation-marker', html: '<div>'+i18['Highest Elevation']+'<br/><span>'+wo.elevation.max.height+'<sup>'+wo.elevation.units+'</sup> @ ' + formatDistance(wo.elevation.max.distance) + '<sup>'+wo.units.distance+'</sup></span></div>' });
        maxHeightMarker = L.marker(wo.elevation.max.ll, { icon: maxHeightIcon, zIndexOffset: 100 }).addTo(map);
        maxHeightMarker.on("click mouseover", function(evt){
            
            var z = ++maxZ;
            $(evt.target._icon).css("z-index", z);
            evt.target._zIndex = z;
            
        });
    }
    
    // Max speed marker
    if (wo.speed.max.ll !== null)
    {
        maxSpeedIcon = L.divIcon({ className: 'tomtom-speed-marker', html: '<div>'+i18['Highest Pace']+'<br/><span>'+wo.speed.max.speed+'<sup>'+wo.speed.units+'</sup> @ ' + formatDistance(wo.speed.max.distance) + '<sup>'+wo.units.distance+'</sup></span></div>' });
        maxSpeedMarker = L.marker(wo.speed.max.ll, { icon: maxSpeedIcon, zIndexOffset: 101 }).addTo(map);
        maxSpeedMarker.on("click mouseover", function(evt){
            
            var z = ++maxZ;
            $(evt.target._icon).css("z-index", z);
            evt.target._zIndex = z;
            
        });
    }
    
    // Lap markers
    for (i = 0; i < wo.laps.length; i++)
    {
        lapIcon = L.divIcon({ className: 'tomtom-lap-marker', html: '<div>'+(i+1)+'</div>' });
        L.marker(wo.laps[i], { icon: lapIcon, clickable: false, zIndexOffset: 98  }).addTo(map);
    }
    $(".tomtom-lap-marker").hide();
    
    // Current location marker
    if (wo.path.length > 0)
    {
        curLocMarker = L.icon({
            iconUrl: '../media/images/icon-runner.png',
            iconSize:     [19, 19],
            iconAnchor:   [9, 9]
        });
        currentLocation = L.marker(wo.path[0], { icon: curLocMarker , clickable: false, zIndexOffset: 99 }).addTo(map);
        currentLocation.setOpacity(0);
    }
}

/**
 * Load activity config from query string
 */
function loadConfig()
{
    "use strict";
    
    var search, options, option;
    
    config = {};
    search = window.location.search.replace("?", "");
    if (search.length !== 0)
    {
        options = search.split("&");
        for (i = 0; i < options.length; i++)
        {
            option = options[i].split("=");
            config[option[0]] = (option[1] !== undefined) ? option[1] : null;
        }
    }
}

/**
 * Callback for Workout.getTrack
 * @param status Bool
 * @param msg String
 */
function getTrackCallback(status, msg)
{
    "use strict";
    
    var duration, statItemWidth, statMarginLeft, statSpanWidth, timeMax, x, y, chartEvents, speedUnits, speedToolTipFormatter, elevationUnits, elevationToolTipFormatter, heartrateUnits, heartrateToolTipFormatter, paceUnits, paceToolTipFormatter, avgSpeed, avgPace, caloriesBurned, avgCadence, avgRate, avgElevation;
    
    if (status === true)
    {
        addImgClass(wo.activityName);
        $(".activity-type").text(wo.activityName);
	
		if (wo.workout.avg_speed == 0){
			avgSpeed = '&nbsp;-';
		} else {
			avgSpeed = wo.workout.avg_speed;
		}
		if (wo.workout.avg_pace == 0){
			avgPace = '&nbsp;-';
		} else {
			avgPace = wo.workout.avg_pace;
		}
		if (wo.workout.calories_burned == 0){
			caloriesBurned = '&nbsp;-';
		} else {
			caloriesBurned = wo.workout.calories_burned;
		}
		if (wo.workout.avg_cadence == 0){
			avgCadence = '&nbsp;-';
		} else {
			avgCadence = wo.workout.avg_cadence;
		}
		if (wo.workout.avg_hr == 0){
			avgRate = '&nbsp;-';
		} else {
			avgRate = wo.workout.avg_hr;
		}
		if (!wo.elevation.avg || wo.elevation.avg == 0){
			avgElevation = '&nbsp;-';
		} else {
			if ($('span#elevationFormat').html().toUpperCase() == "FEET" && wo.units.elevation.toUpperCase() == 'M'){
				avgElevation = '+' + m2ft(wo.elevation.avg).toFixed(2);
			} else {
				avgElevation = '+' + wo.elevation.avg.toFixed(2);
			}
		}
		
		if (wo.activityName == 'CYCLE' || wo.activityName == 'SWIM'){
			$('span#paceLabel').hide();
			$('span#avgPace').hide();
			$('span#paceFormat').hide();
			$('span#speedLabel').show();
			$('span#avgSpeed').show();
			$('span#speedFormat').show();
			$('span#avgSpeed').html(avgSpeed);
			$('span#speedFormat').html(wo.workout.avg_speed_format);
		} else {
			$('span#speedLabel').hide();
			$('span#avgSpeed').hide();
			$('span#speedFormat').hide();
			$('span#paceLabel').show();
			$('span#avgPace').show();
			$('span#paceFormat').show();
			$('span#avgPace').html(avgPace);
			$('span#paceFormat').html(wo.workout.avg_pace_format);
		}
        
		//formatting should be done according to user prefs in php before being returned
        $(".activity-date").text(wo.workout.formattedDate);
        
        $('span#distance').html(wo.workout.totalDistance.toFixed(2));
        $("#img-dist .smallTitle").text(wo.units.distance);
        
        duration = formatTime(wo.duration).split(":");
        $('span#durationTimeHour').html(duration[0]);
        $('span#durationTimeMin').html(duration[1]);
        $('span#durationTimeSec').html(duration[2]);
        
        
        $('span#caloriesBurned').html(caloriesBurned);
        $('span#totElevationGain').html(avgElevation);
        
        // TODO: Average Speed
        $('span#avgRate').html(avgRate);
        $('span#avgCadence').html(avgCadence);
        $('span#avgCadenceUnit').html(wo.units.cadence);
        $('span#duration').html(formatTime(wo.duration));
		
		//center stats
		centerWorkoutStats();
        
        //
        // Time
        //
        timeMax = Math.floor(wo.time[wo.time.length - 1]);
        x = { data: wo.time, min: 0, max: timeMax, unit: wo.units.time };
        
        //
        // Chart Events
        //
        chartEvents = {
                            mouseOver: function(evt){
                                var coord = wo.path[this.x];
                                currentLocation.setOpacity(1);
                                
                                if (coord !== undefined) {
                                    currentLocation.setLatLng(coord);
                                }
                                
                                if (evt.target.series.name === "elevatio") {
                                    $(".tomtom-elevation-marker").css("display", "block");
                                }
                                
                                if (evt.target.series.name === "speed") {
                                    $(".tomtom-speed-marker").css("display", "block");
                                }
                            },
                            mouseOut: function(evt){
                                currentLocation.setOpacity(0);
                                $(".tomtom-elevation-marker, .tomtom-speed-marker").css("display", "none");
                            }
                        };
        
        //
        // Speed
        //
        try
        {
            if (wo.elevation.data.length > 0)
            {
                speedUnits = wo.units.speed.toUpperCase();
                y = { data: wo.speed.data, min: wo.speed.min.speed, max: wo.speed.max.speed, unit: speedUnits };
                speedToolTipFormatter = function(){
                    return '<b>' + i18['TIME'] + ': '+formatTime(this.x)+'</b><br/><b>'+i18['DISTANCE']+': '+wo.distance[this.key].toFixed(2)+'<span style="font-size:.8em;text-transform:uppercase;font-weight:bold">'+wo.units.distance+'</span></b><br/>'+i18['SPEED']+': '+this.y+'<span style="font-size:.8em;text-transform:uppercase;">'+speedUnits+'</span>';
                };
                createGraph("speed", x, y, "#00ccff", speedToolTipFormatter, chartEvents);
            }
            else
            {
                $("#speed").html("<p>"+i18["No data available."]+"</p>");
            }
        }
        catch(e)
        {
            console.log("Speed Error: " + e);
        }

        //
        // Elevation
        //
        try
        {
            if (wo.elevation.data.length > 0)
            {
                // for some reason, "elevation" (with a trailing "n") can't be used
                elevationUnits = wo.units.elevation.toUpperCase();
                y = { data: wo.elevation.data, min: wo.elevation.min.height, max: wo.elevation.max.height, unit: elevationUnits };
                elevationToolTipFormatter = function(){
                    return '<b>'+i18['TIME']+': '+formatTime(this.x)+'</b><br/><b>'+i18['DISTANCE']+': '+wo.distance[this.key].toFixed(2)+'<span style="font-size:.8em;text-transform:uppercase;font-weight:bold">'+wo.units.distance+'</span></b><br/>'+i18['ELEVATION']+': '+this.y+'<span style="font-size:.8em;text-transform:uppercase;">'+elevationUnits+'</span>';
                };
                createGraph("elevatio", x, y, "#003399", elevationToolTipFormatter, chartEvents);
            }
            else
            {
                $("#elevatio").html("<p>"+i18["No data available."]+"</p>");
            }
        }
        catch(e)
        {
            console.log("Elevation Error: " + e);
        }

        //
        // Heart Rate
        //
        try
        {
            if (wo.heartrate.data.length > 0)
            {
                heartrateUnits = i18['BPM'];//wo.units.hr.toUpperCase();
                y = { data: wo.heartrate.data, min: wo.heartrate.min.value, max: wo.heartrate.max.value, unit: heartrateUnits };
                heartrateToolTipFormatter = function(){
                    return '<b>'+i18['TIME']+': '+formatTime(this.x)+'</b><br/><b>'+i18['DISTANCE']+': '+wo.distance[this.key].toFixed(2)+'<span style="font-size:.8em;text-transform:uppercase;font-weight:bold">'+wo.units.distance+'</span></b><br/>'+i18['HEART RATE']+': '+this.y+'<span style="font-size:.8em;text-transform:uppercase;">'+heartrateUnits+'</span>';
                };
                createGraph("heartrate", x, y, "#ed0011", heartrateToolTipFormatter, chartEvents);
            }
            else
            {
                $("#heartrate").html("<p>"+i18["No data available."]+"</p>");
            }
        }
        catch(e)
        {
            console.log("Heartrate Error: " + e);
        }

        //
        // Cadence / Pace
        //
        try
        {
            if (wo.pace.data.length > 0)
            {
                paceUnits = wo.units.pace.toUpperCase();
                y = { data: wo.pace.data, min: wo.pace.min.pace, max: wo.pace.max.pace, unit: paceUnits };
                paceToolTipFormatter = function(){
                    return '<b>'+i18['TIME']+': '+formatTime(this.x)+'</b><br/><b>'+i18['DISTANCE']+': '+wo.distance[this.key].toFixed(2)+'<span style="font-size:.8em;text-transform:uppercase;font-weight:bold">'+wo.units.distance+'</span></b><br/>'+i18['PACE']+': '+this.y+'<span style="font-size:.8em;text-transform:uppercase;">'+paceUnits+'</span>';
                };
                createGraph("cadence", x, y, "#f0d000", paceToolTipFormatter, chartEvents);
            }
            else
            {
                $("#cadence").html("<p>"+i18["No data available."]+"</p>");
            }
        }
        catch(e)
        {
            console.log("Cadence Error: " + e);
        }
        
        // Map post-setup
        mapPostSetup();
    }
    else
    {
         $("#speed, #elevatio, #heartrate, #cadence").html("<p>API Call Failed.</p><pre>"+msg+"</pre>");
    }
}

//
// Page load
//
$(function(){
    
    "use strict";
    
    loadConfig();
    
    if (config.id !== undefined && config.id !== "")
    {
        mapPreSetup();
        wo = new Workout(config.id);
        wo.getDetails(getTrackCallback);
    }
    
    $("#btn-export").click(function(){
        console.log("TODO: Implement Export button");
        return false;
    });
    
    $("#btn-share").click(function(){
        console.log("TODO: Implement Share button");
        return false;
    });
    
    $("#btn-race-this").click(function(){
        console.log("TODO: Implement Race This button");
        return false;
    });
    
    $("#btn-record").click(function(){
        console.log("TODO: Implement Record button");
        return false;
    });
	
    $(window).bind("orientationchange resize", function() {
        centerWorkoutStats();
    });
    
});

/**
 * 
 * @param String activityName
 */
function addImgClass(activityName)
{
    "use strict";
    
    $('div.c1').removeClass('RUN SWIM CYCLE TREADMILL').addClass(activityName);
}
