<?php

function restaurant_logic_get_all_images()
{
    return "";
    $id = get_option('rl_options')['rl_id'];
    $url = 'https://logic-engine.com/files/userfiles/' . $id . '/images/Gallery/';
    $response = wp_remote_get($url);
    $body = wp_remote_retrieve_body($response);
    $dom = new DOMDocument;
    $dom->loadHTML($body);
    $list = $dom->getElementsByTagName('li');

    if ($list->length === 0) {
        return "";
    }

    foreach ($list as $li) {
        printf($li->nodeValue, PHP_EOL);
        printf($li->firstChild->getAttribute('href'), PHP_EOL);
    }
    $images = [];

    ?>
    <table>
        <caption>Current Menus created in Restaurant Logic</caption>
        <thead>
        <tr>
            <th>Menu Id</th>
            <th>Menu Name</th>
            <th>Menu Description</th>
        </tr>
        </thead>
        <tbody>
        <?php
        foreach ($images as $menu_item) {
            $menu_id = $menu_item['id'];
            $menu_name = $menu_item['name'];
            $menu_desc = strip_tags($menu_item['description']);
            ?>
            <tr>
                <td><?php echo $menu_id; ?></td>
                <td><?php echo $menu_name; ?></td>
                <td><?php echo $menu_desc; ?></td>
            </tr>
            <?php
        }
        ?>
        </tbody>
    </table>
    <?php
}