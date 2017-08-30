<?php

namespace ui\Pages\Tree;

class Root extends \Yard\Page
{
    public $executePostRender = true;

    public function js()
    {
        return $this->loadFile('Root/Root.js');
    }

    public function render()
    {
        return $this->loadFile('Root/Root.html');
    }

    private function getProp($props, $key, $default)
    {
        $res = isset($props[$key]) ? $props[$key] : $default;

        if (strpos($res, 'js:') === 0) {
            $res = substr($res, 3);
        }

        return $res;
    }

    public function postRender($props, $children, $instanceIndex = 0)
    {
        $dataProp = $this->getProp($props, 'data', 'this.data');
        $keyProp = $this->getProp($props, 'key', 'key');
        $itemProp = $this->getProp($props, 'item', 'item');
        $childProp = $this->getProp($props, 'childKey', 'children');

        $props['ref'] = "js: function(ref) { 
            this._treeRoot{$instanceIndex} = ref;
         }.bind(this)";
        $children = $this->replaceTreeItem($children, $instanceIndex, $keyProp, $itemProp, $dataProp);
        $children = $this->replaceTreeChild($children, $childProp, $itemProp);

        return [
            'props' => $props,
            'children' => $children
        ];
    }

    private function replaceTreeChild($children, $childProp, $itemProp)
    {
        $childJs = "
              <js>
                    if ($itemProp.$childProp) {
                        return renderTree($itemProp.$childProp)
                    }
              </js>";

        $children = preg_replace('/<ui:Tree.Child>(.*?)<\/ui:Tree.Child>/', $childJs, $children);
        $children = preg_replace('/<ui:Tree.Child(\s*)\/>/', $childJs, $children);
        return $children;
    }

    private function replaceTreeItem($children, $idx, $keyProp, $itemProp, $dataProp)
    {
        $children = str_replace("<ui:Tree.Item>", '
                        <js>

                            let renderItem = (' . $itemProp . ', ' . $keyProp . ') => {
                                return  ', $children);

        $children = str_replace('</ui:Tree.Item>', '
                            }

                            let renderTree = (data) => {
                                if (!data.map) {
                                    throw new Error("Tree data is not an array! current data is (" + typeof data + ") \n\n " + data);
                                }

                                return data.map((e, idx) => renderItem(e, idx))
                            }

                            if (this._treeRoot' . $idx . ' && ' . $dataProp . ') {
                                let data = this._treeRoot' . $idx . '.remakeData(' . $dataProp . ');
                                return renderTree(data);
                            }
                        </js>', $children);

        return $children;
    }
}
