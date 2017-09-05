<?php

<<<<<<< HEAD
namespace ui\Pages\Popup;

class Root extends \Yard\Page
{
    public function css() {
      return $this->loadFile('Root/Root.css');
=======
namespace ui\Pages\PopUp;

class Root extends \Yard\Page
{

    public function includeJS()
    {
        return [
            'Root/PopUpStore.js'
        ];
    }

    public function css() {
        return $this->loadFile('Root/Root.css');
>>>>>>> c863fc717ad0c861203d090a1e00f4fc5125855f
    }

    public function js()
    {
<<<<<<< HEAD
        return $this->loadFile('Root/PopupStore.js', 'Root/Root.js');
=======
        return $this->loadFile('Root/Root.js');
>>>>>>> c863fc717ad0c861203d090a1e00f4fc5125855f
    }

    public function render()
    {
        return $this->loadFile('Root/Root.html');
    }
}
