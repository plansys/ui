
class DragStore {
  constructor() {
    return this
  }

  state = {
    dragging: false,
    hasDropped: false,
    info: false,
    data: false,
  }
  subscribers = []
  setState = (newState) => {
    const prevState = {...this.state}
    this.state = {
      ...this.state,
      ...newState
    }
    this.subscribers.forEach((callback) => {
      callback(this.state, prevState)
    })
  }
  subscribe = (func) => {
    this.subscribers.push(func)
  }
  unsubscribe = (func) => {
    const targetIndex = this.subscribers.findIndex((item) => item === func)
    this.subscribers.splice(targetIndex, 1)
  }
}

function init() {
  const DRAGSTORE = "__UI_DRAG_N_DROP__"
  if (!window[DRAGSTORE]) window[DRAGSTORE] = new DragStore()
  return window[DRAGSTORE]
};
