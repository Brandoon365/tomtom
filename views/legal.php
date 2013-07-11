<head>
    <!-- The "style.css" file will be located in /themes/my_theme/assets/css/ -->
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/css/content.css" />
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/css/normalize.css" />
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/css/main.css" />
    <link rel="stylesheet" type="text/css" media="all" href="<ion:theme_url/>assets/fonts/gibson.css" />
    
</head>
<div class="cmslayout clearfix">
<body>
<h1 class="center"><span class="underline"><ion:page:title /></span></h1>

<div class="legal-list">
<ion:page:articles>
    <div
         <?php
            $index = '<ion:article:index />';
            if($index == 1) {
                echo "class='first'";
            }
          ?>>
    <h3><ion:article:title /></h3>
    <ion:article:content />
    <?php
        if($index != 3) {
            echo '<br>';
        } ?>
    <p><a href=<ion:article:subtitle />>More information</a></p>
    </div>
</ion:page:articles>
</div></div>
</body>