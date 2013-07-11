<!-- This includes the header view -->
<ion:partial view="header" />
 
<!-- Display the page title -->
<ion:page:title tag="h2" />
 
<!-- Display the page subtitle, if one is set -->
<ion:page:subtitle tag="p" class="gray" />
 
<!-- Loop through the articles of the current page
  <ion:page:articles>
 
    // Displays the article title
    <h3><ion:article:title /></h3>
   
    // Displays the article content
    <ion:article:content />
 
    <!-- Display the article's resized pictures -->
<ion:article:medias type="picture" size="300,200" >
 
    <img src="<ion:media:src />" alt="<ion:media:alt />" />
 
</ion:article:medias>
 
</ion:page:articles>
 
<!-- This includes the footer view -->
<ion:partial view="footer" />