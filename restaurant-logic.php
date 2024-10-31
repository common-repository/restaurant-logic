<?php
/*
Plugin Name: Restaurant Logic
Plugin URI:  http://restaurant-logic.com/
Description: Bringing Restaurant Logic to WordPress.
Version:     1.3.11
Author:      Restaurant Logic
Author URI:  http://restaurant-logic.com/
Text Domain: restaurant-logic
Domain Path: /languages

-----------------------------------------------------------------------

Copyright 2021 Restaurant Logic

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
*/

include plugin_dir_path(__FILE__) . '/php/index.php';

if (!defined("ABSPATH")) {
    die();
}


/* Admin Area */
add_action('admin_init', 'restaurant_logic_admin_init');
add_action('admin_menu', 'restaurant_logic_admin_menu');
add_action('admin_enqueue_scripts', 'load_restaurant_logic_admin_style');
add_action('admin_enqueue_scripts', 'load_restaurant_logic_admin_script');

function restaurant_logic_admin_init()
{
    register_setting('rl_options', 'rl_options', 'rl_options_validate');
    add_settings_section('restaurant_logic_main', 'Restaurant Logic Site Settings', 'restaurant_logic_section_text', 'rl_options');
    add_settings_field('restaurant_logic_section_id', 'Organization Id', 'restaurant_logic_section_id_string', 'rl_options', 'restaurant_logic_main');
    add_settings_field('restaurant_logic_accent_color', '(Optional) Accent Color', 'restaurant_logic_accent_color_string', 'rl_options', 'restaurant_logic_main');
}

function restaurant_logic_section_text()
{
    echo '';
}

function restaurant_logic_section_id_string()
{
    $options = get_option('rl_options');
    echo "<input id='restaurant_logic_section_id' name='rl_options[rl_id]' size='10' type='text' value='{$options['rl_id']}' />";
}

function restaurant_logic_accent_color_string()
{
    $options = get_option('rl_options');
    $color = !empty($options['rl_accent_color']) ? $options['rl_accent_color'] : 'lightgray';
    echo "<input id='restaurant_logic_accent_color' name='rl_options[rl_accent_color]' size='10' type='text' value='{$color}' />";
}

function rl_options_validate($input)
{
    return $input;
}


function restaurant_logic_admin_menu()
{
    add_options_page('Restaurant Logic Options', 'Restaurant Logic', 'manage_options', 'rl_options', 'rl_options');
}

function load_restaurant_logic_admin_style($hook)
{
    if ($hook != 'settings_page_rl_options') {
        return;
    }
    wp_enqueue_style('restaurant_logic_admin_css', plugins_url('admin-style.css', __FILE__));
}

function load_restaurant_logic_admin_script($hook)
{
    if ($hook != 'settings_page_rl_options') {
        return;
    }
    wp_enqueue_script('restaurant_logic_admin_script', plugins_url('admin-script.js', __FILE__));
}

