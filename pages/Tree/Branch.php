<?php

namespace ui\Pages\Tree;

class Branch extends \Yard\Page {
    public function css() {
return <<<CSS
CSS;
    }
    public function js() {
      return <<<JS
JS;
    }
    public function render() {
return <<<HTML
      <ul>
        <js>
          const { items, onClick, renderMethod } = this.props
          return items.map((item, i) => {
            return <el>
              <li key="js: i">
                 <div>
                   <span onClick="js: onClick.bind(null, item)"><js>item.name</js></span>
                    <js>
                      if (item.sub && item.active && !item.loading) return renderMethod(item.sub)
                      if (item.loading) return <el><div>loading...</div></el>
                    </js>
                 </div>
              </li>
            </el>
          })
        </js>
      </ul>
HTML;
    }
}
