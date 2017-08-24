<?php

namespace ui\Pages\Tree;

class Container extends \Yard\Page
{
    public $executePostRender = true;

    public function js()
    {
        return $this->loadFile('Container/Container.js');
    }

    public function render()
    {
        return $this->loadFile('Container/Container.html');
    }

    private function getProp($props, $key, $default)
    {
        $res = isset($props[$key]) ? $props[$key] : $default;

        if (strpos('$res', 'js:') === 0) {
            $res = substr($res, 3);
        }

        return $res;
    }

    public function postRender($props, $children)
    {
        $dataProp = $this->getProp($props, 'data', 'this.data');
        $keyProp = $this->getProp($props, 'key', 'key');
        $itemProp = $this->getProp($props, 'item', 'item');
        $childProp = $this->getProp($props, 'child', 'item.childs');

        $children = str_replace('<ui:Tree.Item>', '
                        <js>
                            let renderItem = (' . $itemProp . ', ' . $keyProp . ') => {
                                return <el>
                            ', $children);

        $children = str_replace('</ui:Tree.Item>', '
                                </el>
                            }

                            let renderTree = (data) => {
                                return data.map(e => renderItem(e))
                            }
                            
                            if (' . $dataProp . ') {
                                return renderTree(' . $dataProp . ');
                            }
                        </js>', $children);

        $childJs = "
              <js>
                    if ($childProp) {
                        return renderTree($childProp)
                    }
              </js>";

        $children = preg_replace('/<ui:Tree.Child>(.*?)<\/ui:Tree.Child>/', $childJs, $children);
        $children = preg_replace('/<ui:Tree.Child(\s*)\/>/', $childJs, $children);

        return $children;
    }
}