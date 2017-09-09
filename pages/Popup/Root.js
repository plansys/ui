this.state = {
    active: false,
    position: {
        // screen-center
        // element-top element-bottom, element-right, element-left,
        // mouse, mouse-top, mouse-bottom, mouse-right, mouse-left
        name: 'screen-center',
        top: -999999,
        left: -999999
    },
    data: null,
}

this.resetTrigger = () => {
    this.trigger = {
        el: null,
        event: '',
        data: null,
        prevData: null,
    };
}
this.resetTrigger();

this.getTriggerData = (el, captureProp) => {
    let state = null;
    for (let key in el) {
        if (key.startsWith("__reactInternalInstance$")) {
            state = el[key]._currentElement.props[`${captureProp}\:${this.props['name']}`];
        }
    }
    return state;
};

this.overlayEl = null;
this.showOverlay = () => {
    if (this.trigger.event === 'hover') return false;

    return !(this.props.overlay === 'false' || this.props.overlay === false);
}

this.preventRightClick = (e) => {
    if (typeof this.props.onContextMenu === 'function') {
        this.props.onContextMenu(e);
    } else {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

this.show = (e, state) => {
    if (this.popupContainer && this.trigger.el) {
        setTimeout(() => {
            let popup = this.popupContainer;
            let left = -999999;
            let top = -999999;
            const trigger = {
                left: this.trigger.el.offsetLeft,
                top: this.trigger.el.offsetTop,
                w: this.trigger.el.clientWidth,
                h: this.trigger.el.clientHeight
            }
            const cursorSize = 12;
            switch (this.state.position.name) {
                case 'screen-center':
                    left = (window.innerWidth / 2) - (popup.clientWidth / 2);
                    top = (window.innerHeight / 2) - (popup.clientHeight / 2);
                    break;
                case 'element-top':
                    left = trigger.left + (trigger.w / 2) - (popup.clientWidth / 2);
                    top = trigger.top - popup.clientHeight;
                    break;
                case 'element-bottom':
                    left = trigger.left + (trigger.w / 2) - (popup.clientWidth / 2);
                    top = trigger.top + trigger.h;
                    break;
                case 'element-right':
                    left = trigger.left + trigger.w;
                    top = trigger.top + (trigger.h / 2) - (popup.clientHeight / 2);
                    break;
                case 'element-left':
                    left = trigger.left - popup.clientWidth;
                    top = trigger.top + (trigger.h / 2) - (popup.clientHeight / 2);
                    break;
                case 'mouse':
                    left = e.pageX;
                    top = e.pageY;
                    break;
                case 'mouse-top':
                    left = e.pageX - (popup.clientWidth / 2);
                    top = e.pageY - popup.clientHeight - cursorSize;
                    break;
                case 'mouse-bottom':
                    left = e.pageX - (popup.clientWidth / 2);
                    top = e.pageY + cursorSize;
                    break;
                case 'mouse-left':
                    left = e.pageX - popup.clientWidth - cursorSize;
                    top = e.pageY - (popup.clientHeight / 2);
                    break;
                case 'mouse-right':
                    left = e.pageX + cursorSize;
                    top = e.pageY - (popup.clientHeight / 2);
                    break;
            }

            let position = this.preventOutOfScreen({left, top});
            this.setState({
                position: {
                    ...this.state.position,
                    ...position
                }
            });
        })
    }

    this.setState({
        ...state,
        active: true
    })
}

this.hide = (e) => {
    this.setState({
        active: false
    })
    this.resetTrigger();
}

this.addCustomClassName = (className) => {
    return className || ""
}

this.preventOutOfScreen = ({top, left}) => {
    const THRESHOLD = 20
    const maxRight = window.innerWidth
    const maxBottom = window.innerHeight

    const newPosition = {top, left}

    const maxLeft = 0
    const outOfScreenLeft = left < maxLeft
    if (outOfScreenLeft) newPosition.left = THRESHOLD

    const contentWidth = this.popupContainer.clientWidth
    const offsetRightComponent = left + contentWidth
    const outOfScreenRight = offsetRightComponent > maxRight
    if (outOfScreenRight) {
        const diff = offsetRightComponent - maxRight
        newPosition.left = newPosition.left - diff - THRESHOLD
    }

    const contentHeight = this.popupContainer.clientHeight
    const offsetBottomComponent = top + contentHeight
    const outOfScreenBottom = offsetBottomComponent > maxBottom
    if (outOfScreenBottom) {
        const diff = offsetBottomComponent - maxBottom
        newPosition.top = newPosition.top - diff - THRESHOLD
    }

    return newPosition
}

this.on("componentDidMount", () => {
    this.setEventListener("add")
})

this.on("componentWillUnmount", () => {
    this.setEventListener("remove")
})

this.on("componentWillReceiveProps", nextProps => {
    if (nextProps.position) {
        this.setState({
            position: {
                ...this.state.position,
                name: nextProps.position
            }
        })
    }
})

this.on("componentDidUpdate", () => {
    this.setEventListener("remove")
    this.setEventListener("add")
})

this.updateData = (data) => {
    let callback = () => {
        this.props['[[parent]]'].forceUpdate();
    }
    if (typeof data === 'object') {
        this.setState({data: {...data}}, callback);
    } else {
        this.setState({data: data}, callback);
    }
}

this.handleClickEvent = (el, e) => {
    e.preventDefault();
    e.stopPropagation();
    this.trigger.el = el;
    this.trigger.event = 'click';
    this.trigger.data = this.getTriggerData(el, 'data-popup-click');
    this.updateData(this.trigger.data);
    this.show(e);
}

this.handleHoverIn = (el, e) => {
    if (this.trigger.el !== el) {
        this.trigger.el = el;
        this.trigger.event = 'hover';
        this.trigger.data = this.getTriggerData(el, 'data-popup-hover');
        this.updateData(this.trigger.data);
    }
    this.show(e);
};
this.handleHoverOut = (el, e) => {
    this.hide(e);
};

this.setEventListener = (mode) => {
    this.setEventListenerInternal(mode, 'data-popup-rclick', 'contextmenu', this.handleClickEvent);
    this.setEventListenerInternal(mode, 'data-popup-click', 'click', this.handleClickEvent);
    this.setEventListenerInternal(mode, 'data-popup-hover', 'mousemove', this.handleHoverIn);
    this.setEventListenerInternal(mode, 'data-popup-hover', 'mouseout', this.handleHoverOut);
}

this.setEventListenerInternal = (mode, captureProp, eventName, eventHandler) => {
    const onEventEl = document.body.querySelectorAll(`[${captureProp}\\:${this.props['name']}]`)
    const eventHandlerName = '[[uiPopupHandle' + eventName + ']]';

    onEventEl.forEach(el => {
        if (mode === 'remove') {
            el.removeEventListener(eventName, el[eventHandlerName], false)
            delete el[eventHandlerName];
        } else {
            el[eventHandlerName] = eventHandler.bind(this, el);
            el.addEventListener(eventName, el[eventHandlerName], false);

            if (this.trigger.el === el) {
                this.trigger.prevData = this.trigger.data;
                this.trigger.data = this.getTriggerData(el, captureProp);

                if (!window.is.deepEqual(this.trigger.prevData, this.trigger.data)) {
                    this.updateData(this.trigger.data);
                }
            }
        }
    });
}

