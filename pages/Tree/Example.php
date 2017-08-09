<?php

namespace ui\Pages\Tree;

class Example extends \Yard\Page {

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

              // Ini sebenernya nggak ribet, cuman tagnya aja yang kebanyakkan~ bebas ini, terserah si user
              let recursiveRender = (items) => {
                return <el>
                  <ul>
                    <js> items.map((item, i) => {
                        return <el>
                          <li key="js: i">
                            <js>
                              item.loading ?
                                <el>
                                  <span>Loading....</span>
                                </el>
                              :
                                <el>
                                   <div>
                                     <span onClick="js: this.handleClick.bind(null, item)"><js>item.name</js></span>
                                     <js>item.sub && item.active ? recursiveRender(item.sub) : null</js>
                                   </div>
                                 </el>
                            </js>
                          </li>
                        </el>
                      })
                    </js>
                  </ul>
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
