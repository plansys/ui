<?php

namespace ui\Pages\Editor;

class CodeEditor extends \Yard\Page
{
    public function render()
    {
return <<<HTML
    <div className="code-editor-container">
        <div className="title"><js>this.props.title</js></div>
        <div className="code-editor">
            <textarea id="js: this.props.dataId" onChange="js: (e) => { this.onChangeHandler(e) }"><js>this.props.children</js></textarea>
        </div>
    </div>
HTML;
    }

    public function js() {
return <<<JS
    this.onChangeHandler = function(e) {
        var data = document.getElementById(this.props.dataId).value;
        if(typeof this.props.onDataChange === 'function') {
            this.props.onDataChange(this.props.dataId, data);
        }
    }
JS;
    }

    public function css() {
return <<<CSS
    .code-editor-container {
        height: 100%;
        flex: 1;
        display: flex;
        position: relative;
        flex-direction: column;
        background-color: #000;
    }
    .code-editor {
        background-color: #333;
        color: #fff;
        padding: 10px;
        display: block;
        /*position: relative;*/
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        /*align-items: flex-start;*/
        box-sizing: border-box;
    }
    
    .code-editor textarea {
        background-color: #000;
        color: #fff;
        /*margin: 10px;*/
        display: block;
        /*position: absolute;*/
        /*left: 0px;*/
        /*right: 0px;*/
        /*top: 0px;*/
        /*bottom: 0px;*/
        /*width: 100%;*/
        /*height: 100%;*/
        flex: 1;
        /*height: 100%;*/
        font-size: 14px;
        font-family: Consolas;
        overflow: auto;
        box-sizing: border-box;
    }

    .title {
        padding: 4px 10px;
        background-color: #2c2c2c;
        color: #fff;
        flex: 0 0 18px;
    }
CSS;
    }
}
