<?php

namespace Plansys\Ui;

class Init
{
    public static function getBase($host)
    {
        return [
            'pages' => [
                '' => [
                    'dir'=> realpath(dirname(__FILE__) . '/..') . '/pages',
                    'url' => $host . '/pages/'
                ]
            ]
        ];
    }
}
