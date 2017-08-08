<?php

namespace Pages\Row;

class Row extends \Yard\Page {
    public $norender = true;
    
    public function css() {
        return $this->loadFile("Row.css");
    }
    
    public function propTypes() {
        return [
            'height' => 'number.isRequired'
        ];
    }
    
    public function js() {
        return $this->loadFile("Row.js");
    }
    
    public function render() {
        return $this->loadFile("Row.html");
    }
}