function rl_options()
{
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to access this page.'));
    }
    ?>
    <div class="wrap">
        <h2>Restaurant Logic</h2>
        <form action="options.php" method="post">
            <?php settings_fields('rl_options'); ?>
            <?php do_settings_sections('rl_options'); ?>
            <p class="submit">
                <input
                        name="Submit" class="button button-primary" type="submit"
                        value="<?php esc_attr_e('Save Changes'); ?>"
                />
            </p>
        </form>

        <?php if (get_option('rl_options')['rl_id'] != "") { ?>

            <h3>Restaurant Logic Short Codes</h3>

            <div class="rl-box">
                <div class="rl-box-header">
                    <em>Display a Main Menu</em>
                </div>
                <div class="rl-box-content">
                    <p class="shortcode">[rl_menu id="1" style="tabs" depth="fullmenu" column="1" no_fontawesome="false" hide_filter="true"]</p>
                    <p class="att"><strong>id</strong> - The <em>Menu Id</em> found in the list below.</p>
                    <p class="att"><strong>style</strong> - Choose from <em>tabs</em>, <em>grid</em>, <em>collapsible</em>, <em>descent</em>,  or <em>vexillology</em>. Default is <em>tabs</em>.</p>
                    <p class="att"><strong>depth</strong> - Choose from <em>fullmenu</em>, <em>section</em>, or <em>subsection</em>. Default is <em>fullmenu</em>.</p>
                    <p class="att"><strong>column</strong> - How many columns to use to display content. Default is <em>1</em>.</p>
                    <p class="att"><strong>no_fontawesome</strong> - Whether fontawesome styles are missing. Default is <em>false</em>.</p>
                    <p class="att"><strong>hide_filter</strong> - Whether or not to hide filter / search for items. Default is <em>true</em>.</p>
                    <p class="att"><strong>hide_section_title</strong> - Whether or not to hide the section titles on the menu. Default is <em>true</em> for <em>section</em> and <em>subsection</em> and <em>false</em> for <em>fullmenu</em>.</p>

                    <p><?php restaurant_logic_get_all_menus(); ?></p>
                </div>
            </div>

            <div class="rl-box">
                <div class="rl-box-header">
                    <em>Display a Form</em>
                </div>
                <div class="rl-box-content">
                    <p class="shortcode">[rl_form id=""]</p>
                    <p class="att"><strong>id</strong> - The <em>Form Id</em> found in the list below.</p>
                    <p><?php restaurant_logic_get_all_forms(); ?></p>
                </div>
            </div>

            <div class="rl-box">
                <div class="rl-box-header">
                    <em>Display the Company Information</em>
                </div>
                <div class="rl-box-content">
                    <?php $companyInfo = restaurant_logic_get_company_info(); ?>

                    <div class="rl-box">
                        <div class="rl-box-header">
                            <em>Display the Company Logo</em>
                        </div>
                        <div class="rl-box-content">
                            <p class="shortcode">[rl_logo]</p>
                            <div class="info">
                                <h4>Current Logo uploaded in Restaurant Logic</h4>
                                <img src="<?php echo $companyInfo['logo']; ?>"/>
                            </div>
                        </div>
                    </div>

                    <div class="rl-box">
                        <div class="rl-box-header">
                            <em>Display the Company Name</em>
                        </div>
                        <div class="rl-box-content">
                            <p class="shortcode">[rl_company]</p>
                            <div class="info">
                                <h4>Current Name in Restaurant Logic</h4>
                                <?php echo $companyInfo['name']; ?>
                            </div>
                        </div>
                    </div>

                    <div class="rl-box">
                        <div class="rl-box-header">
                            <em>Display the Company Address</em>
                        </div>
                        <div class="rl-box-content">
                            <p class="shortcode">[rl_address map_link=""]</p>
                            <p class="att"><strong>map_link</strong> - Choose from <em>yes</em> or <em>no</em>. Have the
                                address be a google map link. Default is <em>yes</em>.</p>
                            <div class="info">
                                <h4>Current Address in Restaurant Logic</h4>
                                <?php echo $companyInfo['address']; ?><br/>
                                <?php echo $companyInfo['city'] . ", " . $companyInfo['state'] . " " . $companyInfo['zip']; ?>
                            </div>
                        </div>
                    </div>

                    <div class="rl-box">
                        <div class="rl-box-header">
                            <em>Display the Company Contact Information</em>
                        </div>
                        <div class="rl-box-content">
                            <p class="shortcode">[rl_contact show_phone="" show_email=""]</p>
                            <p class="att"><strong>show_phone</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em>.</p>
                            <p class="att"><strong>show_email</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>no</em>.</p>
                            <div class="info">
                                <h4>Current Contact Information in Restaurant Logic</h4>
                                <?php echo $companyInfo['phone']; ?><br/>
                                <?php echo $companyInfo['tollFree']; ?><br/>
                                <?php echo $companyInfo['email']; ?>
                            </div>
                        </div>
                    </div>

                    <div class="rl-box">
                        <div class="rl-box-header">
                            <em>Display the Company Hours</em>
                        </div>
                        <div class="rl-box-content">
                            <p class="shortcode">[rl_hours show_title="" first_day="" hide_minutes=""
                                display_note="" id=""]</p>
                            <p class="att"><strong>show_title</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em>.</p>
                            <p class="att"><strong>first_day</strong> - Choose from <em>Sunday</em> or <em>Monday</em>.
                                Default is <em>Sunday</em>.</p>
                            <p class="att"><strong>hide_minutes</strong> - Choose from <em>yes</em> or <em>no</em>. (7am
                                vs 7:00am) Default is <em>no</em>.</p>
                            <p class="att"><strong>display_note</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em> if field is set no otherwise.</p>
                            <p class="att"><strong>id</strong> - Should be one of the provided ids below.
                                Default is the first hours group.</p>
                            <div class="info">
                                <h4>Current Hours set in Restaurant Logic</h4>
                                <?php if ($companyInfo['hours'] != "") {
                                    foreach ($companyInfo['hours'] as $hours_group) {
                                        echo "<table>";
                                        echo "<caption>id: {$hours_group['id']}</caption>";
                                        echo "<caption>{$hours_group['category']}</caption>";
                                        foreach ($hours_group['hours'] as $hours_item) {
                                            $data = get_object_vars($hours_item);
                                            echo "<tr>";
                                            echo "<td>{$data['name']}</td>";
                                            if ($data['periods'][0] != null) {
                                                $operatingHours = get_object_vars($data['periods'][0]);
                                                echo "<td>" . restaurant_logic_format_time($operatingHours['openTime']) . "</td>";
                                                echo "<td>-</td>";
                                                echo "<td>" . restaurant_logic_format_time($operatingHours['closeTime']) . "</td>";
                                            } else {
                                                echo "<td>Closed</td>";
                                            }
                                            echo "</tr>";
                                        }
                                        echo "<caption>notes: {$hours_group['additional']}</caption>";
                                        echo "</table>";
                                    }
                                } ?>
                            </div>
                        </div>
                    </div>

                    <div class="rl-box">
                        <div class="rl-box-header">
                            <em>Display the Company Social Media Links</em>
                        </div>
                        <div class="rl-box-content">
                            <p class="shortcode">[rl_social show_facebook="" show_googleplus="" show_instagram=""
                                show_twitter=""]</p>
                            <p class="att"><strong>show_facebook</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em>.</p>
                            <p class="att"><strong>show_googleplus</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em>.</p>
                            <p class="att"><strong>show_instagram</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em>.</p>
                            <p class="att"><strong>show_twitter</strong> - Choose from <em>yes</em> or <em>no</em>.
                                Default is <em>yes</em>.</p>
                            <div class="info">
                                <h4>Current Social Media Links set in Restaurant Logic</h4>
                                <ul class="social-icons">
                                    <?php if ($companyInfo['facebook'] != "") { ?>
                                        <li class='facebook'><a
                                                    class='icon-facebook' target='_blank' title='Facebook'
                                                    href='https://www.facebook.com/<?php echo $companyInfo['facebook']; ?>'
                                            ></a></li>
                                    <?php } ?>
                                    <?php if ($companyInfo['googlePlus'] != "") { ?>
                                        <li class='googleplus'><a
                                                    class='icon-gplus' target='_blank' title='GooglePlus'
                                                    href='https://plus.google.com/<?php echo $companyInfo['googlePlus']; ?>/posts'
                                            ></a></li>
                                    <?php } ?>
                                    <?php if ($companyInfo['instagram'] != "") { ?>
                                        <li class='instagram'><a
                                                    class='icon-instagram' target='_blank' title='Instagram'
                                                    href='https://instagram.com/<?php echo $companyInfo['instagram']; ?>'
                                            ></a></li>
                                    <?php } ?>
                                    <?php if ($companyInfo['twitter'] != "") { ?>
                                        <li class='twitter'><a
                                                    class='icon-twitter' target='_blank' title='Twitter'
                                                    href='https://twitter.com/<?php echo $companyInfo['twitter']; ?>'
                                            ></a></li>
                                    <?php } ?>
                                    <?php if ($companyInfo['youtube'] != "") { ?>
                                        <li class='youtube'><a
                                                    class='icon-youtube' target='_blank' title='Youtube'
                                                    href='https://www.youtube.com/user/<?php echo $companyInfo['youtube']; ?>'
                                            ></a></li>
                                    <?php } ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rl-box">
                <div class="rl-box-header">
                    <em>Display Image Galleries</em>
                </div>
                <div class="rl-box-content">
                    <p class="shortcode">[rl_gallery name=""]</p>
                    <p class="att"><strong>name</strong> - The <em>folder path</em> of where the images are stored.
                        (/images/Gallery/ = "Gallery" or /images/Gallery/Food/ = "Gallery/Food")</p>
                    <p><?php restaurant_logic_get_all_images(); ?></p>
                </div>
            </div>

        <?php } ?>

    </div>
    <?php
}

/* Frontend Area */

add_action('wp_enqueue_scripts', 'load_restaurant_logic_style');
function load_restaurant_logic_style()
{
    wp_enqueue_style('restaurant_logic_css', plugins_url('style.css', __FILE__));
    wp_enqueue_style('restaurant_logic_grid_lock_style', plugins_url('stylesheets/menu/output/gridlock.css', __FILE__));
    wp_enqueue_style('restaurant_logic_full_style', plugins_url('stylesheets/menu/output/full.css', __FILE__));
    wp_enqueue_style('restaurant_logic_associated_item_modal_style', plugins_url('stylesheets/menu/output/associated-item-modal.css', __FILE__));
    wp_enqueue_style('restaurant_logic_associated_sidetabs_style', plugins_url('stylesheets/menu/output/sidetabs.css', __FILE__));
    wp_enqueue_style('restaurant_logic_bootstrap_style', plugins_url('stylesheets/bootstrap.css', __FILE__));
    wp_enqueue_style('restaurant_logic_form_output', plugins_url('stylesheets/forms/form-output.css', __FILE__));
    wp_enqueue_style('restaurant_logic_colorbox_style', plugins_url("stylesheets/colorbox.css", __FILE__));
    wp_enqueue_style('restaurant_logic_justified_gallery_style', plugins_url("stylesheets/justifiedGallery.css", __FILE__));
}

