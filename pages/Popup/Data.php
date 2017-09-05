<?php

namespace ui\Pages\Popup;

class Data extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('../Root/PopupStore.js', 'Data/Data.js');
    }

    public function render()
    {
        return $this->loadFile('Data/Data.html');
    }
}
