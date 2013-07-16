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
    <h1 class="center"><span class="underline"><ion:page:title /></span></h1>
    <div class="legal-list">
        <ion:articles>
            <div
                <?php if(<ion:article:index /> == 1) {
                    echo 'class="first"';
                } ?>>
                <h3><ion:article:title /></h3>
                <?php if(<ion:article:index /> != 3) {
                    echo '';
                } ?>
                <p><ion:article:content /></p>
            </div>
        </ion:articles>
    </div>
</div>
</body>