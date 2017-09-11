<?php

namespace ui\Pages\Layout;

class Separator extends \Yard\Page {
    public $library = true;

    public function css() {
        return $this->loadFile("_Separator/Separator.css");
    }

    public function js() {
        return $this->loadFile("_Separator/Separator.js");
    }

    public function render() {
        return $this->loadFile("_Separator/Separator.html");
    }
}