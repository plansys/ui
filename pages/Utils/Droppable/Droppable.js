
this.state = {
  listen: false,
  data: false,
  waitingForData: false,
}

this.on("componentWillMount", () => {
  this.store = init()
  this.store.subscribe(this.listenStore)
})

this.on("componentDidMount", () => {
  // refs: https://stackoverflow.com/a/6756680/6086756
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  document.addEventListener("dragover", this.handleDragOver, false)
})

this.on("componentWillUnmount", () => {
  this.store.unsubscribe(this.listenStore)
  document.removeEventListener("dragover", this.handleDragOver, false)
})

this.handleDragOver = (e) => {
  e.preventDefault()
  if (this.props.onDragOver) this.props.onDragOver(e)
}

this.listenStore = (storeState, prevState) => {
  const newState = {}
  const draggingIsChanged = storeState.dragging !== prevState.dragging
  if (draggingIsChanged) {
    this.setState({
      listen: storeState.dragging
    })
  }

  const dataIsChanged = storeState.data !== this.state.data
  if (dataIsChanged && storeState.data) {
    this.setState({
      data: storeState.data
    })
  }
}

this.handleMouseUp = (e) => {
  if (this.state.listen) {
    e.preventDefault()
    // Prevent Call Parent event (Used In Nested Dropable)
    e.stopPropagation()
    this.setState({ waitingForData: true }, () => {
      // Bind Draggable To Send The Data
      this.store.setState({ hasDropped: true })
      // Waiting State Change
      setTimeout(() => {
        this.props.onDrop(this.state.data)
        // Netralize
        this.store.setState({ hasDropped: false, data: false })
      })
    })
  }
}

this.handleDropFile = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (this.props.onDropFile) {
    const { files } = e.dataTransfer
    const arrayFileList = []
    for (var i = 0; i < files.length; i++) {
      const file = files[i]
      arrayFileList.push(file)
    }
    this.props.onDropFile(arrayFileList)
  }
}
