<?php

namespace ui\Pages;

class Popup extends \Yard\Page
{
    public $library = true;
    public $executePostRender = true;

    public function css()
    {
        return $this->loadFile('Popup/Root.css');
    }

    public function includeJS()
    {
        return [
            '/Utils/is.js'
        ];
    }

    public function js()
    {
        return $this->loadFile('Popup/Root.js');
    }

    public function render()
    {
        return $this->loadFile('Popup/Root.html');
    }

    public function postRender($props, $childStr, $instanceIdx, $childArray)
    {
        $this->addRefToProps($props, "
            this._popup{$instanceIdx} = ref;
            this.forceUpdate();
        ");
        $dataProp = isset($props['data']) ? $props['data'] : 'data';

        $wrappedChild = <<<JS
<js>
    if (this._popup{$instanceIdx}) {
        let {$dataProp} = this._popup{$instanceIdx}.state.data;
        let hide = this._popup{$instanceIdx}.hide;
        return {$childStr};
    }
</js>
JS;

        return [
            'props' => $props,
            'children' => $wrappedChild
        ];
    }
}
