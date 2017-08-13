<?php

namespace ui\Pages\Tree;

class Container extends \Yard\Page {
    public function css() {
return <<<CSS
    .Tree-container {
      background: #2b2b2b;
      padding: 7px;
      display: inline-block;
      color: white;
    }
    .Tree-container ul {
      padding-left: 0;
      list-style: none;
    }
    .Tree-container ul li {
      padding-left: 15px;
      padding: 5px 10px;
      cursor: pointer;
    }
CSS;
    }
    public function js() {
      return <<<JS

        this.mutateItem = (target, newItem, parent, allData) => {
          let newData = allData
          let found = false
          const recursive = (currentDatas) => {
            if (found) return
            return currentDatas.forEach((item) => {
              const isTarget = item.uniq === target.uniq && item.level === target.level
              if (isTarget) {
                found = true
                item = {...item, ...newItem}
              }
            })
          }
          recursive(newData)
          return newData
        }


        this.makeUniqId = (datas) => {
          const recursive = (currentDatas) => {
            const currentLevel = currentDatas.level || 0
            return currentDatas.map((item) => {
              if (!item.uniq) item.uniq = new Date().toISOString()
              item.level = currentLevel
              item.set = (newItem) => this.mutateItem(item, newItem, currentDatas, datas)
              if (item.sub.length) {
                item.sub.level = currentLevel + 1
                recursive(item.sub)
              }
              item.getSiblings = () => item.sub
              return item
            })
          }
          return recursive(datas)
        }


        this.recursiveRender = (datas) => {
          datas = this.makeUniqId(datas)
          return this.props.onShouldRenderChild(datas)
        }
JS;
    }
    public function render() {
return <<<HTML
      <div className="Tree-container">
        <js>this.recursiveRender(this.props.data)</js>
      </div>
HTML;
    }
}
