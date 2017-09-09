<?php

namespace ui\Pages;

class Tree extends \Yard\Page
{
    public $executePostRender = true;

    public function includeJS()
    {
        return [
            '/Utils/is.js',
            '/Tree/Libs/Mutator.js',
            '/Tree/Libs/RecursiveArray.js',
        ];
    }

    public function js()
    {
        return $this->loadFile('Tree/Root/Root.js');
    }

    public function render()
    {
        return $this->loadFile('Tree/Root/Root.html');
    }

    private function getProp($props, $key, $default)
    {
        $res = isset($props[$key]) ? $props[$key] : $default;

        if (strpos($res, 'js:') === 0) {
            $res = substr($res, 3);
        }

        return $res;
    }

    public function postRender($props, $children, $instanceIdx = 0, $childArray)
    {
        $dataProp = $this->getProp($props, 'data', 'this.data');
        $keyProp = $this->getProp($props, 'key', 'key');
        $itemProp = $this->getProp($props, 'item', 'item');
        $childProp = $this->getProp($props, 'childKey', 'children');

        $this->addKeyInTagChild('ui:Tree.Item', 'key', $childArray);
        $this->addRefToProps($props, "
            this._treeRoot{$instanceIdx} = ref;
            this.forceUpdate();
        ");

        $children = $this->replaceTreeItem($childArray, $instanceIdx, $keyProp, $itemProp, $dataProp);
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

    private function replaceTreeItem(&$childArray, $treeIdx, $keyProp, $itemProp, $dataProp)
    {
        $js = $this->loadFile('Tree/Root/Item.jsphp');
        $tag = $this->findTagInArray('ui:Tree.Item', $childArray);
        $jsContent = $this->convertJsToArray($js, [
            '$children' => $tag[2][0],
            '$itemProp' => $itemProp,
            '$keyProp' => $keyProp,
            '$dataProp' => $dataProp,
            '$treeIdx' => $treeIdx
        ]);
        $this->replaceTagInArray('ui:Tree.Item', ['js', $jsContent], $childArray);
        return $this->renderComponentAsHtml($childArray);
    }
}
