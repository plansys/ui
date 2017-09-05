<?php

namespace ui\Pages\Menu;

class ContextMenu extends \Yard\Page
{
    public function css() {
      return $this->loadFile('ContextMenu/Root.css');
    }

    public function js()
    {
        return $this->loadFile('ContextMenu/Root.js');
    }

    public function render()
    {
        return $this->loadFile('ContextMenu/Root.html');
    }
}
