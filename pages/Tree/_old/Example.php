<?php

namespace ui\Pages\Tree;

class Example extends \Yard\Page {

    public function query($app, $params) {
        $file = glob("pages/*")[1];

        $page = new \Plansys\Codegen\ClassCode($file);
        $page->name = 'Rizky';
        $page->save();

        return $page;
    }

    public function js() {
      return <<<JS
        const data = [
          {
            name: "Tree1",
            sub: [
              {
                name: "Sub tree 1",
                sub: [
                  {
                    name: "Sub tree level 2",
                    sub: []
                  }
                ]
              },
              {
                name: "Sub tree 1",
                sub: [
                  {
                    name: "Sub tree level 2",
                    sub: []
                  }
                ]
              }
            ],
          },
          {
            name: "Tree2",
            sub: [
              {
                name: "Sub tree 2",
                sub: [
                  {
                    name: "Sub tree level 2",
                    sub: []
                  }
                ]
              },
              {
                name: "Sub tree 2",
                sub: [
                  {
                    name: "Sub tree level 2",
                    sub: []
                  }
                ]
              }
            ]
          },
          {
            name: "Tree3",
            sub: [
              {
                name: "Sub tree 3",
                sub: [
                  {
                    name: "Sub tree level 2",
                    sub: []
                  }
                ]
              },
              {
                name: "Sub tree 3",
                sub: [
                  {
                    name: "Sub tree level 2",
                    sub: []
                  }
                ]
              }
            ]
          }
        ]

        this.state = {
          data,
        }

        // FAKE AJAX
        this.getData = (delay) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              return resolve(true)
            }, delay)
          })
        }

        this.loadSubTree = (item) => {
          // DO AJAX HERE
          return this.getData(1000).then((res) => {
            // WHEN AJAX DONE
            item.loading = false

            // ADD A SUB
            const hasChild = item.sub.length
            if (!hasChild) {
              item.sub = []
              item.sub.push({
                name: "Sub Tree Level " + (item.level + 1),
                sub: []
              })
            }

            // MAKE A NEW CHANGES!
            const newData = item.set({ ...item })
            this.setState({ data: newData })
          })
        }

        this.handleClick = (item) => {
          console.log(item, item.getSiblings());
          item.active = !item.active
          if (item.active && !item.sub.length) item.loading = true
          const newData = item.set({ ...item });
          // Update State to make it show loading
          this.setState({ data: newData }, () => {
            // Update Data Again When it done
            if (!item.sub.length) this.loadSubTree(item)
          })
        }
JS;
    }

    public function render() {
        return <<<HTML
          <div>
            <js>

              let recursiveRender = (items) => {
                return <el>
                  <ui:Tree.Branch
                    items="js: items"
                    onClick="js: this.handleClick"
                    renderMethod="js: recursiveRender"
                  />
                </el>
              }

              return <el>
                <ui:Tree.Container
                  data="js: this.state.data"
                  onShouldRenderChild="js: recursiveRender"
                />
              </el>

            </js>
          </div>
HTML;
    }

}
