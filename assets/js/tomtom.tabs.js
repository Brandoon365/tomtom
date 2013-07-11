/*jslint browser: true, devel: true, passfail: false, nomen: true, plusplus: true, unparam: true, todo: true, white: true */
/*global $, jQuery*/

(function($) {

    "use strict";

    var defaults, options, slider, direction, track, workoutData, methods,  leftButton, rightButton, content, attempts, locked, cache;

    defaults = {
        speed: 1000,
        total: 0,
        pageSize: 6,
        tileSize: 100,
        startIndex: 0,
        currentIndex: 0,
        onSelectionChanged: null,
        onLoadComplete: null,
        formatString: "{0}",
        url: undefined,
        mode: "dashboard"
    };

    direction = { LEFT: -1, RIGHT: 1, RESIZE: 0, NUDGE: 2 };
    workoutData = [];
    locked = false;
    attempts = 0;
    cache = [];

    //
    // Private methods
    //
    
    /**
     * 
     */
    function parseDashboardItems(json, workoutIds, initialLoad)
    {
        var workoutcount, workouts, workout, i, id, firstWorkout;

        workoutcount = parseInt(json.result.output.count, 10);
        workouts = json.result.output.workouts;
        
        if (initialLoad)
        {
            options.total = workoutcount;
            $.each(workouts, function(idx, workout)
            {
                workoutData[idx] = workout;
                methods.add({ name: [workout.activity_name_il8n, workout.workout_date], id: idx, state: "loaded" });
            });
            
            if (workoutcount > workouts.length) {
                // Add placeholders to the slider track
                for (i = workouts.length; i < workoutcount; i++) {
                    methods.add({ name: "", id: i, state: "loading" });
                }
            }

            track.css("width", (options.total * options.tileSize) + "px");
            track.find('div').bind("click", function(evt)
            {
                var target = (evt.target.nodeName.toLowerCase() === "div") ? evt.target : $(evt.target).parent();
                
                if (!$(target).hasClass("selected") && !locked) {
                    methods.select(target);
                    id = parseInt($(target).data('id'), 10);
                    // Present the selected workout
                    if ($.isFunction(options.onSelectionChanged)) {
                        locked = true;
                        options.onSelectionChanged.call(this, workoutData[id]);
                    }
                }
            });

            // Present the first workout
            firstWorkout = (workoutcount > 0) ? workoutData[0] : { error: 0 };
            track.find("div:first-child").trigger("click");
            
            // Call onLoadComplete handler
            if ($.isFunction(options.onLoadComplete)) {
                options.onLoadComplete.call(this, json);
            }
            
         }
         else
        {
            for (i = 0; i < workoutIds.length; i++) {
                workout = workouts[i];
                if (workout !== undefined) {
                    workoutData[workoutIds[i]] = workout;
                    methods.update({ id: workoutIds[i], name: [workout.activity_name_il8n, workout.workout_date] });
                }
            }
         }
    }

    /**
     * 
     * @param initialLoad Boolean
     */
    function loadContent(initialLoad)
    {
        var url, workoutIds;
        
        if (options.url === undefined) {
            return;
        }
        url = options.url;
        workoutIds = [];

        if (initialLoad === false) {

            track.find("div").each(function(idx, el){
                if (idx >= options.currentIndex && idx < options.currentIndex + options.pageSize) {
                    if ($(el).hasClass("loading"))
                    {
                        var id = parseInt($(el).data('id'), 10);
                        workoutIds.push(id);
                    }
                }
            });

            if (workoutIds.length > 0) {
                url += "/" + workoutIds[0];
            }
        }
        
        if (cache[url] !== undefined) {
            switch (options.mode) {
                case "dashboard": parseDashboardItems(cache[url], workoutIds, initialLoad); break;
            }
        } else {
            $.ajax({
                'async': true,
                'global': false,
                'url': url,
                'dataType': "json",
                'error': function(jqXHR, textStatus, errorThrown)
                {
                    if (++attempts <= 3) {
                        console.log("tomtom.tabs: Failed to load workout data");
                        console.log("textStatus: " + textStatus + "\nerrorThrown: " + errorThrown + "\njqXHR:\n"+jqXHR);
                        loadContent(true);
                    } else {
                        if ($.isFunction(options.onLoadComplete)) {
                            options.onLoadComplete.call(this, { error: -1 });
                        }
                    }
                },
                'success': function(json, status, jqXHR)
                {
                    cache[url] = json;
                    switch (options.mode) {
                        case "dashboard": parseDashboardItems(json, workoutIds, initialLoad); break;
                        //case "overview": parseOverviewItems(json, workoutIds, initialLoad); break;
                    }
                }
            });
        }
    }

    /**
     * 
     */
    function slideAnimationBegin()
    {
        locked = true;
    }

    /**
     * 
     * @param obj
     */
    function slideAnimationComplete()
    {
        locked = false;
        loadContent(false);
    }
    
    /**
     * 
     */
    function resize()
    {
        var parentWidth = slider.parent().width();
        slider.width(parentWidth);
        content.width(parentWidth - 40);
    }

    /**
     * 
     * @param dir
     * @param amount
     */
    function scrollContent(dir, amount) {

        var contentWidth, numberOfTilesToScroll, animationSpeed, scrollBy, margin, isAtBeginning, isAtEnd;
        
        if (locked) {
            return;
        }
        
        locked = true;
        contentWidth = content.width();
        numberOfTilesToScroll = Math.floor((contentWidth / options.tileSize));
        animationSpeed = (dir === direction.RESIZE) ? 0 : options.speed;
        
        isAtBeginning = (dir === direction.LEFT && options.currentIndex <= 0) ? true : false;
        isAtEnd = (dir === direction.RIGHT && (options.currentIndex >= (options.total - numberOfTilesToScroll) || options.total <= numberOfTilesToScroll)) ? true : false;

        if (isAtBeginning || isAtEnd) {
        	// At the beginning or end
        	locked = false;
            return;
        }

        switch (dir) {

            // LEFT BUTTON
            case direction.LEFT:

                scrollBy = options.currentIndex - numberOfTilesToScroll;
                
				if (scrollBy < 0) {
					scrollBy = 0;
				}

                break;

            // RIGHT BUTTON
            case direction.RIGHT:

				scrollBy = options.currentIndex + numberOfTilesToScroll;

				// Adjust scroll if numberOfTilesToScroll is too many
				if (scrollBy > options.total - numberOfTilesToScroll) {
					scrollBy = options.total - numberOfTilesToScroll;
				}

                break;

            // RESIZE EVENT
            case direction.RESIZE:
				
				if (options.total - options.currentIndex < numberOfTilesToScroll) {
					options.currentIndex = numberOfTilesToScroll - (options.total - options.currentIndex);
				}

                break;
        }
		
		if (dir !== direction.RESIZE && dir !== direction.NUDGE) {
            options.currentIndex = scrollBy;
        }
		
		if (dir === direction.NUDGE)
		{
		    var trackMarginLeft = Number(track.css("margin-left").replace("px", ""));
		    margin = trackMarginLeft += amount;
		}
		else if (((options.total - options.currentIndex) * options.tileSize) < contentWidth)
		{
            // Adjust scroll to make sure the last item is flush with the right button
			margin = (track.width() - contentWidth) * -1;
		}
		else
		{
			margin = (options.currentIndex * options.tileSize) * -1;
		}
		
        slideAnimationBegin();
        track.animate({"margin-left":margin + "px"}, animationSpeed, null, function(){ slideAnimationComplete(); });
    }

    /**
     * 
     * @param el
     */
    function selectContent(el)
    {
        var tilePosition, contentPosition, scrollAmount;
        
        $(".tomtomtabs .content .track > div").removeClass("selected");
        if (el !== undefined) {
            $(el).addClass("selected");
        } else {
            $(slider).find(".content .track > div:first-child").addClass("selected");
        }
       
       tilePosition = $(el).position();
       contentPosition = content.position();

        // Far right, last object
        if (tilePosition.left + options.tileSize > contentPosition.left + content.width()) {
            // Need to scroll the content pane left to show last object completely
            scrollAmount = (contentPosition.left + content.width()) - (tilePosition.left + options.tileSize);
            scrollContent(direction.NUDGE, scrollAmount);
        }
        
        // Far left, first object
        if (tilePosition.left < contentPosition.left) {
            // Need to scroll the content pane right to show first object completely
            scrollAmount = contentPosition.left - tilePosition.left;
            scrollContent(direction.NUDGE, scrollAmount);
        }
    }
    
    /**
     * 
     * @param name
     */
    function formatDisplayName(name)
    {
        var i, displayName;
        displayName = options.formatString;
        if ($.isArray(name)) {
            for (i = 0; i < name.length; i++) {
                displayName = displayName.replace("{"+i+"}", name[i]);
            }
        } else {
             displayName = (name === "") ? name : displayName.replace("{0}", name);
        }
        return displayName;
    }

    methods = {

        //
        // init
        //
        init : function(incomingOptions) {

            options = $.extend(defaults, incomingOptions);

            // Iterate and reformat each matched element.
            return this.each(function() {

                slider = $(this);

                // Left button
                leftButton = $('<div class="button left-button">&nbsp;</div>').bind("click", function() {
                    scrollContent(direction.LEFT);
                });
                slider.append(leftButton);

                // Content
                content = $('<div class="content"</div>');
                slider.append(content);
                track = $('<div class="track"></div>');
                content.append(track);

                // Right button
                rightButton = $('<div class="button right-button">&nbsp;</div>').bind("click", function()
                {
                    scrollContent(direction.RIGHT);
                });
                slider.append(rightButton);
                
                resize();

				$(window).bind('resize', function(evt) {
					scrollContent(direction.RESIZE);
					resize();
				});

                loadContent(true);
            });
        },

        //
        // add
        //
        add : function(param) {
            
            var displayName, el;
            displayName = formatDisplayName(param.name);
            el = $('<div class="' + param.state + '" data-id="' + param.id + '">' + displayName + '</div>');
            track.append(el);
        },
        
        addAll : function(timespan, labels) {
            var i;
            options.total = labels.length;
            track.children().remove();
            for (i = 0; i < labels.length; i++) {
                methods.add({ name: labels[i], id: labels[i], state: "loaded" });
            }
            
            // Post-setup
            track.css("width", (options.total * options.tileSize) + "px");
            track.find('div').bind("click", function(evt)
            {
                var target, id;
                target = (evt.target.nodeName.toLowerCase() === "div") ? evt.target : $(evt.target).parent();
                
                if (!$(target).hasClass("selected") && !locked) {
                    methods.select(target);
                    
                    id = parseInt($(target).data('id'), 10);
                    // Present the selected workout
                    if ($.isFunction(options.onSelectionChanged)) {
                        locked = true;
                        options.onSelectionChanged.call(this, timespan,  id);
                    }
                    
                }
            });
            
            // Present the first workout
            track.find("div:first-child").trigger("click");
            
        },

        //
        // update
        //
        update : function(param) {
            var workout, displayName;
            workout = track.find("div[data-id='" + param.id + "']");
            if (workout.length > 0)
            {
                displayName = formatDisplayName(param.name);
                $(workout)
                    .removeClass("loading")
                    .addClass("loaded")
                    .html(displayName);
            }
        },

       //
       // select
       //
       select : function(element) {
           if (!locked) {
               selectContent(element);
           }
       },
       
       //
       // pageUpdateComplete
       //
       pageUpdateComplete : function() {
           locked = false;
       }
    };

    // Plugin definition
    $.fn.tomtomtabs = function( method ) {

        var plugin;

        if ( methods[method] )
        {
            plugin = methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === 'object' || ! method )
        {
            // Default to "init"
            plugin = methods.init.apply( this, arguments );
        }
        else
        {
            $.error( 'Method "' +  method + '" does not exist on jQuery.tomtomtabs' );
        }

        return plugin;
    };

}(jQuery));
