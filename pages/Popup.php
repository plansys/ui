<?php

namespace ui\Pages;

class Popup extends \Yard\Page
{
    public $library = true;
    public $executePostRender = true;

    public function css()
    {
        return $this->loadFile('_Popup/Root.css');
    }

    public function includeJS()
    {
        return [
            '/_Utils/is.js'
        ];
    }

    public function js()
    {
        return $this->loadFile('_Popup/Root.js');
    }

    public function render()
    {
        return $this->loadFile('_Popup/Root.html');
    }

    public function postRender($props, $childStr, $instanceIdx, $childArray)
    {
        $this->addRefToProps($props, "
            if (ref.isUnique) {
                this._popup{$instanceIdx} = ref;
            } else {
                this._popup{$instanceIdx} = ref.instance;
            }
            this.forceUpdate();
        ", 'oldRef(ref.instance || ref)');
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

        $props['__parent'] = 'js: this';

        return [
            'props' => $props,
            'children' => $wrappedChild
        ];
    }
}