add_action('wp_enqueue_scripts', 'load_restaurant_logic_script');
function load_restaurant_logic_script()
{
    wp_enqueue_script('jquery');
    wp_enqueue_script('restaurant_logic_angular_min', plugins_url('javascripts/libs/angular.min.js', __FILE__));
    wp_register_script('restaurant_logic_form_output_controller', plugins_url('javascripts/forms/form-output-controller.js', __FILE__));
    wp_enqueue_script('restaurant_logic_angular_sanitize_min', plugins_url('javascripts/libs/angular-sanitize.min.js', __FILE__));
    wp_enqueue_script('restaurant_logic_justified_gallery_script', plugins_url('javascripts/libs/jquery.justifiedGallery.min.js', __FILE__));
    wp_enqueue_script('restaurant_logic_colorbox_script', plugins_url('javascripts/libs/jquery.colorbox-min.js', __FILE__));
    wp_enqueue_script('restaurant_logic_bootstrap_script', plugins_url('javascripts/libs/ui-bootstrap.min.js', __FILE__));
    wp_enqueue_script('restaurant_logic_bootstrap_tlps_script', plugins_url('javascripts/libs/ui-bootstrap-tpls.min.js', __FILE__));
    wp_enqueue_script('restaurant_logic_angular_menu_script', plugins_url('javascripts/menu/angular-menu-output-controller.js', __FILE__));
    wp_enqueue_script('restaurant_logic_angular_datetime_picker_script', plugins_url('javascripts/customer/bootstrap-datetimepicker.js', __FILE__));
    wp_enqueue_script('restaurant_logic_form_builder_script', plugins_url('javascripts/forms/angular-form-builder.js', __FILE__));
    wp_enqueue_script('restaurant_logic_form_builder_components_script', plugins_url('javascripts/forms/angular-form-builder-components.js', __FILE__));
    wp_enqueue_script('restaurant_logic_form_validator_script', plugins_url('javascripts/forms/angular-validator.js', __FILE__));
    wp_enqueue_script('restaurant_logic_globals', plugins_url('javascripts/global.js', __FILE__));
    wp_enqueue_script('restaurant_logic_survey_module', plugins_url('javascripts/forms/surveyModule.js', __FILE__));
    wp_enqueue_script('restaurant_logic_job_app_module', plugins_url('javascripts/forms/jobAppModule.js', __FILE__));
    wp_enqueue_script('restaurant_logic_masks', plugins_url('javascripts/mask.js', __FILE__));
    wp_enqueue_script('restaurant_logic_form_module', plugins_url('javascripts/forms/customerFormModule.js', __FILE__));
    wp_enqueue_script('restaurant_logic_validator_rules', plugins_url('javascripts/forms/angular-validator-rules.js', __FILE__));
    wp_enqueue_script('restaurant_logic_oxygen_toggle_helper', plugins_url('javascripts/oxygen/untoggle-other-toggles.js', __FILE__));
}

add_action('wp_head', 'rl_load_recaptcha_plugin');
function rl_load_recaptcha_plugin()
{
    echo '<script src="https://www.google.com/recaptcha/api.js" async defer></script>';
}


/* Shortcodes */
/*
[restaurant_logic_menu_item_price id="21821"]
[restaurant_logic_menu_item id=21821 show_desc="yes" show_img="yes"]
[restaurant_logic_submenu_items id=3277 show_desc="yes" show_img="yes"]
[restaurant_logic_submenu id=3277 show_desc="yes" show_img="yes" show_item_desc="yes" show_item_img="yes"]
[restaurant_logic_menu id=681 show_desc="yes" show_img="yes" show_item_desc="yes" show_item_img="yes"]
*/


//add_shortcode('rl3_menu', 'shortcode_rl3_menu');
add_shortcode('rl_menu', 'shortcode_rl3_menu');
function shortcode_rl3_menu($atts) {

	$accentColor = get_option('rl_options')['rl_accent_color'];
	$rlId = get_option('rl_options')['rl_id'];

	$atts = shortcode_atts(
		array(
			'design' => 'sidetabs',
			'style' => '',
			'org' => $rlId,
			'depth' => 'default',
			'depth_id' => '0',
			'id' => '',
			'column' => '3',
			'no_fontawesome' => 'false',
			'hide_filter' => 'true',
			'hide_images' => 'false',
			'hide_section_title' => 'default'
		), $atts, 'rl_menu');

	$randId = uniqid();

	$chosenDesign = strtolower(!empty($atts['style']) ? $atts['style'] : $atts['design']);
	if ($chosenDesign == 'tabs') $chosenDesign = 'sidetabs';
	if ($chosenDesign == 'grid') $chosenDesign = 'gridlock';

	if(!in_array($chosenDesign, array("collapsible","descent","gridlock","sidetabs","vexillology"))) {
		$chosenDesign = "default";
	}
	wp_enqueue_style($chosenDesign.'css', plugins_url("stylesheets/menu/output/$chosenDesign.css", __FILE__));

	$isDefault = false;
	$chosenDepth = strtolower($atts['depth']);

	$chosenColumn = strtolower($atts['column']);
	$noFontAwesome = strtolower($atts['no_fontawesome']) == 'true';
	$hideFilter = strtolower($atts['hide_filter']) == 'true';
	$hideImages = strtolower($atts['hide_images']) == 'true';

	$menuId = !empty($atts['id']) ? $atts['id'] : $atts['depth_id'];


	if ($chosenDepth === 'default') {
		$chosenDepth = !empty($menuId) ? 'section' : 'fullmenu';
	} else if(!in_array($chosenDepth, array("subsection","section"))) {
		$chosenDepth = "fullmenu";
	}
	
	if ($atts['hide_section_title'] == 'default') {
		$hideSectionTitle = $chosenDepth !== 'fullmenu';
	} else {
		$hideSectionTitle = strtolower($atts['hide_section_title']) == 'true';
	}

	if(!in_array($chosenColumn, array("1","2","3","4"))) {
		$chosenColumn = "1";
	}

	$result = '<div class="rl-widget rl-menu rl-menu-angular le-menu-angular main-menu col col-xs-12 menu-wrapper ' .$chosenDesign. ($noFontAwesome ? ' no-fa': '') . ($hideFilter ? ' hide-filter': ''). ($hideSectionTitle ? ' hide-section-title': ''). '">' .
            '	<div id="' .$chosenDesign. '">'.
            '		<div id="le-menu" class="container-fluid le-menu">'.
            '			<div class="le-menu-controller" '.
            '				id="menu-controller-' . $randId . '"'.
            '				ng-controller="AngularMenuController' .($isDefault ? '' : ucfirst($chosenDesign)). '"'.
            '				ng-include="\'https://app.restaurant-logic.com/assets/partials/menu/angular-menu-output' .($isDefault ? '' : '-'.$chosenDesign). '.html\'"'.
            '				data-organizationId="' .$atts['org']. '"'.
            '				data-menuDepth="' .$chosenDepth. '"'.
            '				data-menuid="' .$menuId. '"'.
            '				data-menuClasses="menu' .($isDefault ? '' : '-'.$chosenDesign). ' menu-columns column-count-' .$chosenColumn.'"'.
            '				'.(!$hideImages ? 'data-showImages="all"': '').'>'.
            '			</div>'.
            '		</div>'.
            '	</div>'.
            '</div>';
	wp_enqueue_script("required-libs-tag", "https://app.restaurant-logic.com/assets/javascripts/required-libraries.js");
	wp_enqueue_script("rl-menu-output", "https://app.restaurant-logic.com/assets/javascripts/menu/angular-menu-output-controller.js");

	wp_enqueue_script('restaurant_logic_blank', plugins_url('javascripts/blank.js', __FILE__));
	wp_add_inline_script('restaurant_logic_blank', "angular.element(document).ready(function(){var menuApp=document.getElementById('menu-controller-{$randId}');angular.bootstrap(menuApp,['menu']);});");


	if (!empty($accentColor)) {
		$extraStyles = '.le-menu-classes .subsection-item .tags .tag {' .
				'        border-color: ' . $accentColor . ';' .
				'}';

		if ($chosenDesign === 'sidetabs') {
			$extraStyles .= '.le-menu-angular .le-menu-classes.menu-sidetabs .subsection-title:hover,' .
					'.le-menu-angular .le-menu-classes.menu-sidetabs .subsection-title:focus,' .
					'.le-menu-angular .le-menu-classes.menu-sidetabs .subsection-title.open { ' .
					'        background-color: ' . $accentColor . ';' .
					'}' .
					'.le-menu-angular .le-menu-classes.menu-sidetabs .subsection-content-space {' .
					'        border-left-color: ' . $accentColor . ';' .
					'}' .
					'.subsection-title-list h2 { '.
					'    font-size: 16px;' .
					'    line-height: 20px;'.
					'}';
		} else if ($chosenDesign === 'gridlock') {
			$extraStyles .= '#menu-controller-' . $randId .' .le-menu-classes.menu-gridlock .subsection.open .featured-item-wrapper,' .
					'#menu-controller-' . $randId .' .le-menu-classes.menu-gridlock .subsection:hover .featured-item-wrapper {' .
					'	border-top-color: ' . $accentColor . ';' .
					'	border-bottom-color: ' . $accentColor . ';' .
					'}' .
					'#menu-controller-' . $randId .' .le-menu-classes.menu-gridlock .subsection .featured-item-wrapper:after {' .
					'	border-color: transparent transparent ' . $accentColor . ' transparent;' .
					'}' .
					'#menu-controller-' . $randId .' .le-menu-classes.menu-gridlock .subsection-content {' .
					'	border-top-color: ' . $accentColor . ';' .
					'	border-bottom-color: ' . $accentColor . ';' .
					'}' .
					'#menu-controller-' . $randId .' .le-menu-classes.menu-gridlock .section .section-sortable .subsection-chunk .subsection-content-wrapper .subsection-content .subsection-item-list .subsection-item .price {' .
					'    background-color: ' . $accentColor . ';' .
					'    position: relative;' .
					'}' .
					'#menu-controller-' . $randId .' .le-menu-classes.menu-gridlock .subsection-item .price:after {' .
					'	border-color: transparent transparent transparent ' . $accentColor . ';' .
					'}';
		} else if ($chosenDesign === 'vexilology') {
			$extraStyles .= '#menu-controller-' . $randId . ' .le-menu-classes.menu-vexillology .subsection-content { '.
					'	border-left-color: ' .$accentColor .';' .
					'}';
		}

		$result .= '<style type="text/css">' .  $extraStyles . '</style>';
	}

	return $result;
}




