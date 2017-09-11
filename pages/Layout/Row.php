<?php

namespace ui\Pages\Layout;

class Row extends \Yard\Page
{
    public $library = true;

    public function propTypes()
    {
        return [
            'height' => 'number.isRequired'
        ];
    }

    public function css()
    {
        return <<<CSS
.layout-row {
    flex:1 1 auto;
    display:flex;
    box-sizing: border-box;
}
CSS;
    }


    public function includeJS()
    {
        return [
            'Base.js'
        ];
    }

    public function js()
    {
        return $this->loadFile("_Row/Row.js");
    }

    public function render()
    {
        return $this->loadFile("_Row/Row.html");
    }
}