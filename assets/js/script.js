$(function(){
	$("#forgot-password").dialog({
    	autoOpen: false,
    	modal: true,
    	show: 500,
    	hide: 500,
		width: 240,
    	title: "FORGOT PASSWORD?",
    	draggable: false,
    	open: function(event, ui) {
    		$("#forgotPasswordText").focus();
            $(".ui-widget-overlay, .dialog .btn-close").bind("click", function(){
                $("#forgot-password").dialog("close");
            });
            $(this).parent().addClass("forgot-password");
    	},
    	close: function(event, ui){
    	    $(".ui-widget-overlay, .dialog .btn-close").unbind();
    	},
    	buttons: [ { text: "RETRIEVE PASSWORD", click: function() { $( this ).dialog( "close" ); } } ]
    });
	$('#language_id').dropkick({
		startSpeed: 0,
		change: function (value, label) 
		{
			$("#languageForm").attr("action", $("#languageForm").attr("action") + "?language_id=" + value).submit();
		}
	});
	$('#measurement_unit').dropkick({
		startSpeed: 0,
		change: function (value, label) 
		{
			
			//weight unit label
			if (value == 'english' || value == 'hybrid_km/lbs') {
				$("#weight_unit").text('lbs');
			} else {				
				$("#weight_unit").text('kg');
			}
			
			//convert weight		
			var weight_conv = 0;	
			if(($("#measurement_unit_current").val() == 'english' || $("#measurement_unit_current").val() == 'hybrid_km/lbs')
				&& (value == 'metric' || value == 'hybrid_mi/kg'))  {	
				if (isNumber($("#weight").val())) {
					weight_conv = lb2kg($("#weight").val()).toFixed();
				}
				$("#weight").val(weight_conv);	
			} else if(($("#measurement_unit_current").val() == 'metric' || $("#measurement_unit_current").val() == 'hybrid_mi/kg')
				&& (value == 'english' || value == 'hybrid_km/lbs'))  {
				if (isNumber($("#weight").val())) {
					weight_conv = kg2lb($("#weight").val()).toFixed();
				}
				$("#weight").val(weight_conv);	
			}

			//height unit labels
			if (value == 'english' || value == 'hybrid_mi/kg') {
				$("#height_part1_unit").text('ft');
				$("#height_part2_unit").text('in');
				$("#height_part2_unit").show();
			} else {				
				$("#height_part1_unit").text('cm');
				$("#height_part2_unit").hide();
			}
			
			//convert height	
			var height_parts = 0;
			var height_conv = 0;	
			var height_part1_conv = 0;	
			var height_part2_conv = 0;	
			if(($("#measurement_unit_current").val() == 'english' || $("#measurement_unit_current").val() == 'hybrid_mi/kg')
				&& (value == 'metric' || value == 'hybrid_km/lbs'))  {	
				if (isNumber($("#height_part1").val())) {
					height_parts = $("#height_part1").val() * 12;
				}
				if (isNumber($("#height_part2").val())) {
					height_parts = Number(height_parts) + Number($("#height_part2").val());
				}
				height_conv = in2cm(height_parts);	
				$("#height_part1").val(height_conv.toFixed());	
				$("#height_part2").val('0');	
				$("#height_part2").hide();
			} else if(($("#measurement_unit_current").val() == 'metric' || $("#measurement_unit_current").val() == 'hybrid_km/lbs')
				&& (value == 'english' || value == 'hybrid_mi/kg'))  {	
				if (isNumber($("#height_part1").val())) {
					height_conv = cm2in($("#height_part1").val());
				}	
				height_part1_conv = Math.floor(height_conv/12);
				height_part2_conv = (height_conv - (height_part1_conv * 12)).toFixed();  
				$("#height_part1").val(height_part1_conv);
				$("#height_part2").val(height_part2_conv);		
				$("#height_part2").show();
			}

		$("#measurement_unit_current").val(value);	
		}
	});
	$('.pretty').dropkick({startSpeed: 0});
	
});

function forgotPassword()
{
	$("#forgot-password").dialog("open");
}

// Can be represented by jQuery with $.isNumeric(x)
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function lb2kg(lb) { 
	var ratio = .45359237; 
	var kg = lb * ratio;
	return kg; 
}
function kg2lb(kg) { 
	var ratio = .45359237; 
	var lb = kg / ratio;
	return lb; 
}
function in2cm(inch) { 
	var ratio = 2.54; 
	var cm = inch * ratio;
	return cm; 
}
function cm2in(cm) { 
	var ratio = 0.3937; 
	var inch = cm * ratio;
	return inch; 
}
function m2ft(meters) { 
	var ratio = 3.28084; 
	var feet = meters * ratio;
	return feet; 
}

/**
 * 
 */
function centerWorkoutStats()
{
    "use strict";
    
    var statItemWidth, statMarginLeft, statSpanWidth;
    
    $(".workout-stats h3").each( function () {
        statItemWidth = 0;
		if ($(this).parents().hasClass('dashboardlayout')){
			if ($(this).parent().width() < 350){
				statItemWidth = ($(this).parent().width() * 0.34);
			} else if ($(this).parent().width() == 390){
				statItemWidth = ($(this).parent().width() * 0.365);
			} else if ($(this).parent().width() == 453){
				statItemWidth = ($(this).parent().width() * 0.385);
			} else if ($(this).parent().width() < 475){
				statItemWidth = ($(this).parent().width() * 0.35);
			} else if ($(this).parent().width() < 600 && $('div.c1').hasClass('CYCLE')){
				statItemWidth = ($(this).parent().width() * 0.16);
			} else if ($('div.c1').hasClass('CYCLE')){
				statItemWidth = ($(this).parent().width() * 0.16);
			} else {
				statItemWidth = ($(this).parent().width() * 0.24);
			}
		} else {
			if ($(this).parent().width() < 450 && $(this).is('#img-elevationgain') && $('div.c1').hasClass('CYCLE')){
				statItemWidth = ($(this).parent().width() * .85);
			} else if ($(this).parent().width() < 450){
				statItemWidth = ($(this).parent().width() * 0.35);
			} else if ($(this).parent().width() < 700 && $(this).is('#img-elevationgain') && $('div.c1').hasClass('CYCLE')){
				statItemWidth = ($(this).parent().width() * .85);
			} else if ($(this).parent().width() < 700){
				statItemWidth = ($(this).parent().width() * 0.4);
			} else if ($('div.c1').hasClass('CYCLE')){
				statItemWidth = ($(this).parent().width() * 0.15);
			} else {
				statItemWidth = ($(this).parent().width() * 0.2);
			}
		}
        statMarginLeft = 0;
        statSpanWidth = 0;
        $("span", this).each( function () {
            if ($(this).width() > statSpanWidth) {
                statSpanWidth = $(this).width();
            }
        });
        statMarginLeft = (statItemWidth-statSpanWidth)/2;
		if (statMarginLeft < 2) statMarginLeft = 2;
        $(this).css("margin-left",statMarginLeft);
        $(this).css("width",(statItemWidth-statMarginLeft));
		//console.log(' parent ' + $(this).attr('id') + ' width: ' + $(this).parent().width() + ' h3 width: ' + (statItemWidth-statMarginLeft)/$(this).parent().width());
    });
   
}