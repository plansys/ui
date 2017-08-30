<?php

namespace ui\Pages\Tab;

class Nav extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Nav/Nav.js');
    }

    public function render()
    {
        return $this->loadFile('Nav/Nav.html');
    }

}