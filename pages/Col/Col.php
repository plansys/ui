<?php

namespace Pages\Col;

class Col extends \Yard\Page {
    public $norender = true;
    
    public function js() {
        return $this->loadFile('Col.js');
    }

    public function css() {
        return $this->loadFile("Col.css");
    }    
    
    public function render() {
        return $this->loadFile("Col.html");
    }
}