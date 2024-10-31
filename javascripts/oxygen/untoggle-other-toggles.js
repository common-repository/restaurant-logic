jQuery(document).ready(function() {
	unToggleOthersWhenToggled();
});

unToggleOthersWhenToggled = function() {
	jQuery("body").on('click', '.oxy-toggle', function () {
		jQuery(this).siblings('.oxy-toggle').each(function () {
			console.log(this);
			var toggle_target = jQuery(this).attr('data-oxy-toggle-target'),
				active_class = jQuery(this).attr('data-oxy-toggle-active-class');
			jQuery(this).removeClass(active_class);
			jQuery(this).children('.oxy-expand-collapse-icon').addClass('oxy-eci-collapsed');
			if ( !toggle_target ) {
				jQuery(this).next().hide();
			} else {
				jQuery(toggle_target).hide();
			}
		});
	});
};