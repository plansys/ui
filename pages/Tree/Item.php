<?php

namespace ui\Pages\Tree;

class Item extends \Yard\Page
{
    public function render() {
        $this->loadFile('Item/Item.html');
    }
}