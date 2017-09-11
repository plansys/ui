<?php

namespace ui\Pages\Popup;

class _Example extends \Yard\Page
{
    public function js()
    {
        return <<<'JS'
        
        this.on('componentDidMount', () => {
            console.log('cdm');
        });

        this.on('componentWillUnmount', () => {
            console.log('cwu');
        });
        
        this.popupRef = (el) => { 
            this.popup = el; 
            this.forceUpdate();
        };
        this.state = {a:0};
        setTimeout(() => {
            this.setState({a: 10000});
        }, 2000);
JS;
    }

    public function css() {
        return <<<CSS
.test {
    background:red;
    width:400px;
    height:200px;
    text-align:center;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin:0;
    padding:0;
}
CSS;

    }

    public function render()
    {
        return <<<'JS'
 <js>
    return
    <div>
        <ui:Popup name="roki" position="mouse-right">
            <h1 className="test">Halo <js>JSON.stringify(data)</js></h1>
        </ui:Popup>
        <ui:Layout.Fullscreen>
            <ui:Layout.Col valign="center" halign="center">
                <div>
                    <div>
                        <div data-popup-rclick:roki="js: {ini:this.state.a, u:'rusaj'}">Test</div>
                        <div data-popup-click:roki="js: {ini:this.state.a, u:'rusaj'}">Test</div>
                        <div data-popup-hover:roki="js: {ini:this.state.a}">Test</div>
                        <js>this.state.a</js>
                    </div>
                </div>
            </ui:Layout.Col>
        </ui:Layout.Fullscreen>
    </div>
</js>
JS;
    }
}
