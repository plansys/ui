<?php

namespace ui\Pages\Form;

class FormContainer extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <div className="js: 'form-container' + (this.props.className ? ' ' + this.props.className : '')"
        style="js: this.props.style">
            <js>this.props.children</js>
    </div>
HTML;
    }

    public function css() {
return <<<CSS
    .form-container .form-field {
        display: flex;
        flex-direction: row;
        margin: 10px;
    }
    .form-container .form-field.vertical {
        flex-direction: column;
    }
    .form-field label {
        flex: 2;
    }
    .form-field input, .form-field select, .form-field textarea {
        flex: 6;
    }
    .form-field.vertical label {
        flex: 1;
    }
    .form-field.vertical input, .form-field.vertical select, .form-field.vertical textarea {
        flex: 1;
    }
    .form-container button {
        margin: 10px;
    }
CSS;

    }
}