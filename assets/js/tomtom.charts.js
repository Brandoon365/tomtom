/*jslint browser: true, devel: true, nomen: true, plusplus: true, unparam: true, todo: true, white: true */
/*global $, jQuery, HighCharts, i18*/

/**
 * Formatter function for the Highchart's X-axis labels
 * @param value String
 * @return String
 */
function formatTime(value)
{
    "use strict";
    var totalSeconds, asdf
    asdf = parseFloat(value);
    totalSeconds = Math.floor(asdf);
    
    var seconds = Math.floor(totalSeconds % 60);
    var minutes = Math.floor((totalSeconds / 60) % 60);
    var hours = Math.floor(totalSeconds / 3600);
    
    if (seconds < 10) { seconds = "0" + seconds; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (hours < 10) { hours = "0" + hours; }
    
    return hours + ":" + minutes + ":" + seconds;
}

/**
 * 
 * @param container String
 * @param xAxis Object { data: [], min: #, max: #, unit: "" }
 * @param yAxis Object { data: [], min: #, max: #, unit: "" }
 * @param color String
 * @param ttFormatter Function
 * @param events Object
 */
function createGraph(container, xAxis, yAxis, color, ttFormatter, events)
{
    "use strict";
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: container,
            height: 200,
            type: "area",
            zoomType: "x",
            className: container
        },
        title: {
            text: null
        },
        //
        // X AXIS: Time
        //
        xAxis: {
            tickWidth: 0,
            lineColor: "#ffffff",
            title: {
                text: null
            },
            labels: {
                x: 25,
                y: 20,
                formatter: function(){
                    return formatTime(this.value);
                }
            }
        },
        //
        // Y AXIS: User Data
        //
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: null
            },
                min: yAxis.min,
                max: yAxis.max,
            labels: {
                formatter: function(){
                    var value = Math.floor(parseFloat(this.value));
                    if (yAxis.unit !== null) {
                        value += " " + yAxis.unit;
                    }
                    return value;
                }
            }
        },
        //
        // PLOT OPTIONS
        //
        plotOptions: {
            area: {
                point: {
                    events: events
                }
            },
            series: {
                fillOpacity: 0.1,
                lineWidth: 2,
                color: color
            }
        },
        //
        // CREDITS
        //
        credits: {
            enabled: false
        },
        //
        // LEGEND
        //
        legend: {
            enabled: false
        },
        //
        // SERIES
        //
        series: [{
            data: yAxis.data,
            name: container
        }],
        tooltip: {
            formatter: ttFormatter
        }
    });
    return chart;
}

function createBar(data, ttFormatter)
{
    var overviewchart = new Highcharts.Chart({
        chart: {
            renderTo: "overview-chart",
            height: 320,
            type: "column"
        },
        colors: ["#424542", "#00cccc"],
        title: {
            text: null
        },
        //
        // X AXIS: Time
        //
        xAxis: {
            tickWidth: 0,
            lineColor: "#ffffff",
            title: {
                text: null
            },
            categories: [i18["JAN"], i18["FEB"], i18["MAR"], i18["APRIL"], i18["MAY"], i18["JUNE"], i18["JULY"], i18["AUG"], i18["SEPT"], i18["OCT"], i18["NOV"], i18["DEC"]]
        },
        //
        // Y AXIS: User Data
        //
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
            //min: yAxis.min,
            //max: yAxis.max,
            //labels: {
            //    formatter: function(){
            //        var value = Math.floor(parseFloat(this.value));
            //        if (yAxis.unit !== null) {
            //            value += " " + yAxis.unit;
            //        }
            //        return value;
            //    }
            //}
        },
        //
        // PLOT OPTIONS
        //
        plotOptions: {
            //area: {
            //    point: {
            //        events: events
            //    }
            //},
            //series: {
            //    fillOpacity: 0.1,
            //    lineWidth: 2,
            //    color: color
            //}
        },
        //
        // CREDITS
        //
        credits: {
            enabled: false
        },
        //
        // LEGEND
        //
        legend: {
            enabled: false
        },
        //
        // SERIES
        //
        series: [{
            data: data
        }],
        tooltip: {
            formatter: ttFormatter
        }
    });
    return chart;
}