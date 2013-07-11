/*jslint browser: true, devel: true, passfail: false, nomen: true, plusplus: true, unparam: true, todo: true, white: true */
/*global $*/

/**
 * Workout API parser and transfer object for dashboard, activity and overview.
 * @param id String
 * @return this
 */
function Workout(id)
{
    "use strict";
    
    // member vars
    this.id = id;
    this.speed = this.elevation = this.heartrate = this.pace = this.units = this.user = this.workout = this.totalDistance = this.duration = null;
    this.time = [];
    this.path = [];
    this.distance = [];
    this.activityTypeId = -1;
    this.activityName = undefined;
    this.caloriesBurned = 0;
    this.attempts = 0;
    this.activityType = { bike: 11, run: 16, swim1: 20, swim2: 38, treadmill: 25 };
    
    var _workout = this;
    
    /**
     * Parse workout data returned from the get_workout_track API call.
     * @param data JSON
     * @param callback Function
     * @param details JSON (Optional; needed on activity page to determine the activity type.
     */
    this.parseTrack = function(trackData, callback, details)
    {
        var status, root, speedAvg, elevationMin, elevationMax, elevationAvg, paceAvg, i, j, data_points, dp, dpTime, dpDistance, dpSpeed, dpElevation, dpHeartrate, dpPace, ll, msg;
        
        status = false;
        
        if (typeof trackData !== 'string')
        {
            if (!(trackData.result !== undefined && trackData.result.output.task !== undefined))
            {
                root = trackData.result !== undefined ? trackData.result.output : trackData;
                
                _workout.units = root.units;
                _workout.user = root.user;
                _workout.workout = root.workout;
                _workout.duration = (root.workout.duration !== undefined) ? root.workout.duration : 0;
                _workout.totalDistance = root.workout.distance;
                
                // Speed
                speedAvg = (root.workout.speed !== undefined) ? root.workout.speed.avg : 0;
                _workout.speed = { min: { speed: 0, ll: null, distance: 0 }, max: { speed: 0, ll: null, distance: 0 }, avg: speedAvg, units: root.units.speed, data: [] };
                
                // Elevation
                elevationMin = (root.workout.elevation !== undefined) ? root.workout.elevation.min : 0;
                elevationMax = (root.workout.elevation !== undefined) ? root.workout.elevation.max : 0;
                elevationAvg = (root.workout.elevation !== undefined) ? root.workout.elevation.avg : 0;
                _workout.elevation = { min: { height: elevationMin, ll: null, distance: 0 }, max: { height: elevationMax, ll: null, distance: 0 }, avg: elevationAvg, units: root.units.elevation, data: [] };
                
                // Heart rate
                _workout.heartrate = { min: { value: 0, ll: null }, max: { value: 0, ll: null }, avg: 0, data: [] };
                
                // Pace
                paceAvg = (root.workout.pace !== undefined) ? root.workout.pace.avg : 0;
                _workout.pace = { min: { pace: 0, ll: null }, max: { pace: 0, ll: null }, avg: paceAvg, data: [] };
                
                // Laps
                _workout.laps = [];
                
                if (root.workout.hr !== undefined)
                {
                    _workout.heartrate.avg = Math.round(root.workout.hr.avg);
                }
                
                if (root.workout.laps.length > 0)
                {
                    for (i = 0; i < root.workout.laps.length; i++)
                    {
                        data_points = root.workout.laps[i].data_points;
                        
                        if (data_points.length > 0)
                        {
                            for (j = 0; j < data_points.length; j++)
                            {
                                dp = data_points[j];
                                if (dp.latlng !== undefined)
                                {
                                    _workout.laps[i] = dp.latlng;
                                }
                                
                                // Time
                                dpTime = (dp.time !== undefined) ? dp.time : null;
                                _workout.time.push(dpTime);
                                
                                // Distance
                                dpDistance = (dp.distance !== undefined) ? dp.distance : 0;
                                _workout.distance.push(dpDistance);
                                
                                // Latitude/Longitude
                                if (dp.latlng !== undefined)
                                {
                                    ll = [parseFloat(dp.latlng[0]), parseFloat(dp.latlng[1])];
                                    _workout.path.push(ll);
                                }
                                
                                // Speed
                                dpSpeed = (dp.speed !== undefined) ? Math.round(dp.speed) : null;
                                _workout.speed.data.push(dpSpeed);
                                if ((dpSpeed !== null && ll !== undefined) && (dpSpeed > _workout.speed.max.speed || _workout.speed.max.ll === null))
                                {
                                    _workout.speed.max.speed = dpSpeed;
                                    _workout.speed.max.ll = ll;
                                    _workout.speed.max.distance = dpDistance;
                                }
                                if ((dpSpeed !== null && ll !== undefined) && (dpSpeed < _workout.speed.min.speed || _workout.speed.min.ll === null))
                                {
                                    _workout.speed.min.speed = dpSpeed;
                                    _workout.speed.min.ll = ll;
                                    _workout.speed.min.distance = dpDistance;
                                }
                                
                                // Elevation
                                dpElevation = (dp.elevation !== undefined) ? Math.floor(dp.elevation) : null;
                                _workout.elevation.data.push(dpElevation);
                                if ((dpElevation !== null && ll !== undefined) && (dpElevation > _workout.elevation.max.height || _workout.elevation.max.ll === null))
                                {
                                    _workout.elevation.max.height = dpElevation;
                                    _workout.elevation.max.ll = ll;
                                    _workout.elevation.max.distance = dpDistance;
                                }
                                if ((dpElevation !== null && ll !== undefined) && (dpElevation < _workout.elevation.min.height || _workout.elevation.min.ll === null))
                                {
                                    _workout.elevation.min.height = dpElevation;
                                    _workout.elevation.min.ll = ll;
                                    _workout.elevation.min.distance = dpDistance;
                                }
                                
                                // Heartrate
                                dpHeartrate = (dp.hr !== undefined) ? dp.hr : null;
                                _workout.heartrate.data.push(dpHeartrate);
                                if ((dpHeartrate !== null && ll !== undefined) && (dpHeartrate > _workout.heartrate.max.value || _workout.heartrate.max.ll === null))
                                {
                                    _workout.heartrate.max.value = dpHeartrate;
                                    _workout.heartrate.max.ll = ll;
                                }
                                if ((dpHeartrate !== null && ll !== undefined) && (dpHeartrate < _workout.heartrate.min.value || _workout.heartrate.min.ll === null))
                                {
                                    _workout.heartrate.min.value = dpHeartrate;
                                    _workout.heartrate.min.ll = ll;
                                }
                                
                                // Pace
                                dpPace = (dp.pace !== undefined) ? parseFloat(dp.pace.toFixed(2)) : null;
                                _workout.pace.data.push(dpPace);
                                if ((dpPace !== null && ll !== undefined) && (dpPace > _workout.pace.max.pace || _workout.pace.max.ll === null))
                                {
                                    _workout.pace.max.pace = dpPace;
                                    _workout.pace.max.ll = ll;
                                }
                                if ((dpPace !== null && ll !== undefined) && (dpPace < _workout.pace.min.pace || _workout.pace.min.ll === null))
                                {
                                    _workout.pace.min.pace = dpPace;
                                    _workout.pace.min.ll = ll;
                                }
                            }   
                        }
                    }
                }
                
                //
                // Activity ID
                //
                if (details !== undefined)
                {
                    if (details.result !== undefined && details.result.output !== undefined && details.result.output.workout !== undefined) {
                        _workout.activityTypeId = Number(details.result.output.workout.main_activity_type_id);
                        _workout.activityName = details.result.output.workout.activity_name;
                    }
                }
                
                //
                // Formatted Workout Date
                //
                if (details !== undefined) {
                    _workout.workout.formattedDate = details.result.output.workout.workout_date;
                    _workout.workout.totalDistance = details.result.output.workout.distance;
                    _workout.workout.avg_speed = details.result.output.workout.avg_speed;
                    _workout.workout.avg_pace = details.result.output.workout.avg_pace;
                    _workout.workout.avg_speed_format = details.result.output.workout.avg_speed_format;
                    _workout.workout.avg_pace_format = details.result.output.workout.avg_pace_format;
                    _workout.workout.calories_burned = details.result.output.workout.calories_burned;
                    _workout.workout.avg_cadence = details.result.output.workout.avg_cadence;
                    _workout.workout.avg_hr = details.result.output.workout.avg_hr;		
                }
                
                status = true;
             }
        }
        
        if ($.isFunction(callback))
        {
            msg = status ? null : trackData;
            callback.call(this, status, msg);
        }
    };
    
    /**
     * Get workout track information from the API
     * https://api.mapmyfitness.com/workout/0.2/workouts/{id}/track/
     * @param callback Function
     * @param details JSON (Optional; needed on activity page to determine the activity type.
     */
    this.getTrack = function(trackCallback, details)
    {
        if (!$.isFunction(trackCallback) || (this.id === undefined || this.id === null || this.id === "" || typeof this.id !== "string"))
        {
            // No use calling API if nothing will be done with this
            return null;
        }
        
        $.ajax({
            async: true,
            global: false,
            url: "../activity/get_workout_track/" + this.id,
            dataType: "json",
            error: function(jqXHR, textStatus, errorThrown ){
                
                if (++this.attempts <= 3)
                {
                    console.log("tomtom.workout.js: Failed to load workout data");
                    _workout.getTrack(trackCallback, details);
                }
                else
                {
                    this.attempts = 0;
                    if ($.isFunction(trackCallback))
                    {
                        trackCallback.call(this, false, "Failed to load workout data");
                    }
                }
            },
            success: function(trackData, textStatus, jqXHR){
                _workout.parseTrack(trackData, trackCallback, details);
            }
        });
    };
    
    /**
     * Get workout meta information from the API (needed prior to calling getTrack on activity details page.
     * @param callback Function
     */
    this.getDetails = function(detailsCallback)
    {
        if (!$.isFunction(detailsCallback) || (this.id === undefined || this.id === null || this.id === "" || typeof this.id !== "string"))
        {
            // No use calling API if nothing will be done with this
            return null;
        }
        
        $.ajax({
            async: true,
            global: false,
            url: "../activity/get_workout/" + this.id,
            dataType: "json",
            error: function(jqXHR, textStatus, errorThrown ){
                
                if (++this.attempts <= 3)
                {
                    console.log("tomtom.workout.js: Failed to load workout details");
                    _workout.getDetails(detailsCallback);
                }
                else
                {
                    _workout.attempts = 0;
                    if ($.isFunction(detailsCallback))
                    {
                        detailsCallback.call(_workout, false, "Failed to load workout details");
                    }
                }
            },
            success: function(detailsData, textStatus, jqXHR){
                _workout.getTrack(detailsCallback, detailsData);
            }
        });
    };

    return this;
}
