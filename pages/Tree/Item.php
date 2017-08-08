<?php

namespace ui\Pages\Tree;

class Item extends \Yard\Page {
    public $norender = true;

    public function render() {
        return $this->loadFile("Item/Item.html");
    }
}