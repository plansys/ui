<?php

namespace ui\Pages\Form;

class Select extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <div className="js: 'form-field ' + (this.props.vertical ? 'vertical' : '')">
        <label for="js: this.props.name"><js>this.props.label</js></label>
        <select id="js: this.props.name" name="js: this.props.name" onChange="js: (e) => { this.onChange(e); }">
            <js>
                var options = [];
                if (!!this.props.options) {
                    for(var i in this.props.options) {
                        if(this.props.options.hasOwnProperty(i)) {
                            var value = this.props.options[i];
                            var key = i;
                            if (Array.isArray(this.props.options)) {
                                key = value;
                            }
                            
                            if(this.props.select !== key) {
                                options.push(<el><option value="js: key"><js>value</js></option></el>);
                            } else {
                                options.push(<el><option value="js: key" selected="selected"><js>value</js></option></el>);
                            }
                        }
                    }
                }
                return options;
            </js>
        </select>
    </div>
HTML;
    }

    public function js() {
return <<<JS
    this.onChange = function(e) {
      if(typeof this.props.onChangeCallback === 'function') {
        
      }
    }
JS;
    }

    public function css() {
return <<<CSS
    select {
        background-color: #a8d4fe;
    }
CSS;
    }
}