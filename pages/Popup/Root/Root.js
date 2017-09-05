<<<<<<< HEAD

this.state = {
  active: false
}

this.on("componentDidMount", () => {
  this.store = window.plansys.PopupStoreInit()
  this.store.subscribe(this.listenStore)
})

this.listenStore = (newState, prevState) => {
  const { onDataChange } = this.props
  const dataHasChanged = newState.data !== prevState.data
  if (dataHasChanged) {
    if (onDataChange) onDataChange(newState.data)
  }
}

this.activate = (uuid) => {
  this.store.setState({ uuid })
  this.setState({ active: true })
}

this.close = (e) => {
  const isOverlay = this.overlay === e.target
  if (isOverlay) {
    this.setState({
      active: false
    })
  }
}

this.forceClose = () => {
  this.setState({ active: false })
}

this.addCustomClassName = (className) => {
  return className || ""
=======
this.state = {
    active: false
}

this.on("componentDidMount", () => {
    this.store = PopUp.init()
    this.store.subscribe(this.listenStore)
})

this.listenStore = (newState, prevState) => {
    const {onDataChange} = this.props
    const dataHasChanged = newState.data !== prevState.data
    if (dataHasChanged) {
        if (onDataChange) onDataChange(newState.data)
    }
}

this.activate = (uuid) => {
    this.store.setState({uuid})
    this.setState({active: true})
}

this.close = (e) => {
    const isOverlay = this.overlay === e.target
    if (isOverlay) {
        this.setState({
            active: false
        })
    }
}

this.forceClose = () => {
    this.setState({active: false})
}

this.addCustomClassName = (className) => {
    return className || ""
>>>>>>> c863fc717ad0c861203d090a1e00f4fc5125855f
}