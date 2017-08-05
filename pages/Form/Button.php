<?php

namespace ui\Pages\Form;

class Button extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <button className="js: this.props.className" id="js: this.props.id" onClick="js: this.props.onClick">
        <js>this.props.children</js>
    </button>
HTML;
    }

    public function css() {
return <<<CSS
    button {
        border: 1px solid;
        background-color: #aaa;
        padding: 5px;
        box-sizing: border-box;
        font-size: 14px;
    }

    button:hover {
        background-color: #45adfe;
    }
CSS;

    }
}