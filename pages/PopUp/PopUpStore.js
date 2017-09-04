
class PopUpStore {
  constructor() {
    return this
  }

  state = {
    uuid: false,
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

export function init() {
  const DRAGSTORE = "__$$UI_POPUP$$__"
  if (!window[DRAGSTORE]) window[DRAGSTORE] = new Store()
  return window[DRAGSTORE]
};
