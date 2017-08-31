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

    public function postRender($props, $children, $instanceIdx = 0)
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

        $children = $this->replaceTabNav($children, $instanceIdx, $itemProp, $dataProp);
        $children = $this->replaceContent($children, $instanceIdx, $itemProp, $dataProp);

        return [
            'props' => $props,
            'children' => $children
        ];
    }

    public function replaceTabNav($children, $idx, $itemProp, $dataProp)
    {
        $children = str_replace("<ui:Tab.Nav>", '
                        <js>
                            let renderTabNav = (' . $itemProp . ') => {
                                return <div onClick="js: e => { e.preventDefault();  ' . $itemProp . '.$activate(); }">', $children);

        $children = str_replace("</ui:Tab.Nav>", '
                                </div>; 
                            }

                            let renderTab = (data) => {
                                if (!data.map) {
                                    throw new Error("Tab data is not an array! current data is (" + typeof data + ") \n\n " + data);
                                }

                                return data.map((item, idx) => renderTabNav(item, idx))
                            }

                            if (this._tabRoot' . $idx . ' && ' . $dataProp . ') {
                                let data = this._tabRoot' . $idx . '.remakeData(' . $dataProp . ');
                                let res = renderTab(data);
                                return res;
                            }
                       </js>', $children);

        return $children;
    }


    public function replaceContent($children, $idx, $itemProp, $dataProp)
    {
        $children = str_replace("<ui:Tab.Content>", '
                        <js>
                            let currentTab = this._tabRoot' . $idx . ';
                            let renderTabContent = (' . $itemProp . ') => {
                                return <div>', $children);

        $children = str_replace("</ui:Tab.Content>", '
                                </div>;
                            }
                            
                            if (currentTab && currentTab.active) {
                                return renderTabContent(currentTab.active);
                            }
                        </js>
                            ', $children);
        return $children;
    }

}
