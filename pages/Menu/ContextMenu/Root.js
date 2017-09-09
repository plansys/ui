this.state = {
    top: 0,
    left: 0,
}

this.on("componentDidMount", () => {
    this.setEventListener("add")
})

this.on("componentWillUnmount", () => {
    this.setEventListener("remove")
})

this.on("componentDidUpdate", () => {
    setTimeout(() => {
        this.setEventListener("remove")
        this.setEventListener("add")
    })
})

this.setEventListener = (type) => {
    const triggererEl = document.body.querySelectorAll(`[data-popup-contextmenu="${this.props['[[name]]']}"]`)
    for (let i = 0; i < triggererEl.length; i++) {
        const el = triggererEl[i]
        if (!el.$contextEvent) el.$contextEvent = this.handleContextMenu.bind(this, el)
        el[`${type}EventListener`]("contextmenu", el.$contextEvent, false)
    }
}

this.preventOutOfScreen = ({top, left}) => {
    const THRESHOLD = 20
    const maxRight = window.innerWidth
    const maxBottom = window.innerHeight

    const newPosition = {top, left}

    const maxLeft = 0
    const outOfScreenLeft = left < maxLeft
    if (outOfScreenLeft) newPosition.left = THRESHOLD

    const contentWidth = this.popup.inner.clientWidth
    const offsetRightComponent = left + contentWidth
    const outOfScreenRight = offsetRightComponent > maxRight
    if (outOfScreenRight) {
        const diff = offsetRightComponent - maxRight
        newPosition.left = newPosition.left - diff - THRESHOLD
    }

    const contentHeight = this.popup.inner.clientHeight
    const offsetBottomComponent = top + contentHeight
    const outOfScreenBottom = offsetBottomComponent > maxBottom
    if (outOfScreenBottom) {
        const diff = offsetBottomComponent - maxBottom
        newPosition.top = newPosition.top - diff - THRESHOLD
    }

    return newPosition
}

this.handleContextMenu = (el, e) => {
    e.preventDefault()
    const {clientY, clientX} = e
    const uuid = el.getAttribute('uuid')
    this.popup.activate(uuid)
    this.setState({
        top: false
    })
    this.setState({
        top: clientY,
        left: clientX,
    }, () => {
        const {top, left} = this.state
        this.setState(this.preventOutOfScreen({top, left}))
    })
}

this.forceClose = () => {
    this.setState({active: false})
}

this.removeContextMenu = (e) => {
    e.preventDefault()
    this.popup.forceClose()
}

this.addCustomClassName = (className) => {
    return className || ""
}
