<?php

namespace ui\Pages;

use \Yard\Page;

class Tab extends Page
{
    public $executePostRender = true;

    public function includeJS()
    {
        return [
            '/_Utils/is.js',
            '/Tree/Libs/Mutator.js',
            '/Tree/Libs/RecursiveArray.js',
        ];
    }

    public function js()
    {
        return $this->loadFile('_Tab/Root/Root.js');
    }

    public function render()
    {
        return $this->loadFile('_Tab/Root/Root.html');
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
        $itemProp = $this->getProp($props, 'item', 'item');

        # set refs
        $this->addRefToProps($props, "
            this._tabRoot{$instanceIdx} = ref;
            this.forceUpdate();
        ");

        # set nav
        $children = $this->addKeyInTagChild('ui:Tab.Nav', 'key', $childArray);
        $tabNav = self::findTagInArray('ui:Tab.Nav', $childArray);
        $shouldWrapTabNav = false;
        if (is_array($tabNav) && count($tabNav) == 3) {
            $shouldWrapTabNav = count($tabNav[2]) > 1;
        }
        $children = $this->replaceTabNav($children, $instanceIdx, $itemProp, $dataProp, $shouldWrapTabNav);

        # set content
        $tabContent = self::findTagInArray('ui:Tab.Content', $childArray);
        $shouldWrapTabContent = false;
        if (is_array($tabContent) && count($tabContent) == 3) {
            $shouldWrapTabContent = count($tabContent[2]) > 1;
        }
        $children = $this->replaceContent($children, $instanceIdx, $itemProp, $shouldWrapTabContent);

        # fix key in child
        $childArray = $this->renderHtmlAsComponent($children);
        if (count($childArray) > 1) {
            foreach ($childArray as $k => &$c) {
                if (is_object($c[1])) {
                    $c[1]->key = $k;
                }
            }
            $children = $this->renderComponentAsHtml($childArray);
        }

        # return
        return [
            'props' => $props,
            'children' => $children
        ];
    }

    public function replaceTabNav($content, $tabIdx, $itemProp, $dataProp, $wrapTag)
    {
        return $this->replaceTagContent('ui:Tab.Nav', $content,
            function ($children) use ($tabIdx, $itemProp, $dataProp, $wrapTag) {
                $children = ($wrapTag) ? '<div>' . $children . '</div>' : $children;

                return <<<JS
    <js>
        let renderTabNav = ({$itemProp}, key) => {
            return {$children} 
        }

        let renderTab = (data) => {
            if (!data.map) {
                console.log(data);
                throw new Error("Tab data is not an array! current data is (" + typeof data + ") ");
            }
            
            return data.map((item, key) => renderTabNav(item, key))
        }

        if (this._tabRoot{$tabIdx} && {$dataProp}) {
            let data = this._tabRoot{$tabIdx}.remakeData({$dataProp});
            let res = renderTab(data);
            return res;
        }
   </js>
JS;
            });
    }

    public function replaceContent($content, $idx, $itemProp, $wrapTag)
    {
        return $this->replaceTagContent('ui:Tab.Content', $content,
            function ($children) use ($idx, $itemProp, $wrapTag) {
                $children = ($wrapTag) ? '<div>' . $children . '</div>' : $children;
                return <<<JS
    <js>
        let currentTab = this._tabRoot{$idx};
        let renderTabContent = ( $itemProp ) => {
            return {$children};
        }
        
        if (currentTab && currentTab.active) {
            return renderTabContent(currentTab.active);
        }
    </js>     
JS;
            });
    }

}