add_shortcode('rl_menu_old', 'shortcode_restaurant_logic_menu_old');
function shortcode_restaurant_logic_menu_old($atts, $content = null)
{
    $id = $show_desc = $show_img = $show_item_desc = $show_item_img = '';
    extract(shortcode_atts(array(
        'id' => '',
        'show_desc' => '',
        'show_img' => '',
        'show_item_desc' => '',
        'show_item_img' => ''
    ), $atts));


    if ($id == '') {
        return "";
    }
    if ($show_desc == '') {
        $show_desc = 'no';
    }
    if ($show_img == '') {
        $show_img = 'no';
    }
    if ($show_item_desc == '') {
        $show_item_desc = 'yes';
    }
    if ($show_item_img == '') {
        $show_item_img = 'yes';
    }


    $menu = restaurant_logic_get_data("https://api.restaurant-logic.com/api/MenuSections/$id/subsections");
    if ($menu == "") {
        return "";
    }
    $html = "";

    foreach ($menu as $menu_item) {
        $menu_id = $menu_item['id'];
        $menu_name = $menu_item['name'];
        $menu_description = $menu_item['description'];
        $menu_position = $menu_item['position'];
        $menu_deleted = $menu_item['deleted'];
        $menu_active = $menu_item['active'];

        if ($menu_position >= 0 && $menu_deleted == 0 && $menu_active == 1) {

            $html .= "<div class='section mcb-section restaurant_logic_submenu' id='restaurant_logic_submenu_" . $menu_id . "'>";
            $html .= "<div class='section_wrapper mcb-section-inner'>";
            $html .= "<div class='wrap mcb-wrap one columnimargin-20px valign-top clearfix'>";
            $html .= "<div class='mcb-wrap-inner'>";
            $html .= "<div class='column mcb-column one column_column column-margin-'>";
            $html .= "<div class='column_attr clearfix align_center'>";
            $html .= "<h2>" . $menu_name . "</h2>";
            if ($show_desc == 'yes') {
                $html .= "<hr class='no_line' style='margin: 0 auto 15px;' />";
                $html .= "<div style='height: 4px; background: #e3ca96;'></div>";
                $html .= "<hr class='no_line' style='margin: 0 auto 30px;' />";
                $html .= "<h6>" . $menu_description . "</h6>";
            }

            $html .= do_shortcode("[rl_submenu_items id=" . $menu_id . " show_desc='" . $show_item_desc . "' show_img='" . $show_item_img . "']");

            $html .= "</div></div></div></div></div></div>";
        }
    }

    return $html;
}

add_shortcode('year', 'shortcode_restaurant_logic_date');
function shortcode_restaurant_logic_date()
{
    $year = date('Y');
    return $year;
}


add_shortcode('rl_submenu_items', 'shortcode_restaurant_logic_submenu_items');
function shortcode_restaurant_logic_submenu_items($atts, $content = null)
{
    $id = $show_desc = $show_img = '';
    extract(shortcode_atts(array(
        'id' => '',
        'show_desc' => '',
        'show_img' => ''
    ), $atts));

    if ($id == '') {
        return "";
    }
    if ($show_desc == '') {
        $show_desc = 'yes';
    }
    if ($show_img == '') {
        $show_img = 'yes';
    }


    $menu = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/MenuSubsections/" . $id . "/items");
    if ($menu == "") {
        return "";
    }
    $html = "";

    foreach ($menu as $menu_item) {
        $menu_id = $menu_item['id'];
        $menu_name = $menu_item['name'];
        $menu_description = $menu_item['description'];
        $menu_imageUrl = $menu_item['imageUrl'];
        $menu_position = $menu_item['position'];
        $menu_deleted = $menu_item['deleted'];
        $menu_active = $menu_item['active'];

        if ($menu_position >= 0 && $menu_deleted == 0 && $menu_active == 1) {
            $html .= "<div class='wrap mcb-wrap one-third column-margin-20px valign-top clearfix'>";
            $html .= "<div class='mcb-wrap-inner restaurant_logic_menu_item' id='restaurant_logic_menu_item_" . $menu_id . "'>";
            if ($show_img == 'yes' && $menu_imageUrl != '') {
                $html .= "<div class='column mcb-column one column_image'>";
                $html .= "<div class='image_frame image_item no_link scle-with-grid aligncenter no_border'>";
                $html .= "<div class='image_wrapper'>";
                $html .= "<img class='scale-with-grid' src='" . $menu_imageUrl . "' />";
                $html .= "</div></div></div>";
            }
            $html .= "<div class='column mcb-column one column_column column-margin-'>";
            $html .= "<div class='column_attr clearfix align_center'>";
            $html .= "<h3 class='themecolor'>" . do_shortcode("[rl_menu_item_price id=" . $menu_id . "]") . "</h3>";
            $html .= "<h4>" . $menu_name . "</h4>";
            if ($show_desc == 'yes') {
                $html .= "<p>" . $menu_description . "</p>";
            }
            $html .= "</div></div></div></div>";
        }
    }

    return $html;
}


