<?php

namespace ui\Pages\Drag;

class Droppable extends \Yard\Page
{
    public function js()
    {
      return $this->loadFile('DragStore.js', '_Droppable/Droppable.js');
    }

    public function render()
    {
      return $this->loadFile('_Droppable/Droppable.html');
    }
}
