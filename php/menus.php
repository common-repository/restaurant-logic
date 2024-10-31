<?php

function restaurant_logic_get_all_menus()
{
    $id = get_option('rl_options')['rl_id'];
    $url = 'https://api.restaurant-logic.com:443/api/MenuSections?filter={"include":[],"where":{"organizationId":"' . $id . '","deleted":false,"active":true}}';
    $menus = restaurant_logic_get_data($url);
    if ($menus == "") {
        return "";
    }
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
        foreach ($menus as $menu_item) {
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