add_shortcode('rl_submenu', 'shortcode_restaurant_logic_submenu');
function shortcode_restaurant_logic_submenu($atts, $content = null)
{
    $id = $show_desc = $show_img = $show_item_desc = $show_item_img = '';
    extract(shortcode_atts(array(
        'id' => '',
        'show_desc' => '',
        'show_img' => '',
        'show_item_desc' => '',
        'show_item_img' => ''
    ), $atts));

    if ($id == '') {
        return "";
    }
    if ($show_desc == '') {
        $show_desc = 'yes';
    }
    if ($show_img == '') {
        $show_img = 'yes';
    }
    if ($show_item_desc == '') {
        $show_item_desc = 'yes';
    }
    if ($show_item_img == '') {
        $show_item_img = 'yes';
    }


    $menu_item = restaurant_logic_get_data("https://api.restaurant-logic.com/api/MenuSubsections/" . $id . "/");
    if ($menu_item == "") {
        return "";
    }

    $menu_name = $menu_item['name'];
    $menu_description = $menu_item['description'];

    $html = "";

    $html .= "<div class='section mcb-section restaurant_logic_submenu' id='restaurant_logic_submenu_" . $id . "'>";
    $html .= "<div class='section_wrapper mcb-section-inner'>";
    $html .= "<div class='wrap mcb-wrap one columnimargin-20px valign-top clearfix'>";
    $html .= "<div class='mcb-wrap-inner'>";
    $html .= "<div class='column mcb-column one column_column column-margin-'>";
    $html .= "<div class='column_attr clearfix align_center'>";
    $html .= "<h2>" . $menu_name . "</h2>";
    if ($show_desc == 'yes') {
        $html .= "<hr class='no_line' style='margin: 0 auto 15px;' />";
        $html .= "<div style='height: 4px; background: #e3ca96;'></div>";
        $html .= "<hr class='no_line' style='margin: 0 auto 30px;' />";
        $html .= "<h6>" . $menu_description . "</h6>";
    }


    $menu = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/MenuSubsections/" . $id . "/items");

    foreach ($menu as $menu_item) {
        $menu_id = $menu_item['id'];
        $menu_name = $menu_item['name'];
        $menu_description = $menu_item['description'];
        $menu_imageUrl = $menu_item['imageUrl'];
        $menu_position = $menu_item['position'];
        $menu_deleted = $menu_item['deleted'];
        $menu_active = $menu_item['active'];

        if ($menu_position >= 0 && $menu_deleted == 0 && $menu_active == 1) {
            $html .= "<div class='wrap mcb-wrap one-third column-margin-20px valign-top clearfix'>";
            $html .= "<div class='mcb-wrap-inner restaurant_logic_menu_item' id='restaurant_logic_menu_item_" . $menu_id . "'>";
            if ($show_item_img == 'yes' && $menu_imageUrl != '') {
                $html .= "<div class='column mcb-column one column_image'>";
                $html .= "<div class='image_frame image_item no_link scle-with-grid aligncenter no_border'>";
                $html .= "<div class='image_wrapper'>";
                $html .= "<img class='scale-with-grid' src='" . $menu_imageUrl . "' />";
                $html .= "</div></div></div>";
            }
            $html .= "<div class='column mcb-column one column_column column-margin-'>";
            $html .= "<div class='column_attr clearfix align_center'>";
            $html .= "<h3 class='themecolor'>" . do_shortcode("[rl_menu_item_price id=" . $menu_id . "]") . "</h3>";
            $html .= "<h4>" . $menu_name . "</h4>";
            if ($show_item_desc == 'yes') {
                $html .= "<p>" . $menu_description . "</p>";
            }
            $html .= "</div></div></div></div>";
        }
    }

    $html .= "</div></div></div></div></div></div>";

    return $html;
}


add_shortcode('rl_menu_item', 'shortcode_restaurant_logic_menu_item');
function shortcode_restaurant_logic_menu_item($atts, $content = null)
{
    $id = $show_desc = $show_img = '';
    extract(shortcode_atts(array(
        'id' => '',
        'show_desc' => '',
        'show_img' => ''
    ), $atts));

    if ($id == '') {
        return "";
    }
    if ($show_desc == '') {
        $show_desc = 'yes';
    }
    if ($show_img == '') {
        $show_img = 'yes';
    }


    $menu_item = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/MenuSubsectionItems/" . $id . "/");
    if ($menu_item == "") {
        return "";
    }

    $menu_id = $menu_item['id'];
    $menu_name = $menu_item['name'];
    $menu_description = $menu_item['description'];
    $menu_imageUrl = $menu_item['imageUrl'];
    $menu_position = $menu_item['position'];
    $menu_deleted = $menu_item['deleted'];
    $menu_active = $menu_item['active'];

    $html = "";

    if ($menu_position >= 0 && $menu_deleted == 0 && $menu_active == 1) {
        $html .= "<div class='mcb-wrap-inner restaurant_logic_menu_item' id='restaurant_logic_menu_item_" . $menu_id . "'>";
        if ($show_img == 'yes' && $menu_imageUrl != '') {
            $html .= "<div class='column mcb-column one column_image'>";
            $html .= "<div class='image_frame image_item no_link scle-with-grid aligncenter no_border'>";
            $html .= "<div class='image_wrapper'>";
            $html .= "<img class='scale-with-grid' src='" . $menu_imageUrl . "' />";
            $html .= "</div>";
            $html .= "</div>";
            $html .= "</div>";
        }
        $html .= "<div class='column mcb-column one column_column column-margin-'>";
        $html .= "<div class='column_attr clearfix align_center'>";
        $html .= "<h3 class='themecolor'>" . do_shortcode("[rl_menu_item_price id=" . $menu_id . "]") . "</h3>";
        $html .= "<h4>" . $menu_name . "</h4>";
        if ($show_desc == 'yes') {
            $html .= "<p>" . $menu_description . "</p>";
        }
        $html .= "</div></div></div>";
    }

    return $html;
}


add_shortcode('rl_menu_item_price', 'shortcode_restaurant_logic_menu_item_price');
function shortcode_restaurant_logic_menu_item_price($atts, $content = null)
{
    $id = '';
    extract(shortcode_atts(array(
        'id' => ''
    ), $atts));

    if ($id == '') {
        return "";
    }


    $price = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/MenuSubsectionItems/" . $id . "/prices");
    if ($price == "") {
        return "";
    }
    $html = "";

    if ($price[0]['value'] > 0) {
        $html .= money_format('$%i', $price[0]['value']);
    }

    return $html;
}

