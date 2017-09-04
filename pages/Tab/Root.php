<?php

namespace ui\Pages\Tab;

use \Yard\Page;

class Root extends Page
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

    public function postRender($props, $children, $instanceIdx = 0, $childArray)
    {
        $dataProp = $this->getProp($props, 'data', 'this.data');
        $itemProp = $this->getProp($props, 'item', 'item');

        $oldRef = '';
        if (isset($props['ref'])) {
            if (strpos($props['ref'], 'js') !== false) {
                $oldRef = str_replace('js:', 'let oldRef = ', $props['ref']);
                $oldRef = 'if (typeof oldRef === "function") { oldRef(); }';
            }
        }

        $props['ref'] = "js: function(ref) {
            this._tabRoot{$instanceIdx} = ref;
            this.forceUpdate();
            
            {$oldRef}
        }.bind(this)";

        $props['$parent'] = "js: this";

        $tabNav = self::FindTag($childArray, 'ui:Tab.Nav');
        $wrapTabNav = false;
        if (is_array($tabNav) && count($tabNav) == 3) {
            $wrapTabNav = count($tabNav[2]) > 1;
        }

        $tabContent = self::FindTag($childArray, 'ui:Tab.Content');
        $wrapTabContent = false;
        if (is_array($tabContent) && count($tabContent) == 3) {
            $wrapTabContent = count($tabContent[2]) > 1;
        }

        $children = $this->replaceTabNav($children, $instanceIdx, $itemProp, $dataProp, $wrapTabNav);
        $children = $this->replaceContent($children, $instanceIdx, $itemProp, $wrapTabContent);

        return [
            'props' => $props,
            'children' => $children
        ];
    }

    public function replaceTabNav($content, $idx, $itemProp, $dataProp, $wrapTag)
    {
        return $this->replaceTagContent('ui:Tab.Nav', $content,
            function ($children) use ($idx, $itemProp, $dataProp, $wrapTag) {
                $children = ($wrapTag) ? '<div>' . $children . '</div>' : $children;

                return <<<JS
    <js>
        let renderTabNav = ({$itemProp}) => {
            return {$children} 
        }

        let renderTab = (data) => {
            if (!data.map) {
                throw new Error("Tab data is not an array! current data is (" + typeof data + ") ",  data );
            }

            return data.map((item, idx) => renderTabNav(item, idx))
        }

        if (this._tabRoot{$idx} && {$dataProp}) {
            let data = this._tabRoot{$idx}.remakeData({$dataProp});
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
