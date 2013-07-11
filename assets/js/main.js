/*jslint browser: true, devel: true, passfail: false, nomen: true, plusplus: true, unparam: true, todo: true, white: true */
/*global $, TomTomSiteOffSet*/

/**
 *
 */
function beforePanelMenuOpen() {"use strict";

    $("#logo a").bind("click touchstart", function() {
        return false;
    });
    $(".jPanelMenu, body").removeClass("jPanelForceOverflowVisible").addClass("jPanelForceOverflowHidden");

}

/**
 *
 */
function beforePanelMenuClose() {"use strict";

    $("#jPanelMenu-menu > div > a").removeClass("active");
    $("#jPanelMenu-menu > div.submenuactive").removeClass("submenuactive");
    $("#jPanelMenu-menu ul.active").slideUp();
}

/**
 *
 */
function panelMenuCleanup() {"use strict";

    $("#logo a").unbind();
}

/**
 *
 */
function afterPanelMenuClose() {"use strict";

    setTimeout(panelMenuCleanup, 1000);
    $(".jPanelMenu, body").removeClass("jPanelForceOverflowHidden").addClass("jPanelForceOverflowVisible");
}

/**
 *
 */
function formatDistance(distance) {"use strict";

    var tempDistance, tempArray, remainder;

    tempDistance = distance.toLocaleString();
    tempArray = tempDistance.split(".");
    remainder = (tempArray.length > 1) ? tempArray[1] : "";

    if (remainder.length > 2) {
        remainder = remainder.substring(0, 2);
    }
    return tempArray[0] + "." + remainder;
}

$(function() {"use strict";

    var method, noop, methods, length, console, jPM;

    // Avoid `console` errors in browsers that lack a console.
    noop = function() {
    };
    methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    length = methods.length;
    console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    try {

        // User first name
        $.ajax({
            'async' : true,
            'global' : false,
            'url' : TomTomSiteOffSet + 'user/get_user_first_name',
            'dataType' : "json",
            'success' : function(data) {
                //$('span#fname').html(data.substring(0, 8));
                $('span#fname').html(data).css("overflow", "hidden");
                
                // Main nav, fix width for bold state rollovers
                $("header nav > div").each(function(idx, el){
                    if (!$(el).hasClass("nav-account") && !$(el).hasClass("active")) {
                        $(this).css({ "width": $(this).width(), "overflow": "hidden" });
                        $(this).find("a").css({ "padding-left": 0, "padding-right": 0, "margin": "0 auto"});
                    }
                });
            }
        });

    } catch(ignore) {}

    //
    // jQuery jPanel menu
    //
    if (navigator.appVersion.indexOf("MSIE 8") === -1) {
        jPM = $.jPanelMenu({
            animated : true,
            menu : "#desktopNav",
            beforeOpen : beforePanelMenuOpen,
            beforeClose : beforePanelMenuClose,
            afterClose : afterPanelMenuClose
        });
        jPM.on();
        $(window).bind("orientationchange resize", function() {
            jPM.close();
        });
        $("#jPanelMenu-menu .nav-account > a:first-child").detach().prependTo("#jPanelMenu-menu");
        $("#jPanelMenu-menu .nav-account").removeClass("nav-account").addClass("nav-settings");
        $("#jPanelMenu-menu > div").removeClass("active");
        $("#jPanelMenu-menu > div > a").each(function(idx, el) {
            $(this).removeClass("active");
            var next = $(el).next();
            if (next !== undefined && next.prop("tagName") === "UL") {
                $(el).parent().addClass("submenu");
                $(el).removeAttr("href").click(function() {
                    var isActive = $(this).hasClass("active");
                    beforePanelMenuClose();
                    if (isActive) {
                        $(this).removeClass("active");
                        next.removeClass("active").slideUp();
                    } else {
                        $(this).parent().addClass("submenuactive");
                        $(this).addClass("active");
                        next.addClass("active").slideDown();
                    }
                });
            }
        });
    }

    // Styled radio and checkboxes
    $('input[type="checkbox"], input[type="radio"]').prettyCheckable();

    // Hide the address bar!
    setTimeout(function() {
        window.scrollTo(0, 1);
    }, 0);
	
	$('.tt_button_green').click(function() {
        $(this).css("background-image",'-moz-linear-gradient(top, #617300 0%, #ACC524  100%)');
        $(this).css("background-image",'-webkit-linear-gradient(top, #617300 0%, #ACC524 100%)');
        $(this).css("background-image",'-o-linear-gradient(top, #617300 0%, #ACC524 100%)');
        $(this).css("background-image",'-ms-linear-gradient(top, #617300 0%, #ACC524 100%%)');
        $(this).css("background-image",'linear-gradient(to bottom, #617300 0%, #ACC524  100%)');
	});

});

var matched, browser;
// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
$.uaMatch = function(ua) {"use strict";

    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:[\w\W]*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf("compatible") < 0 && /(mozilla)(?:[\w\W]*? rv:([\w.]+)|)/.exec(ua)) || [];

    return {
        browser : match[1] || "",
        version : match[2] || "0"
    };
};

matched = $.uaMatch(navigator.userAgent);
browser = {};

if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if (browser.chrome) {
    browser.webkit = true;
} else if (browser.webkit) {
    browser.safari = true;
}

$.browser = browser;
