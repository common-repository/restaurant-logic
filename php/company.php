<?php

function restaurant_logic_get_company_info()
{
    $id = get_option('rl_options')['rl_id'];
    $bus_info = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/Organizations/" . $id);
    $address_info = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/Organizations/" . $id . "/address");
    $bus_hours = restaurant_logic_get_data("https://api.restaurant-logic.com:443/api/Organizations/" . $id . "/operatingHours");

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
    $address = $address_info['address'];
    $city = $address_info['city'];
    $state = $address_info['state'];
    $zip = $address_info['zip'];
    $hours = [];
    if ($bus_hours != null) {
        foreach($bus_hours as $hour) {
            $hour['hours'] = json_decode($hour['hours']);
            array_push($hours, $hour);
        }
    }
    $info = array("logo" => $logo,
        "name" => $company,
        "phone" => $phone,
        "tollFree" => $tollFree,
        "email" => $email,
        "facebook" => $facebook,
        "googlePlus" => $googlePlus,
        "instagram" => $instagram,
        "twitter" => $twitter,
        "address" => $address,
        "city" => $city,
        "state" => $state,
        "zip" => $zip,
        "hours" => $hours
    );

    return $info;
}
