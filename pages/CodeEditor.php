<?php

namespace ui\Pages;

class CodeEditor extends \Yard\Page
{
    // public $norender = true;

    public function js() {
        return $this->loadFile('CodeEditor.js');
    }

    public function render()
    {
        return <<<HTML
        <div>
            ini code editor
        </div>
HTML;
    }
}
