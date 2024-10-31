<?php
function restaurant_logic_get_all_forms()
{
    $id = get_option('rl_options')['rl_id'];
    $forms = restaurant_logic_get_data('https://api.restaurant-logic.com:443/api/Forms?filter={"include":[],"where":{"organizationId":"' . $id . '","deleted":false}}');
    if ($forms == "") {
        return "";
    }
    ?>
    <table>
        <caption>Current Forms created in Restaurant Logic</caption>
        <thead>
        <tr>
            <th>Form Id</th>
            <th>Form Name</th>
            <th>Form Type</th>
        </tr>
        </thead>
        <tbody>
        <?php
        foreach ($forms as $form_item) {
            $form_id = $form_item['id'];
            $form_name = $form_item['name'];
            $form_type = strip_tags($form_item['type']);
            ?>
            <tr>
                <td><?php echo $form_id; ?></td>
                <td><?php echo $form_name; ?></td>
                <td><?php echo $form_type; ?></td>
            </tr>
            <?php
        }
        ?>
        </tbody>
    </table>
    <?php
}

