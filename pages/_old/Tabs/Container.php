<?php

namespace ui\Pages\Tabs;

class Container extends \Yard\Page {

    public function render() {
return <<<HTML
    <div className="js: 'tab-container ' + (this.props.className ? this.props.className : '') +
     ' ' + (this.props.active == this.props.id ? 'active' : '')" id="js: this.props.id">
        <js>this.props.children</js>
    </div>
HTML;
    }

    public function css() {
return <<<CSS
    .tab-container {
        padding: 10px;
        display: none;
        height: 100%;
    }
    
    .tab-container.active {
        display: flex;
        flex-direction: column;
    }
CSS;
    }
}