add_shortcode('rl_menu_grid', 'shortcode_restaurant_logic_menu_grid');
function shortcode_restaurant_logic_menu_grid($atts, $content = null)
{
	shortcode_atts(array(
		'id' => '',
		'depth' => 'fullmenu'
	), $atts);
	return do_shortcode('[rl_menu id="' .$atts['id'].'" style="gridlock" depth="' . $atts['depth'] .']');
}

add_shortcode('rl_menu_full', 'shortcode_restaurant_logic_menu_full');
function shortcode_restaurant_logic_menu_full($atts, $content = null)
{
	shortcode_atts(array(
		'id' => ''
	), $atts);
	return do_shortcode('[rl_menu id="' .$atts['id'].'"]');
}

add_shortcode('rl_menu_tabs', 'shortcode_restaurant_logic_menu_tabs');
function shortcode_restaurant_logic_menu_tabs($atts, $content = null)
{
	shortcode_atts(array(
		'id' => '',
		'depth' => 'fullmenu'
	), $atts);
	return do_shortcode('[rl_menu id="' .$atts['id'].'" style="sidetabs" depth="' . $atts['depth'] .'"]');
}


/* Forms */


add_shortcode('rl_form', 'shortcode_restaurant_logic_form');
function shortcode_restaurant_logic_form($atts, $content = null)
{
    $id = '';
    extract(shortcode_atts(array(
        'id' => ''
    ), $atts));

    if ($id == '') {
        return "";
    }
    wp_enqueue_script('restaurant_logic_form_output_controller');

    return "
        <div class='column mcb-column one column_column'>
            <div class='column_attr clearfix'>
                <section class='container-fluid' id='form-output-container' ng-controller='FormOutputController' data-form-id='{$id}' data-bootstrapless='false'>
                    <div class='row form-content-{$id}' id='form-content'>
                        <form class='form-horizontal'>
                            <div ng-model='input' fb-form='default' fb-default='defaultValue'></div>
                            <div class='col-xs-12 col-md-8 col-md-offset-4 col-recaptcha' ng-show='pagination.currentPage == (pagination.pageIndexes.length -1)  && formData.captchaEnabled'>
                                <div id='recaptcha-{$id}' class='g-recaptcha' data-sitekey='6Lf3_gsTAAAAAAUgHkr-IZ1y5CCbowjG9eSmOsRw'></div>
                            </div>
                            <div class='col-xs-12 col-sm-offset-2 col-sm-4 col-previous'>
                                <button ng-show='pagination.currentPage > 0' ng-click='prev()' class='btn btn-default'>Previous</button>
                            </div>
                            <div class='col-xs-12 col-sm-4 col-next'>
                                <button ng-show='pagination.currentPage < (pagination.pageIndexes.length -1)' ng-click='next()' class='btn btn-default'>Next</button>
                            </div>
                            <div class='col-xs-12 col-sm-4' ng-show='pagination.currentPage == (pagination.pageIndexes.length -1)' ng-class='{\"col-sm-offset-4\": pagination.pageIndexes.length == 1}'>
                                <div class='col-xs-12 col-submit'>
                                    <input type='submit' ng-click='submit()' class='btn btn-default' value='Submit'/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class='ng-cloak' ng-if='pagination.pageIndexes.length > 1'>Page {{pagination.currentPage + 1}} of {{pagination.pageIndexes.length}}</div>
                </section>
            </div>
       </div>
	   <script type='text/javascript'>
	   	// Only instantiate recaptchaForms as an empty array if it doesn't already exist
			if (typeof recaptchaForms === 'undefined') var recaptchaForms = [];

			// Add the form to the list of recaptchas to render
			//  also tack on a 'loaded' value so we can make sure we don't try to render a recaptcha twice
			recaptchaForms.push({id: $id, loaded: true, recaptchaId: 'recaptcha-{$id}'});

			/*if (typeof loadGrecaptcha === 'undefined') {
				var loadGrecaptcha = function(){
					// For any form that doesn't have its loaded flag on, render the grecaptcha for that form
					recaptchaForms.forEach(function(form){
						if(!form.loaded){
							form.recaptchaId = grecaptcha.render('recaptcha-' + form.id, {'sitekey': '6Lf3_gsTAAAAAAUgHkr-IZ1y5CCbowjG9eSmOsRw'});
							form.loaded = true;
						}
					})
				}
			}*/
		</script>
    ";
}

function equal_hours($day1, $day2)
{
    if (sizeof($day1) != sizeof($day2)) {
        return false;
    }

    $match = true;
    for ($i = 0; $i < sizeof($day1); $i++) {
        $hours1 = get_object_vars($day1[$i]);
        $hours2 = get_object_vars($day2[$i]);
        $label_match = $hours1['label'] == $hours2['label'];
        $opening_match = $hours1['openTime'] == $hours2['openTime'];
        $closing_match = $hours1['closeTime'] == $hours2['closeTime'];
        $match = $match && $label_match && $opening_match && $closing_match;
    }

    return $match;
}

function get_hours_summary($hours, $first_day)
{
    $saveSunday = [];
    $daysArray = [];
    foreach ($hours as $hours_item) {
        $data = get_object_vars($hours_item);
        $periods = $data['periods'];
        $day = $data['name'];
        if (empty($periods) || $day == null) {
            continue;
        }
        if ($day == "Sunday" && $first_day == "monday") {
            $saveSunday = $periods;
        } elseif (empty($daysArray)) {
            array_push($daysArray, array("day1" => $day, "day2" => "", "periods" => $periods));
        } else {
            if (equal_hours(end($daysArray)['periods'], $periods)) {
                $daysArray[count($daysArray) - 1]['day2'] = $day;
            } else {
                array_push($daysArray, array("day1" => $day, "day2" => "", "periods" => $periods));
            }
        }
    }
    if (!empty($saveSunday) && $first_day == "monday") {
        if (equal_hours(end($daysArray)['periods'], $saveSunday)) {
            $daysArray[count($daysArray) - 1]['day2'] = "Sunday";
        } else {
            array_push($daysArray, array("day1" => "Sunday", "day2" => "", "periods" => $saveSunday));
        }
    }

    return $daysArray;
}

/* Hours */

