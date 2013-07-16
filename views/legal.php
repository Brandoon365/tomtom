<head>
    <!-- The "style.css" file will be located in /themes/my_theme/assets/css/ -->
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/css/content.css" />
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/css/normalize.css" />
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/css/main.css" />
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/fonts/gibson.css" />
    
</head>
<body>
<div class="cmslayout clearfix">

<ion:partial view="header" />
<h1 class="center"><span class="underline"><ion:lang key="legal_information" /></span></h1>
<div class="legal-list">
	<div class="first">
		 <h3><ion:lang key="limited_warranty" /></h3>
		 <br />
		 <p><ion:lang key="warranty_description" /></p>
		 <p><a href="http://www.<ion:lang key="warranty_link" />"><ion:lang key="more_information" /></a></p>
	</div>
	<div>
		 <h3><ion:lang key="eula" /></h3>
		 <br />
		 <p><ion:lang key="eula_description" /></p>
		 <p><a href="http://www.<ion:lang key="eula_link" />"><ion:lang key="more_information" /></a></p>
	</div>
	<div>
		 <h3><ion:lang key="terms_and_conditions" /></h3>
		 <p><ion:lang key="terms_description" /></p>
		 <p><a href="http://www.<ion:lang key="terms_link" />"><ion:lang key="more_information" /></a></p>
	</div>
</div>
</div>
