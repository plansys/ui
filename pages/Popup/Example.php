<?php

namespace ui\Pages\Popup;

class Example extends \Yard\Page
{
    public function js()
    {
    }

    public function render()
    {
        return  <<<JS
          <js>
            return
              <ui:Popup.Root
                ref={(el) => this.popup = el}
                className={`ContextMenu ${addCustomClassName(className)}`}
                onContextMenu={this.removeContextMenu}
                top={top}
                left={left}
                onDataChange={onDataChange || null}
              >
                <h1>Halo</h1>
              </ui:Popup.Root>
          </js>
JS;
    }
}
