<?php

function restaurant_logic_get_data($url)
{
    if(!$url || !is_string($url) || ! preg_match('/^http(s)?:\/\/[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(\/.*)?$/i', $url)){
        return false;
    }

    $data = wp_remote_get($url);

    return json_decode(wp_remote_retrieve_body($data), true);
}