add_shortcode('rl_hours', 'shortcode_restaurant_logic_hours');
function shortcode_restaurant_logic_hours($atts, $content = null)
{
    $show_title = '';
    $hide_minutes = '';
    $first_day = '';
    $id = null;
    $display_note = '';

    extract(shortcode_atts(array(
        'show_title' => 'yes',
        'hide_minutes' => 'no',
        'id' => null,
        'first_day' => 'monday',
        'display_note' => null
    ), $atts));

    $rl_id = get_option('rl_options')['rl_id'];
    if (strtolower($first_day) == 'monday' || strtolower($first_day) == 'mon') {
        $first_day = 'monday';
    } else {
        $first_day = 'sunday';
    }

    $html = "";

    $bus_hours = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/Organizations/$rl_id/operatingHours");
    if ($bus_hours == "" || !is_array($bus_hours) || sizeof($bus_hours) == 0) {
        return "";
    }
    $selected_hours = $bus_hours[0];
    // if an id is passed try to find the hours with that id
    if ($id != null) {
        foreach ($bus_hours as $hour_choice) {
            if ((int)$hour_choice['id'] == (int)$id) {
                $selected_hours = $hour_choice;
                break;
            }
        }
    }
    $category = $selected_hours['category'];

    $hours = json_decode($selected_hours['hours']);

    $html .= "<ul class='rl-company-hours'>";
    if ($show_title == "yes") {
        $html .= "<h2 class='schedule-title'>" . $category . "</h2>";
    }

    $daysArray = get_hours_summary($hours, $first_day);

    foreach ($daysArray as $currentDay) {
        $html .= "<li>";
        $html .= "<label>" . $currentDay['day1'];
        if ($currentDay['day2'] != "") {
            $html .= " - " . $currentDay['day2'];
        }
        $html .= "</label>";
        foreach ($currentDay['periods'] as $period) {
            $hours = get_object_vars($period);
            if ($hide_minutes == "yes") {
                $html .= "<span>" .
                    (empty($hours['label']) ? '' : $hours['label'] . ': ') .
                    restaurant_logic_format_time_no_min($hours['openTime']) . " - " .
                    restaurant_logic_format_time_no_min($hours['closeTime']) . "</span><br/>";
            } else {
                $html .= "<span>" .
                    (empty($hours['label']) ? '' : $hours['label'] . ': ') .
                    restaurant_logic_format_time($hours['openTime']) . " - " .
                    restaurant_logic_format_time($hours['closeTime']) . "</span><br/>";
            }
        }
        $html .= "</li>";
    }

    $html .= "</ul>";
    if ($display_note == 'yes' || ($display_note == null && !empty($selected_hours['additional']))) {
        $html .= "<p>{$selected_hours['additional']}</p>";
    }

    return $html;
}


/* Info */

add_shortcode('rl_info', 'shortcode_restaurant_logic_info');
function shortcode_restaurant_logic_info($atts, $content = null)
{
    $show_logo = '';
    $show_company = '';
    $show_address = '';
    $map_link = '';
    $show_phone = '';
    $show_contact = '';
    $show_youtube = '';
    $show_email = '';
    $show_social = '';
    $show_facebook = '';
    $show_googleplus = '';
    $show_instagram = '';
    $show_twitter = '';

    extract(shortcode_atts(array(
        'show_logo' => 'no',
        'show_company' => 'no',
        'show_address' => 'yes',
        'map_link' => 'yes',
        'show_contact' => 'yes',
        'show_phone' => 'yes',
        'show_email' => 'no',
        'show_social' => 'yes',
        'show_facebook' => 'yes',
        'show_googleplus' => 'yes',
        'show_instagram' => 'yes',
        'show_twitter' => 'yes',
        'show_youtube' => 'yes'
    ), $atts));

    $id = get_option('rl_options')['rl_id'];

    $html = "";


    $bus_info = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/Organizations/$id");
    if ($bus_info == "") {
        return "";
    }

    $logo = $bus_info['logoImg'];
    $company = $bus_info['clientName'];
    $phone = $bus_info['phone'];
    $tollFree = $bus_info['tollFreePhone'];
    $email = $bus_info['contactEmail'];
    $facebook = $bus_info['facebookUrl'];
    $googlePlus = $bus_info['googlePlusUrl'];
    $instagram = $bus_info['instagramName'];
    $twitter = $bus_info['twitterName'];
    $youtube = $bus_info['youtubeUrl'];

    if ($show_logo == 'yes' && $logo != "") {
        $html .= "<div class='rl-logo'>";
        $html .= "<img class='logo' alt='' src='" . $logo . "' />";
        $html .= "</div>";
    }
    if ($show_company == 'yes' && $company != "") {
        $html .= "<div class='rl-company'>";
        $html .= "<p>" . $company . "</p>";
        $html .= "</div>";
    }
    if ($show_address == 'yes') {
        $html .= do_shortcode("[rl_address id=" . $id . " map_link='" . $map_link . "']");
    }
    if ($show_contact == 'yes' && ($show_phone == 'yes' || $show_email == 'yes')) {
        $html .= "<div class='rl-contact rl-phone rl-email'>";
        if ($show_phone == 'yes') {
            if ($phone != "") {
                $html .= "<p class='contact-info phone'>";
                $html .= "<a href='tel:" . $phone . "'>" . $phone . "</a>";
                $html .= "</p>";
            }
            if ($tollFree != "") {
                $html .= "<p class='contact-info phone'>";
                $html .= "<a href='tel:" . $tollFree . "'>" . $tollFree . "</a>";
                $html .= "</p>";
            }
        }
        if ($show_email == 'yes' && $email != "") {
            $html .= "<p class='contact-info email'>";
            $html .= "<a href='mailto:" . $email . "'>" . $email . "</a>";
            $html .= "</p>";
        }
        $html .= "</div>";
    }
    if ($show_social == 'yes') {
        $html .= "<div class='restaurant_logic_contact rl-social-media'>";
        $html .= "<ul class='social'>";
        if ($show_facebook == 'yes' && $facebook != "") {
            $html .= "<li class='facebook'>";
            $html .= "<a target='_blank' title='Facebook' href='https://www.facebook.com/" . $facebook . "'>";
            $html .= "<i class='icon-facebook'></i>";
            $html .= "</a>";
            $html .= "</li>";
        }
        if ($show_googleplus == 'yes' && $googlePlus != "") {
            $html .= "<li class='googleplus'>";
            $html .= "<a target='_blank' title='GooglePlus' href='https://plus.google.com/" . $googlePlus . "/posts'>";
            $html .= "<i class='icon-gplus'></i>";
            $html .= "</a>";
            $html .= "</li>";
        }
        if ($show_instagram == 'yes' && $instagram != "") {
            $html .= "<li class='instagram'>";
            $html .= "<a target='_blank' title='Instagram' href='https://instagram.com/$instagram'>";
            $html .= "<i class='icon-instagram'></i>";
            $html .= "</a>";
            $html .= "</li>";
        }
        if ($show_twitter == 'yes' && $twitter != "") {
            $html .= "
                <li class='twitter'>
                    <a target='_blank' title='Twitter' href='https://twitter.com/$twitter'>
                    <i class='icon-twitter'></i>
                    </a>
                </li>
            ";
        }
        if ($show_youtube == 'yes' && $youtube != "") {
            $html .= "
                <li class='youtube'>
                    <a target='_blank' title='Youtube' href='https://www.youtube.com/user/$youtube'>
                        <i class='icon-play'></i>
                    </a>
                </li>
            ";
        }
        $html .= "</ul></div>";
    }

    return $html;
}

/* Address */

add_shortcode('rl_address', 'shortcode_restaurant_logic_address');
function shortcode_restaurant_logic_address($atts, $content = null)
{
    $map_link = '';
    extract(shortcode_atts(array(
        'map_link' => ''
    ), $atts));

    $id = get_option('rl_options')['rl_id'];
    if ($map_link == '') {
        $map_link = 'yes';
    }

    $html = "";


    $bus_address = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/Organizations/" . $id . "/address");
    if ($bus_address == "") {
        return "";
    }

    $street = $bus_address['address'];
    $cityStZip = $bus_address['city'] . ", " . $bus_address['state'] . " " . $bus_address['zip'];
    $citySt = $bus_address['city'] . ", " . $bus_address['state'];
    $zip = $bus_address['zip'];
    $streetCityStZip = $street . " " . $cityStZip;
    $maps = str_replace(" ", "+", $streetCityStZip);
    $maps = str_replace(",", "%2C", $maps);

    $html .= "<div class='rl-contact rl-address'>";
    $html .= "<p>";
    if ($map_link == 'yes') {
        $html .= "
            <a href='https://www.google.com/maps/place/{$maps}' target='_blank'>
                <span class='contact-info street'>" . $street . "</span><br />
                <span class='contact-info city-state'>" . $citySt . "</span>
                <span class='contact-info zip'>" . $zip . "</span>
            </a>
            ";

    } else {
        $html .= "$street</br />$cityStZip";
    }
    $html .= "</p></div>";

    return $html;
}

