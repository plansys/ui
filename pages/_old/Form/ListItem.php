<?php

namespace ui\Pages\Form;

class ListItem extends \Yard\Page {
    
    public function render() {
return <<<HTML
    <ul id="js: this.props.parentId ? 'ul-' + this.props.parentId : ''" className="js: !this.props.parentId ? 'list expand' : 'list'">
        <js>
            var listItem = []
            Object.keys(this.props.listData).map((key, i) => {
                var list = this.props.listData[key];
                var id = this.props.parentId ? this.props.parentId + '-' : '';
                id += 'li' + i;
                var path = this.props.parentPath ? this.props.parentPath + '|' : '';
                path += key
                listItem.push(<el>
                <li id="js: id" className="js: list.className"
                    onClick="js: (e) => { this.openList(e, id, path, list.action) }">
                        <js>list.content</js>
                    </li>
                </el>);
                if(list.child) {
                    listItem.push(<el>
                        <ui:Form.ListItem listData="js: list.child" parentId="js: id" parentPath="js: path"
                            onClickCallback="js: this.props.onClickCallback"/>
                    </el>);
                }
            });
            return listItem;
        </js>
    </ul>
HTML;
    }

    public function js() {
return <<<JS
    this.openList = function(e, id, path, action) {
        e.stopPropagation();
        e.preventDefault();
        var tree = document.getElementById('ul-' + id);
        if(!!tree) {
            if(action == 'expand') {
                if(this.hasClass(tree, 'expand')) {
                    this.removeClass(tree, 'expand');
                } else {
                    this.addClass(tree, 'expand');
                }
            }
        } else {
            if(typeof this.props.onClickCallback === 'function') {
                this.props.onClickCallback(path);
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
    li:hover {
        background-color: #0067f5;
        cursor: pointer;
        cursor: hand;
    }

    ul.list {
        max-height: 0;
        overflow: hidden;
        transition: max-height 1.8s ease-out -1.5s;
    }
    
    ul.list.expand {
        max-height: 9000px;
        transition: max-height 1.8s ease-in;
    }
CSS;
    }
}