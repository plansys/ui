
window.plansys.PopupStore = class PopupStore {
  constructor() {
    this.state = {
      uuid: false,
      data: false,
    }
    this.subscribers = []
    return this
  }
  setState(newState) {
    const prevState = {...this.state}
    this.state = {
      ...this.state,
      ...newState
    }
    this.subscribers.forEach((callback) => {
      callback(this.state, prevState)
    })
  }
  subscribe(func) {
    this.subscribers.push(func)
  }
  unsubscribe(func) {
    const targetIndex = this.subscribers.findIndex((item) => item === func)
    this.subscribers.splice(targetIndex, 1)
  }

}

window.plansys.PopupStoreInit = () => {
  const DRAGSTORE = "__$$UI_POPUP$$__"
  if (!window[DRAGSTORE]) window[DRAGSTORE] = new window.plansys.PopupStore()
  return window[DRAGSTORE]
};
