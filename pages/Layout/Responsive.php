<?php

namespace ui\Pages\Layout;

class Responsive extends \Yard\Page {
    public $norender = true;

    public function js() {
        return $this->loadFile("_Responsive/Responsive.js");
    }

    public function render() {
        return <<<HTML
    <js:this.state.tag className="layout-fullscreen" style="js: this.getStyle()">
        <js>this.renderChild()</js>
    </js:this.state.tag>
HTML;
    }
}