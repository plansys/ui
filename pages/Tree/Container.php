<?php

namespace ui\Pages\Tree;

class Container extends \Yard\Page {
    public function css() {
return <<<CSS
    // .layout-fullscreen {
    //     position:fixed;
    //     top:0px;
    //     left:0px;
    //     right:0px;
    //     bottom:0px;
    //     z-index:100;
    //     display:flex;
    //     flex-direction: row;
    // }
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
          let currentLevel = 0

          const recursive = (currentDatas) => {
            return currentDatas.map((item) => {
              if (!item.uniq) item.uniq = new Date().toISOString()
              item.level = currentLevel
              // inject event
              item.set = (shouldReturnNewItem) => this.mutateItem(item, shouldReturnNewItem, currentDatas, datas)
              if (item.sub.length) {
                currentLevel++
                recursive(item.sub)
              }
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
      <div>
        <js>
          let recursiveRender = (items) => {
            return <el>
              <ul>
                <js>items.map((item, i) => {
                  return <el>
                    <li key="js: i">
                      <span onClick="js: this.handleClick.bind(null, item)"><js>item.name</js></span>
                      <js>item.sub ? recursiveRender(item.sub) : null</js>
                    </li>
                  </el>
                })</js>
              </ul>
            </el>
          }

          return <el>
            <h1><js>this.recursiveRender(this.props.data)</js></h1>
          </el>
        </js>
      </div>
HTML;
    }
}