/* Social Media */

add_shortcode('rl_social', 'shortcode_restaurant_logic_social');
function shortcode_restaurant_logic_social($atts, $content = null)
{
    $show_facebook = $show_googleplus = $show_instagram = $show_twitter = $show_youtube = '';
    extract(shortcode_atts(array(
        'show_facebook' => '',
        'show_googleplus' => '',
        'show_instagram' => '',
        'show_twitter' => '',
        'show_youtube' => ''
    ), $atts));

    if ($show_facebook == '') {
        $show_facebook = 'yes';
    }
    if ($show_googleplus == '') {
        $show_googleplus = 'yes';
    }
    if ($show_instagram == '') {
        $show_instagram = 'yes';
    }
    if ($show_twitter == '') {
        $show_twitter = 'yes';
    }
    if ($show_youtube == '') {
        $show_youtube = 'yes';
    }

    return do_shortcode("[rl_info show_logo='no' show_company='no' show_address='no' show_contact='no' show_facebook='{$show_facebook}' show_googleplus='{$show_googleplus}' show_instagram='{$show_instagram}' show_twitter='{$show_twitter}' show_youtube='{$show_youtube}']");
}

/* Company Logo */

add_shortcode('rl_logo', 'shortcode_restaurant_logic_logo');
function shortcode_restaurant_logic_logo($atts, $content = null)
{
    extract(shortcode_atts(array(), $atts));

    return do_shortcode("[rl_info show_logo='yes' show_company='no' show_address='no' show_contact='no' show_social='no']");
}

/* Company Name */

add_shortcode('rl_company', 'shortcode_restaurant_logic_company');
function shortcode_restaurant_logic_company($atts, $content = null)
{
    extract(shortcode_atts(array(), $atts));

    return do_shortcode("[rl_info show_logo='no' show_company='yes' show_address='no' show_contact='no' show_social='no']");
}

/* Contact Info (Phone & Email) */

add_shortcode('rl_contact', 'shortcode_restaurant_logic_contact');
function shortcode_restaurant_logic_contact($atts, $content = null)
{
    $show_phone = $show_email = '';
    extract(shortcode_atts(array(
        'show_phone' => '',
        'show_email' => ''
    ), $atts));

    if ($show_phone == '') {
        $show_phone = 'yes';
    }
    if ($show_email == '') {
        $show_email = 'no';
    }

    return do_shortcode("[rl_info show_logo='no' show_company='no' show_address='no' show_contact='yes' show_phone='{$show_phone}' show_email='{$show_email}' show_social='no']");
}

/* Image Gallery */

add_shortcode('rl_gallery', 'shortcode_restaurant_logic_gallery');
function shortcode_restaurant_logic_gallery($atts, $content = null)
{
    $name = '';
    extract(shortcode_atts(array(
        'name' => ''
    ), $atts));

    $id = get_option('rl_options')['rl_id'];
    $name = rtrim($name, '/'); // Incase user enters 'gallery/'

    $html = "";

    $directory = "https://logic-engine.com/files/userfiles/{$id}/images/{$name}/";

    $urlData = restaurant_logic_get_data($directory);
    if ($urlData == "") {
        return "";
    }

    $doc = new DOMDocument();
    $doc->loadHTML($urlData);
    $aTags = $doc->getElementsByTagName('a');
    $images = array();
    foreach ($aTags as $tag) {
        $fileName = $directory . $tag->getAttribute('href');
        if (strtolower(substr($fileName, -4)) == ".jpg" || strtolower(substr($fileName, -4)) == ".png" || strtolower(substr($fileName, -4)) == ".bmp" || strtolower(substr($fileName, -5)) == ".jpeg") {
            $images[] = $fileName;
        }
    }

    wp_enqueue_script('restaurant_logic_blank', plugins_url('javascripts/blank.js', __FILE__));
    wp_add_inline_script('restaurant_logic_blank', "jQuery(document).ready(function(){jQuery('.gallery-images').each(function(i,el){jQuery(el).justifiedGallery({rel:'gal'+i,rowHeight:150,maxRowHeight:150,fixedHeight:true,randomize:true,captions:true,lastRow:'justify',sizeRangeSuffixes:{'lt100':'','lt240':'','lt320':'','lt500':'','lt640':'','lt1024':''}}).on('jg.complete',function(){jQuery(this).find('a').colorbox({maxWidth:'80%',maxHeight:'80%',opacity:0.8,transition:'elastic',current:''});});});});");

    if (!empty($images)) {
        $html .= "<div class='gallery-images clearfix'>";

        foreach ($images as $image) {
            $html .= "<a href='" . $image . "'><img src='" . $image . "' alt='' /></a>";
        }

        $html .= "</div>";
    }

    return $html;
}


function restaurant_logic_format_time($theTime)
{
    // normalize 12am
    if ((int)$theTime == 0) {
        $theTime = 2400;
    }

    /* Incoming times could be: 30, 930 or 2030 (12:30am, 9:30am or 8:30pm) */
    if (strlen($theTime) < 3) {
        $theHour = "24";
        $theMin = str_pad($theTime, 2, '0');
    } else if (strlen($theTime) < 4) {
        $theHour = substr($theTime, 0, 1);
        $theMin = substr($theTime, 1, 2);
    } else {
        $theHour = substr($theTime, 0, 2);
        $theMin = substr($theTime, 2, 2);
    }

    $pmHr = (int)$theHour - 12;
    if ((int)$theHour < 12 || (int)$theHour > 23) {
        $hr = ((int)$theHour == 24) ? $pmHr . ":" . $theMin . "am" : $theHour . ":" . $theMin . "am";
    } else {
        $hr = ((int)$theHour > 12) ? $pmHr . ":" . $theMin . "pm" : $theHour . ":" . $theMin . "pm";
    }

    return $hr;
}

function restaurant_logic_format_time_no_min($theTime)
{
    // normalize 12am
    if ((int)$theTime == 0) {
        $theTime = 2400;
    }

    /* Incoming times could be: 930 or 2030 (9:30am or 8:30pm) */
    if (strlen($theTime) < 4) {
        $theHour = substr($theTime, 0, 1);
        $theMin = substr($theTime, 1, 2);
    } else {
        $theHour = substr($theTime, 0, 2);
        $theMin = substr($theTime, 2, 2);
    }

    $pmHr = (int)$theHour - 12;
    $min = ($theMin == "00") ? "" : ":" . $theMin;
    if ((int)$theHour < 12 || (int)$theHour > 23) {
        $hr = ((int)$theHour == 24) ? $pmHr . $min . "am" : $theHour . $min . "am";
    } else {
        $hr = ((int)$theHour > 12) ? $pmHr . $min . "pm" : $theHour . $min . "pm";
    }

    return $hr;
}

