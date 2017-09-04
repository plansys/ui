<?php

namespace ui\Pages\Tree;

class Example extends \Yard\Page
{

    public function js()
    {
        return <<<JS
        this.state = {
          nodes: [
            {
              name: "div",
              props: {},
              active: true,
              children: [
                {
                  name: "h1",
                  props: {},
                  children: [
                    {
                      name: "span",
                      props: {},
                      children: "Haloooo"
                    },
                  ],
                },
                {
                  name: "h2",
                  props: {},
                  children: []
                }
              ],
            },
            {
              name: "p",
              props: {},
              children: "Text Only",
            },
          ]
        }


      handleClick = (item) => {
        if (Array.isArray(item.children)) {
          const newNodes = item._mutator(item._root, item._parentPath, {
            children: [
              ...item._parent.children,
              { name: "hai" },
            ]
          })
          this.setState({ nodes: newNodes })
        }
      }
    }
JS;
    }

    public function render()
    {
        return <<<HTML
        <js>
          const renderBranch = (items, renderBranch) => {
            return <ul>
              <js>items.map((item, i) => (
                <li key={i}>
                  <span onClick={this.handleClick.bind(this, item)}>{item.name} {item.$path}</span>
                  <If condition={item.active}>
                    <ul>
                      <If condition={isArray(item.children)}>
                        {renderBranch(item.children, renderBranch)}
                      </If>
                    </ul>
                  </If>
               </li>
              ))}
            </ul>
          <js>
          return (
            <ui:Tree.Root ref={(c) => this.tree = c} data={this.state.nodes} childKey="children" renderBranch={renderBranch} />
          );
        </js>
HTML;
    }

}
