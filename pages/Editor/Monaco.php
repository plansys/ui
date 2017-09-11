<?php

namespace ui\Pages\Editor;

use Yard\Page;

class Monaco extends Page
{
    public function includeJS()
    {
        return [
            '_Monaco/loader.js'
        ];
    }

    public function js()
    {
        return $this->loadFile('_Monaco/Monaco.js');
    }

    public function render()
    {
        return '<div id="container">JOS INI JOS</div>';
    }
}