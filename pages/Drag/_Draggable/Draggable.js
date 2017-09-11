// import DragStore, { init } from './DragStore';

this.state = {
    dragging: false,
    mouseX: 0,
    mouseY: 0,
    y: 0,
    x: 0,
    currentDragIndex: false,
}

this.on("componentWillMount", () => {
    this.store = init()
    this.store.subscribe(this.listenStore)
})

this.on("componentDidMount", () => {
    document.addEventListener("mousemove", this.handleMove, false)
    document.addEventListener("mouseup", this.resetDragState, false)
})

this.on("componentWillUnmount", () => {
    this.store.unsubscribe(this.listenStore)
    document.removeEventListener("mousemove", this.handleMove, false)
    document.removeEventListener("mouseup", this.resetDragState, false)
})

this.listenStore = (newState, prevState) => {
    const hasDroppedHasChanged = newState.hasDropped !== prevState.hasDropped
    if (hasDroppedHasChanged && newState.hasDropped) return this.handleEnd()
}

this.handleStart = (e) => {
    let el = e.target
    if (this.props.dragParent) {
        el = this.rootEl.parentNode
    }
    this.dragSourceEl = el
    el = el.cloneNode(true)
    el.style.position = "fixed"
    el.style.top = "0px"
    el.style.left = "0px"
    el.style.display = "none"
    el.style.width = "100%"
    el.style.pointerEvents = "none";
    this.draggingEl = el
    document.body.appendChild(this.draggingEl)
    this.setState({dragging: true, mouseX: e.nativeEvent.offsetX, mouseY: e.nativeEvent.offsetY})
    this.store.setState({
        dragging: true,
        info: {
            index: this.props.index
        },
    })
    if (this.props.onDragStart) this.props.onDragStart(e, el)
}

this.handleMove = (e) => {
    if (this.state.dragging) {
        e.preventDefault()
        const {mouseX, mouseY} = this.state
        const el = this.draggingEl
        const Y = e.clientY - mouseY
        const X = e.clientX - mouseX
        el.style.display = "block"
        el.style.transform = `translate(${X}px, ${Y}px)`
        el.style.pointerEvents = "none"


        this.setState({y: Y, x: X}, () => {
            if (this.props.onDragging) this.props.onDragging(e, el, {y: Y, x: X})
        })
    }
}

this.resetDragState = (e) => {
    this.store.setState({dragging: false})
    // Set pointerEvents to be default
    if (this.dragSourceEl) {
        this.dragSourceEl.style.pointerEvents = "initial"
    }
    // Set Internal State
    this.setState({dragging: false, listenToSort: false})
    if (this.draggingEl) {
        this.draggingEl.remove()
    }
    this.draggingEl = false
    if (this.props.onDragEnd) this.props.onDragEnd(e)
}

this.handleEnd = () => {
    if (this.state.dragging) {
        // send data to Dropable
        this.store.setState({data: this.props.data, dragging: false})
        this.resetDragState()
    }
}
