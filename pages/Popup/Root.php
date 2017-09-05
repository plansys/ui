<?php

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
    }

    public function js()
    {
        return $this->loadFile('Root/Root.js');
    }

    public function render()
    {
        return $this->loadFile('Root/Root.html');
    }
}
