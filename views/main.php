<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
	<title><?php echo $title; ?></title>
        <meta name="description" content="<?php echo $meta_description;?>">
		<meta name="keywords" content="<?php echo $meta_keywords;?>">
		<meta name="language" content="<?php echo I18n::$lang;?>">
        <meta name="viewport" content="width=device-width"> 

		<?php echo HTML::style('assets/css/normalize.css'); ?>
		<?php echo HTML::style('assets/css/main.css?' . gmdate('Ymd')); ?>
		<?php echo HTML::style('assets/fonts/gibson.css',array('assets' => 'screen'), FALSE);  ?>
		<?php echo HTML::style('assets/css/leaflet-0.5.1.css');  ?>
         <!--[if lte IE 8]>
             <?php echo HTML::style('assets/css/leaflet.ie.css');  ?>
         <![endif]-->
		<?php echo HTML::style('assets/css/tomtom.tabs.css?' . gmdate('Ymd'),array('assets' => 'screen'), FALSE);  ?>
		
		<?php foreach($styles as $src => $type): ?>
			<link assets="<?php echo $type; ?>" href="<?php echo $src; ?>" type="text/css" rel="stylesheet" /><?php endforeach; ?>

        <script type="text/javascript">
			var TomTomSiteOffSet = '<?php echo URL::site('/') ?>';
			var TomTomLang = '<?php echo I18n::lang(); ?>';
		</script>
        <?php echo HTML::script('assets/js/vendor/modernizr-2.6.2.min.js'); ?>
		<?php echo HTML::script('assets/js/jquery-1.9.1.min.js'); ?>
		<?php echo HTML::script('assets/js/highcharts.js'); ?>
		<?php echo HTML::script('assets/js/jquery.jpanelmenu.min.js'); ?>
        <?php echo HTML::script('assets/js/prettyCheckable.js'); ?>
		<?php echo HTML::script('assets/js/main.js?' . gmdate('Ymd'));  ?>  
		<?php echo HTML::script('assets/js/jquery-ui-1.10.2.custom.min.js', null, FALSE);  ?>
		<?php echo HTML::script('assets/js/jquery.dropkick-1.0.0.min.js', null, FALSE);  ?>
		<?php echo HTML::script('assets/js/script.js?' . gmdate('Ymd'), null, FALSE);  ?>
        <?php echo HTML::script('assets/js/tomtom.tabs.js?' . gmdate('Ymd'), null, FALSE);  ?>
		<?php foreach($scripts as $src => $type): ?>
			<script type="text/javascript" src="<?php echo $src; ?>"></script><?php endforeach; ?>	
    
       <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
       <!-- or -->
		<link rel="shortcut Icon" href="/assets/images/favicon.ico" type="image/x-icon" />
		<link rel="apple-touch-icon" type="image" width="57" height="57" href="/assets/images/apple-touch-icon-57x57.png" />
		<link rel="apple-touch-icon" type="image" width="72" height="72" href="/assets/images/apple-touch-icon-72x72.png" />
		<link rel="apple-touch-icon" type="image" width="120" height="120" href="/assets/images/apple-touch-icon-120x120.png" />
    </head>
    <body class="<?php echo implode(" ", $bodyClasses); ?>">
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
			
		<div id="outercontainer">
			<div id="container">			
				<div id="page">		
					<ion:partial view="header" />
                                        <!--<ion:partial view="tomtom_header" />-->
					<div class="clearfix">	
						<ion:articles>
                                                    <ion:content />
                                                </ion:articles>
					</div>
					<!--<ion:partial view="tomtomfooter" />-->
				</div>
			</div>
		</div>
<!-- START OF SmartSource Data Collector TAG v10.2.91 -->
<!-- Copyright (c) 2013 Webtrends Inc.  All rights reserved. -->
<script>
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid:"dcs8ld60kvz5bd7q2p04wyec6_8s3x",
        domain:"statse.webtrendslive.com",
        timezone:0,
        i18n:true,
        download:true,
        downloadtypes:"xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip",
        fpcdom:".tomtom.com",
        plugins:{
            hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="<?php echo URL::base(TRUE,TRUE);?>assets/js/webtrends.min.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());
</script>
<noscript><img alt="dcsimg" id="dcsimg" width="1" height="1" src="//statse.webtrendslive.com/dcs8ld60kvz5bd7q2p04wyec6_8s3x/njs.gif?dcsuri=/nojavascript&amp;WT.js=No&amp;WT.tv=10.2.91&amp;dcssip=www.tomtom.com"/></noscript>
<!-- END OF SmartSource Data Collector TAG v10.2.91 -->

		
	</body>
</html>