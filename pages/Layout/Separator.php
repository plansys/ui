<?php

namespace ui\Pages\Layout;

class Separator extends \Yard\Page {
    public $norender = true;

    public function css() {
        return $this->loadFile("Separator/Separator.css");
    }

    public function js() {
        return $this->loadFile("Separator/Separator.js");
    }

    public function render() {
        return $this->loadFile("Separator/Separator.html");
    }
}