<?php

use PHPUnit\Framework\TestCase;
include 'php/request.php';

final class RequestTest extends TestCase {

    public function testCanMakeRequest()
    {
        $res = get_data(
            'https://api.restaurant-logic.com/api/MenuSections?filter=%7B%22include%22%3A%5B%5D%2C%22where%22%3A%7B%22organizationId%22%3A%22382%22%2C%22deleted%22%3Afalse%2C%22active%22%3Atrue%7D%7D'
        );
        $this->assertSame(
            $res[0]['id'],
            1018
        );
    }
}


