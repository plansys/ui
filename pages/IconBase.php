<?php

namespace ui\Pages;

class IconBase extends \Yard\Page {
    public function js() {
return <<<JS
    
    this.state = {
        size: '32 32',
        fill: '#000'
    }
    
    this.on("compoentWillMount", () => {
        this.setState({
            size: this.props.size + ' ' + this.props.size,
            fill: this.props.color
        });
    });

JS;
    }
    
    public function css() {
return <<<CSS
    .icon {
        display: inline;
        margin: 3px;
    }
CSS;
    }
    
}