<?php

namespace ui\Pages\Tabs;

class Navigation extends \Yard\Page {

    public function render() {
return <<<HTML
    <div className="tab-nav">
        <js>
            var options = [];
            if (!!this.props.nav) {
                Object.keys(this.props.nav).map((key, index) => {
                    var value = this.props.nav[key];
                    if(!this.props.closeAble) {
                        if(this.props.active !== key) {
                            options.push(<el><ui:Form.Button id="js: 'nav-' + key"
                                onClick="js: (e) => { this.openTab(e, key) }"><js>value</js></ui:Form.Button></el>);
                        } else {
                            options.push(<el><ui:Form.Button id="js: 'nav-' + key"
                                onClick="js: (e) => { this.openTab(e, key) }" className="active"><js>value</js></ui:Form.Button></el>);
                        }
                    } else {
                        if(this.props.active !== key) {
                            options.push(<el><ui:Form.Button id="js: 'nav-' + key"
                                onClick="js: (e) => { this.openTab(e, key) }"><js>value</js>
                                <ui:Form.Button className="close">
                                    <ui:Icon.Remove size="8"/>
                                </ui:Form.Button>
                            </ui:Form.Button></el>);
                        } else {
                            options.push(<el><ui:Form.Button id="js: 'nav-' + key"
                                onClick="js: (e) => { this.openTab(e, key) }" className="active"><js>value</js>
                                <ui:Form.Button className="close">
                                    <ui:Icon.Remove size="8"/>
                                </ui:Form.Button>
                            </ui:Form.Button></el>);
                        }
                    }
                });
            }
            return options;
        </js>
    </div>
HTML;
    }

    public function js() {
return <<<JS
    this.openTab = function(e, openKey) {
        e.stopPropagation();
        e.preventDefault();
        var tabs = this.props.nav;
        if (!!tabs) {
            for(var i in tabs) {
                if(this.props.nav.hasOwnProperty(i)) {
                    var value = this.props.nav[i];
                    var key = i;
                    if (Array.isArray(this.props.nav)) {
                        key = value;
                    }
                }
                
                var nav = document.getElementById('nav-' + key);
                var content = document.getElementById(key + '-container');
                if(!!nav && !!content) {
                    if(key == openKey) {
                        this.addClass(nav, 'active');
                        this.addClass(content, 'active');
                        if(typeof this.props.onTabChange === 'function') {
                            this.props.onTabChange(key);
                        }
                    } else {
                        this.removeClass(nav, 'active');
                        this.removeClass(content, 'active');
                    }
                }
            }
        }
    }
    
    this.hasClass = function(el, className) {
        if (el.classList)
          return el.classList.contains(className)
        else
          return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }
    
    this.addClass = function(el, className) {
        if (el.classList)
          el.classList.add(className)
        else if (!this.hasClass(el, className)) el.className += " " + className
    }
    
    this.removeClass = function(el, className) {
        if (el.classList)
            el.classList.remove(className)
        else if (this.hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
        }
    }
JS;
    }

    public function css() {
return <<<CSS
    .tab-nav {
        margin: 10px 0;
        border-bottom: 1px solid #fff;
        display: flex;
        align-items: center;
        position: relative;
        left: 0px;
        overflow: hidden;
    }

    .tab-nav button {
        font-size: 14px;
        padding: 5px;
        position: relative;
        bottom: 0px;
        box-sizing: border-box;
    }

    .tab-nav button.close {
        background-color: transparent;
        margin: 0;
        margin-left: 10px;
        height: 16px;
        padding: 0;
        border: none;
        border-radius: 4px;
        position: relative;
        top: -1px;
    }
    
    .tab-nav button.close:hover {
        background-color: #fe1c4a;
    }

    .tab-nav button.active {
        border: 1px solid;
        border-bottom : 1px solid #fff;
        background-color: #fff;
    }
CSS;
    }
}