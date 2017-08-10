<?php

namespace ui\Pages\Layout;

class Col extends \Yard\Page {
    public $norender = true;

    public function propTypes() {
        return [
            'width' => 'number.isRequired'
        ];
    }

    public function css() {
        return <<<CSS
.layout-col {
    flex:1 1 auto;
    display:flex;
    box-sizing: border-box;
}
CSS;
    }

    public function js() {
        return $this->loadFile("Base.js", "Col/Col.js");
    }

    public function render() {
        return $this->loadFile("Col/Col.html");
    }
}