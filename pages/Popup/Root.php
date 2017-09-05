<?php

namespace ui\Pages\Popup;

class Root extends \Yard\Page
{
    public function css() {
      return $this->loadFile('Root/Root.css');
    }

    public function js()
    {
        return $this->loadFile('Root/PopupStore.js', 'Root/Root.js');
    }

    public function render()
    {
        return $this->loadFile('Root/Root.html');
    }
}
