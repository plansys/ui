<?php

namespace ui\Pages\Form;

class Textbox extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <div className="js: 'form-field ' + (this.props.vertical ? 'vertical' : '')">
        <js>
            <label for="js: this.props.name"><js>this.props.label</js></label>
        </js>
        <input id="js: this.props.name" name="js: this.props.name" type="text" onChange="js: (e) => { this.onChangeHandler(e); }" value="js: this.props.data"/>
    </div>
HTML;
    }

    public function js() {
return <<<JS
    this.changeHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var input = document.getElementById(this.props.name).value;
        if(typeof this.props.onChangeCallback === 'function') {
            this.props.onChangeCallback(this.props.name, input);
        }
    }
JS;
    }

    public function css() {
return <<<CSS
    
CSS;
    }
}