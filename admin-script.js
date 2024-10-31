jQuery(document).ready(function(){

	jQuery(".wrap .rl-box .rl-box-header").click(function(){
		jQuery(this).siblings().slideToggle('fast');
	});

});
