<?php

namespace Plansys\Ui;

class Init
{
    public static function getBase($host)
    {
        return [
            'dir'=> realpath(dirname(__FILE__) . '/..') . '/pages',
            'url' => '/' . trim($host, '/') . '/vendor/plansys/ui/pages/'
        ];
    }
}
