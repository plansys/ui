<?php

namespace ui\Pages\Icon;

class Plus extends \ui\Pages\IconBase {
    
    public function render() {
return <<<HTML
    <span className="icon">
        <svg width="js: this.props.size + 'px'" height="js: this.props.size + 'px'" viewBox="js: '0 0 ' + this.state.size " version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="icon-plus" viewBox="js: '0 0 ' + this.state.size" fill="js: this.state.fill">
            <title>add</title>
            <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
            </g>
        </svg>
    </span>
HTML;
    }
}