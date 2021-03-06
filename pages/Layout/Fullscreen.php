<?php

namespace ui\Pages\Layout;

class Fullscreen extends \Yard\Page
{
    public $library = true;

    public function css()
    {
        return <<<CSS
    .layout-fullscreen {
        position:fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        z-index:100;
        display:flex;
        flex-direction: row;
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
        return $this->loadFile('_Fullscreen/index.js');
    }

    public function render()
    {
        return <<<HTML
    <js:this.state.tag className="layout-fullscreen" style="js: this.getStyle()">
        <js>this.renderChild()</js>
    </js:this.state.tag>
HTML;
    }
}