<?php

namespace ui\Pages\Form;

class TreeView extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <div className="tree-view">
        <el><ui:Form.ListItem listData="js: this.props.treeData" onClickCallback="js: this.props.onClickCallback"/></el>
    </div>
HTML;
    }

    public function js() {
return <<<JS
    
JS;
    }

    public function css() {
return <<<CSS
    
CSS;
    }
}