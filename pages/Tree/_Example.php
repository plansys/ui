<?php

namespace ui\Pages\Tree;

use Yard\Page;

class _Example extends Page
{
    public function js()
    {
        return <<<'JS'
    this.data = [
        {
            label: 'test_1',
        },
        {
            label: 'test_2',
        },
        {
            label: 'test_3',
        },
        {
            label: 'test_4',
        }
    ];
JS;

    }

    public function render()
    {
        return <<<'HTML'
<div>
       jos
    <ui:Tree.Root data="js: this.data">
        <ui:Tree.Item>
            <div><js>item.label</js></div>
        </ui:Tree.Item>
    </ui:Tree.Root>
</div>
HTML;

    }

}