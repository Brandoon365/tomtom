<div class="clearfix not_mobile topheader">	
	<div class="floatLeft sentenceCase more-link"><?php echo ('Need more?');?> <?php print ('Visit') . ' ' . anchor('http://TomTom.com','TomTom.com');?></div>
	<?php /* Commented out for Launch */ ?>	
	<?php //echo form::open("/user/change_language/", array('method' => 'post', "id"=>"languageForm", "class"=>"floatRight")); ?>
		<?php //echo Form::select('pretty', $languages, I18n::$lang, array('class'=>"pretty dk",'id'=>'language_id', 'tabindex'=>'1')); ?>
	<?php //echo Form::close(); ?>	
	<?php print anchor('/content/us/beta','BETA', array('class'=>'tt_button_green floatRight'));?>
</div>

<header class="clearfix">
	<a href="#menu" class="menu-trigger ss-icon">&nbsp;</a>
	<div id="logo">
	<a href="http://www.TomTom.com" target="_blank"><img src="themes/tomtom/assets/images/logo.png" alt="TomTom" class="logo" width="140" height="44"></a>
	</div>
	<?php if (count($primary_nav)){ ?>
		<nav class="floatRight not_mobile" id="desktopNav">	
				<?php foreach($primary_nav as $nav_item):?>
					<?php $attributes = array("target"=>(!empty($nav_item->target)) ? $nav_item->target : '_self');  ?>
					<?php $navClass = (empty($nav_item->class)) ? '' : $nav_item->class; ?>
					<?php $navClass .= ($nav_item->url == Request::detect_uri( ) . '/') ? ' active' : ''; ?>
					<div class="<?php print $navClass . ' ' . $cmsnavigation; ?>">
						<?php print html::anchor($nav_item->url,$nav_item->title, $attributes);?>
						<?php if ($nav_item->class == 'nav-account'){ ?>
							<?php print html::anchor($nav_item->url,__('MY ACCOUNT'), array('class'=>'nav-account-mobile'));?>
						<?php } ?>	
						<?php if (!empty($nav_item->nav) && count($nav_item->nav)){ ?>
							<ul class="list-subnav">
								<?php foreach($nav_item->nav as $nav_item2):?>
									<?php $attributes = array("target"=>(!empty($nav_item2->target)) ? $nav_item2->target : '_self');  ?>
									<li><?php print html::anchor($nav_item2->url,$nav_item2->title, $attributes );?></li>
								<?php endforeach?>
							</ul>
						<?php } ?>	
					</div>
				<?php endforeach?>
				<div class="sentenceCase more-link"><?php echo __('Need more?');?> <?php print __('Visit') . ' ' . html::anchor('http://TomTom.com','TomTom.com');?><br/><?php print HTML::image('media/images/more-link.png',array("width"=>"142", "height"=>"21","alt"=>"")); ?></div>
		</nav>
	<?php } ?>	
	<div class="clearfix"></div>
</header>
<script>
$(function(){
	//on main nav element hover: 
	/// check if the previous/next nav is active
	/// if prev/next active, then add an image to z-index for to fix the right shadow of the previous main nav element
	$('.nav-dashboard').on({
    mouseenter: function() {
        //if nav-dashboard is active add inner shadow
        if ($('.nav-activity').hasClass('active')) {
        	$(this).addClass('post-active-fix');
        }
    },
    mouseleave: function() {
        //remove background no matter what
        $(this).removeClass('post-active-fix');
    }
	});
    $('.nav-activity').on({
    mouseenter: function() {
    	//console.log('activity:Enter');
        //if nav-activity is active add inner shadow
        if ($('.nav-dashboard').hasClass('active')) {
        	$(this).addClass('pre-active-fix');
        }
        else if ($('.nav-training').hasClass('active')) {
        	$(this).addClass('post-active-fix');
        }
    },
    mouseleave: function() {
    	//console.log('activity:Leave');
        //remove background no matter what
        $(this).removeClass('pre-active-fix');
        $(this).removeClass('post-active-fix');
    }
	});
    $('.nav-training').on({
    mouseenter: function() {
        //if nav-training is active add inner shadow
        if ($('.nav-activity').hasClass('active')) {
        	$(this).addClass('pre-active-fix');
        }
        else if ($('.nav-account').hasClass('active')) {
        	$(this).addClass('post-active-fix');
        }
    },
    mouseleave: function() {
        //remove background no matter what
        $(this).removeClass('pre-active-fix');
        $(this).removeClass('post-active-fix');
    }
	});
    $('.nav-account').on({
    mouseenter: function() {
        //if nav-account is active add inner shadow
        if ($('.nav-training').hasClass('active')) {
        	$(this).addClass('pre-active-fix');
        }
    },
    mouseleave: function() {
        //remove background no matter what
        $(this).removeClass('pre-active-fix');
    }
	});


}); //End On Ready
</script>