<?php

namespace ui\Pages\Form;

class SectionSeparator extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <div className="section-separator">
       <js>this.props.title</js>
    </div>
HTML;
    }

    public function css() {
return <<<CSS
    .section-separator {
        /*height: px;*/
        /*line-height: 30px;*/
        font-size: 15px;
        padding: 5px 20px;
        margin: 5px 0;
        margin-left: -10px;
        width: 100%;
        background-color: #ababab;
        color: #fff;
    }
CSS;
    }
}