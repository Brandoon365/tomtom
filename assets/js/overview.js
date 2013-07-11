/*jslint browser: true, devel: true, nomen: true, plusplus: true, unparam: true, todo: true, white: true */
/*global $, jQuery, console, L, TomTomSiteOffSet, createBar, formatTime*/

var map, layers, coordinates, activityType, displayType, chart, wo, currentLocation, stats, attempts, tabs, chart;
var startDate = new Date();
attempts = 0;
activityType = { run: 16, cycle: 11, swim1: 20, swim2: 38, treadmill: 25 };
displayType = { map: 0, chart: 1, none: 2 };
stats = {
            lifetime: { url: TomTomSiteOffSet + "user/get_aggregate_stats/year", data: null, name: "lifetime", labels: null },
            year: { url: TomTomSiteOffSet + "user/get_aggregate_stats/month", data: null, name: "year", labels: null },
            month: { url: TomTomSiteOffSet + "user/get_aggregate_stats/week", data: null, name: "month", labels: null },
            selected: "lifetime"
};

/**
 * 
 */
function parseStats(statName, json)
{
    "use strict";
    var statsResponse, i, start, year;
    
    if (stats[statName].data === null) {
        statsResponse = json._embedded.stats;
        stats[statName].data = statsResponse;
        stats[statName].labels = [];
        for (i = 0; i < statsResponse.length; i++) {
            start = statsResponse[i].aggregate_period.start;
            year = Number(start.split("-")[0]);
            if (stats[statName].labels.indexOf(year) === -1) {
                stats[statName].labels.push(year);
            }
        }
        stats[statName].labels.sort();
    }
    
    $(".tomtomtabs").tomtomtabs("addAll", statName, stats[statName].labels);
}

/**
 * 
 */
function loadStats(statName)
{
    "use strict";
    //console.log("loadStats(" + statName + ")");
    var url;
    
    if (stats[statName].data !== null) {
        $(".tomtomtabs").tomtomtabs("pageUpdateComplete");
        return stats[statName].data;
    }
    
    switch (statName)
    {
        case "lifetime": url = stats.lifetime.url; break;
        case "year": url = stats.year.url; break;
        case "month": url = stats.month.url; break;
    }
    
    if (url === undefined) {
        return null;
    }
    
    $.ajax({
        'async': true,
        'global': false,
        'url': url,
        'dataType': "json",
        'error': function(jqXHR, textStatus, errorThrown)
        {
            if (++attempts <= 3) {
                console.log("tomtom.tabs: Failed to load overview stats data");
                console.log("textStatus: " + textStatus + "\nerrorThrown: " + errorThrown + "\njqXHR:\n"+jqXHR);
                //loadContent(true);
            }
        },
        'success': function(json, status, jqXHR)
        {
            parseStats(statName, json);
        },
        "complete": function(jqXHR, textStatus){
            $(".tomtomtabs").tomtomtabs("pageUpdateComplete");
        }
    });
    return null;
}

/**
 * 
 * @param statName String [lifetime, year, month]
 * @param data2 Number Currently the year to filter on
 */
function presentWorkout(statName, data2)
{
    "use strict";
    var totalsForYear, distance, duration, burned, speed, rate, i, woByYear, yearArray, currentStatYear, currentStatMonth, toolTipFormatter, time;
    //console.log("presentWorkout("+statName+", "+data2+")");
    
    if (stats[statName].data !== null) {
        
        totalsForYear = [];
        
        distance = 0;
        duration = 0;
        burned = 0;
        speed = 0;
        rate = 0;
        
        for (i = 0; i < stats[statName].data.length; i++) {
            currentStatYear = Number(stats[statName].data[i].aggregate_period.start.split("-")[0]);
            if (currentStatYear === data2) {
                
                distance += stats[statName].data[i].distance.value;
                duration += stats[statName].data[i].duration.value;
                // calories burned ???
                speed += stats[statName].data[i].avg_speed.value;
                // heart rate ???
            }
        }
        speed = speed / stats[statName].data.length;
        
        //$("span#distance").html(distance.toFixed(2));
        $("span#distance").html(formatDistance(distance));
        
        time = formatTime(duration).split(":");
        $("span#durationTimeHour").html(time[0]);
        $("span#durationTimeMin").html(time[1]);
        $("span#durationTimeSec").html(time[2]);
        $("#img-speed span#speed").html(speed.toFixed(2));
        
        
        
        
        
        
        //
        // TEMPORARY CHART DATA
        //
        if (statName === "year") {
            woByYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < stats[statName].data.length; i++) {
                yearArray = stats[statName].data[i].aggregate_period.start.split("-");
                currentStatYear = Number(yearArray[0]);
                if (currentStatYear === data2) {
                    
                    currentStatMonth = Number(yearArray[1]);
                    
                    //if (woByYear[currentStatMonth] === undefined) {
                    //    woByYear[currentStatMonth] = 0;
                    //}
                    woByYear[currentStatMonth] += stats[statName].data[i].distance.value;
                }
            }
            
            
            if (chart) {
                chart.destroy();
            }
            
            toolTipFormatter = function(){
                return '<b>'+formatDistance(this.y)+'<span style="font-size:.8em;text-transform:uppercase;"> KM</span>';
            };
            
            chart = createBar(woByYear, toolTipFormatter);
            
        }
        
        
        
        
        
        
        
        
        
    }
}

/**
 * 
 * @param {Object} data
 */
function onLoadComplete(stats2, years)
{
    "use strict";
    console.log("onLoadComplete("+stats2+","+years+")");
    stats = stats2;
}

$(function(){
    
    "use strict";
    
    $("#activitytotalsID").click(function(){
		$('.activitytotals').toggle();
		$('.activityaverages').toggle();
        return false;
    });
    
    $("#activityaveragesID").click(function(){
		$('.activitytotals').toggle();
		$('.activityaverages').toggle();
        return false;
    });
    
    $(".activity-stat").click(function(){
		$('.activity-stat').removeClass('active');
		$(this).addClass('active');
		$('.activity-stat h3').css("border-top","1px solid #e5e5e5");
		$(this).next("div").children().css("border","none");
        return false;
    });
	
	$(".activity-stat").each( function () {
		if($(this).hasClass('active')){
			$(this).next("div").children().css("border","none");
		} 
	});
    
    tabs = $(".tomtomtabs").tomtomtabs({
        onSelectionChanged: function(foo, workoutdata){
            presentWorkout(stats.selected, workoutdata);
        },
        onLoadComplete: function(stats, years){
            onLoadComplete(stats, years);
        },
        mode: "overview",
        formatString: "<span class=\"date\">{0}</span>"
        //url: TomTomSiteOffSet + "/user/get_aggregate_stats/year"
        //url: TomTomSiteOffSet + "/media/js/get_aggregate_stats-year.json"
        
    });
    loadStats("lifetime");
    chart = createBar([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null);
    
    $("input[name='timespan']").change(function(evt){
        var statName, timespanStats;
        statName = $(evt.target).val();
        stats.selected = statName;
        timespanStats = loadStats(statName);
        if (timespanStats !== null) {
            parseStats(statName, timespanStats);
        }
    });
});
