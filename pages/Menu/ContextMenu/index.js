

import Preact from 'preact'
import PopUp from 'components/PopUp'

import './index.sass'
class ContextMenu extends Preact.Component {

  state = {
    top: 0,
    left: 0,
  }

  componentDidMount() {
    this.setEventListener("add")
  }

  componentWillUnmount() {
    this.setEventListener("remove")
  }

  componentDidUpdate(nextProps) {
    setTimeout(() => {
      this.setEventListener("remove")
      this.setEventListener("add")
    })
  }

  setEventListener = (type) => {
    const triggererEl = document.body.querySelectorAll(`[data-popup-contextmenu="${this.props.name}"]`)
    for (var i = 0; i < triggererEl.length; i++) {
      const el = triggererEl[i]
      if (!el.$contextEvent) el.$contextEvent = this.handleContextMenu.bind(this, el)
      el[`${type}EventListener`]("contextmenu", el.$contextEvent, false)
    }
  }

  preventOutOfScreen = ({ top, left }) => {
    const THRESHOLD = 20
    const maxRight = window.innerWidth
    const maxBottom = window.innerHeight

    const newPosition = { top, left }

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

  handleContextMenu = (el, e) => {
    e.preventDefault()
    const { clientY, clientX } = e
    const uuid = el.getAttribute('uuid')
    this.popup.activate(uuid)
    this.setState({
      top: false
    })
    this.setState({
      top: clientY,
      left: clientX,
    }, () => {
      const { top, left } = this.state
      this.setState(this.preventOutOfScreen({ top, left }))
    })
  }

  forceClose = () => {
    this.setState({ active: false })
  }

  removeContextMenu = (e) => {
    e.preventDefault()
    this.popup.forceClose()
  }

  addCustomClassName = (className) => {
    return className || ""
  }

  render () {
    const { className, onDataChange } = this.props
    const { top, left, active } = this.state
    const { addCustomClassName } = this
    return (
      <PopUp
        ref={(el) => this.popup = el}
        className={`ContextMenu ${addCustomClassName(className)}`}
        onContextMenu={this.removeContextMenu}
        top={top}
        left={left}
        onDataChange={onDataChange || null}
      >
        {this.props.children}
      </PopUp>
    )
  }
}

export default ContextMenu;
