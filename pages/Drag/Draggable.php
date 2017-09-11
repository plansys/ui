<?php

namespace ui\Pages\Drag;

class Draggable extends \Yard\Page
{
    public function js()
    {
      return $this->loadFile('DragStore.js', '_Draggable/Draggable.js');
    }

    public function render()
    {
      return $this->loadFile('_Draggable/Draggable.html');
    }
}
