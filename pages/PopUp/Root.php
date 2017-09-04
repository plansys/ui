<?php

namespace ui\Pages\PopUp;

class Root extends \Yard\Page
{
    public function js()
    {
      return $this->loadFile('PopUpStore.js', 'Root/Root.js');
    }

    public function render()
    {
      return $this->loadFile('Root/Root.html');
    }
}
