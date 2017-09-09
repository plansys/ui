<?php

namespace ui\Pages\Drag;

class Draggable extends \Yard\Page
{
    public function js()
    {
      return $this->loadFile('DragStore.js', 'Draggable/Draggable.js');
    }

    public function render()
    {
      return $this->loadFile('Draggable/Draggable.html');
    }
}
