this.state = {
    active: false,
    position: {
        // screen-center, screen-center-top
        // element-top element-bottom, element-right, element-left,
        // mouse, mouse-top, mouse-bottom, mouse-right, mouse-left
        name: 'screen-center-top',
        top: -999999,
        left: -999999
    },
    data: null,
}

if (!window.plansys.ui) {
    window.plansys.ui = {};
}

if (!window.plansys.ui.popup) {
    window.plansys.ui.popup = {};
}

this.isUnique = true;
this.instance = this;
if (!window.plansys.ui.popup[this.props.name]) {
    window.plansys.ui.popup[this.props.name] = this;
} else {
    this.instance = window.plansys.ui.popup[this.props.name];
    this.isUnique = false;
}

this.on("componentDidMount", () => {
    if (this.isUnique) {
        this.setEventListener("add");
    }
})

this.on("componentWillUnmount", () => {
    if (!this.isUnique) return;
    this.setEventListener("remove")
})

this.on("componentWillReceiveProps", nextProps => {
    if (!this.isUnique) return;

    if (nextProps.position) {
        this.instance.setState({
            position: {
                ...this.instance.state.position,
                name: nextProps.position
            }
        })
    }
})

this.on("componentDidUpdate", () => {
    if (!this.isUnique) return;
    this.setEventListener("remove")
    this.setEventListener("add")
})

this.resetTrigger = () => {
    this.instance.trigger = {
        el: null,
        event: '',
        data: null,
        prevData: null,
    };
}
if (!this.instance.trigger) {
    this.resetTrigger();
}

this.getTriggerData = (el, captureProp) => {
    let state = null;
    for (let key in el) {
        if (key.startsWith("__reactInternalInstance$")) {
            state = el[key]._currentElement.props[`${captureProp}\:${this.props['name']}`];
        }
    }
    return state;
};

this.showOverlay = () => {
    if (this.instance.trigger.event === 'hover' || !this.instance.trigger) return false;
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

this.setPopupPosition = (e, triggerPosition) => {
    if (this.instance.popupContainer && (e.target || triggerPosition)) {
        let popup = this.instance.popupContainer;
        let left = -999999;
        let top = -999999;

        let trigger = triggerPosition || e.target.getBoundingClientRect();

        if (this.instance.trigger.el) {
            trigger = triggerPosition || this.instance.trigger.el.getBoundingClientRect()
        }

        trigger.w = trigger.width;
        trigger.h = trigger.height;

        if (e.pageX && e.pageY) {
            trigger.pageX = e.pageX;
            trigger.pageY = e.pageY;
        }

        const cursorSize = 12;
        switch (this.instance.state.position.name) {
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
                left = trigger.pageX + (cursorSize);
                top = trigger.pageY;
                break;
            case 'mouse-top':
                left = trigger.pageX - (popup.clientWidth / 2);
                top = trigger.pageY - popup.clientHeight - cursorSize;
                break;
            case 'mouse-bottom':
                left = trigger.pageX - (popup.clientWidth / 2);
                top = trigger.pageY + cursorSize;
                break;
            case 'mouse-left':
                left = trigger.pageX - popup.clientWidth - cursorSize;
                top = trigger.pageY - (popup.clientHeight / 2);
                break;
            case 'mouse-right':
                left = trigger.pageX + cursorSize;
                top = trigger.pageY - (popup.clientHeight / 2);
                break;
        }

        const updateStatePos = (left, top) => {
            let position = this.preventOutOfScreen({left, top});
            this.instance.setState({
                position: {
                    ...this.instance.state.position,
                    ...position
                }
            });
        }

        if (this.instance.state.position.name.indexOf('screen-') === 0) {
            setTimeout(() => {
                switch (this.instance.state.position.name) {
                    case 'screen-center-top':
                        left = (window.innerWidth / 2) - (popup.clientWidth / 2);
                        top = (window.innerHeight / 4) - (popup.clientHeight / 2);
                        break;
                    case 'screen-center':
                        left = (window.innerWidth / 2) - (popup.clientWidth / 2);
                        top = (window.innerHeight / 2) - (popup.clientHeight / 2);
                        break;
                }
                updateStatePos(left, top);
            })
        } else {
            updateStatePos(left, top);
        }
    }
}

this.show = (e, state) => {
    if (this.instance.popupContainer) {
        this.setPopupPosition(e);
    } else {
        let trigger = e.target.getBoundingClientRect();
        trigger.w = trigger.width;
        trigger.h = trigger.height;
        trigger.pageX = e.pageX;
        trigger.pageY = e.pageY;

        setTimeout(() => {
            this.setPopupPosition(e, trigger);
        });
    }

    this.instance.setState({
        ...state,
        active: true
    }, () => {
        setTimeout(() => {
            if (typeof this.props.onShow === 'function') {
                this.props.onShow.bind(this.instance)(this.instance.state.data);
            }
        })

        this.instance.props['[[parent]]'].forceUpdate();
    })
}

this.hide = (e) => {
    this.instance.setState({
        active: false,
        position: {
            ...this.instance.state.position,
            top: -999999,
            left: -999999
        }
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

    const newPosition = {
        top:Math.max(THRESHOLD, top) ,
        left: Math.max(THRESHOLD, left)
    };

    const contentWidth = this.instance.popupContainer.clientWidth
    const offsetRightComponent = left + contentWidth
    const outOfScreenRight = offsetRightComponent > maxRight
    if (outOfScreenRight) {
        const diff = offsetRightComponent - maxRight
        newPosition.left = newPosition.left - diff - THRESHOLD
    }

    const contentHeight = this.instance.popupContainer.clientHeight
    const offsetBottomComponent = top + contentHeight
    const outOfScreenBottom = offsetBottomComponent > maxBottom
    if (outOfScreenBottom) {
        const diff = offsetBottomComponent - maxBottom
        newPosition.top = newPosition.top - diff - THRESHOLD
    }

    return newPosition
}


this.updateData = (data) => {
    let callback = () => {
        this.props['[[parent]]'].forceUpdate();
    }
    if (typeof data === 'object') {
        this.instance.setState({data: {...data}}, callback);
    } else {
        this.instance.setState({data: data}, callback);
    }
}

this.handleClickEvent = (el, e) => {
    e.preventDefault();
    e.stopPropagation();
    this.instance.trigger.el = el;
    this.instance.trigger.event = 'click';
    this.instance.trigger.data = this.getTriggerData(el, 'data-popup-click');
    this.updateData(this.instance.trigger.data);
    this.show(e);
}
this.hoverInTimer = null;
this.handleHoverIn = (el, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (this.instance.trigger.el !== el) {
        this.instance.trigger.el = el;
        this.instance.trigger.event = 'hover';
        this.instance.trigger.data = this.getTriggerData(el, 'data-popup-hover');
        this.updateData(this.instance.trigger.data);
    }

    if (this.hoverOutTimer) {
        clearTimeout(this.hoverOutTimer);
    }

    if (this.props.delay && !this.state.active) {
        this.hoverInTimer = setTimeout(() => {
            this.show(e);
        }, this.props.delay * 1000)
    } else {
        this.show(e);
    }
};
this.hoverOutTimer = null;
this.handleHoverOut = (el, e) => {
    if (this.hoverOutTimer) {
        clearTimeout(this.hoverOutTimer);
    }

    if (this.hoverInTimer) {
        clearTimeout(this.hoverInTimer);
    }

    this.hoverOutTimer = setTimeout(() => {
        this.hide(e);
    }, 100);
};

this.handleEscKey = (e) => {
    if (this.instance.state.active) {
        if (e.which === 27 || e.keyCode === 27) { // escape key
            this.hide(e);
        }
    }
}

this.setEventListener = (mode) => {
    this.setEventListenerInternal(mode, 'data-popup-rclick', 'contextmenu', this.handleClickEvent);
    this.setEventListenerInternal(mode, 'data-popup-click', 'click', this.handleClickEvent);
    this.setEventListenerInternal(mode, 'data-popup-hover', 'mousemove', this.handleHoverIn);
    this.setEventListenerInternal(mode, 'data-popup-hover', 'mouseleave', this.handleHoverOut);

    if (mode === 'add') {
        document.addEventListener('keydown', this.handleEscKey);
    } else {
        document.removeEventListener('keydown', this.handleEscKey);
    }
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

            if (this.instance.trigger.el === el) {
                this.instance.trigger.prevData = this.instance.trigger.data;
                this.instance.trigger.data = this.getTriggerData(el, captureProp);

                if (!window.is.shallowEqual(this.instance.trigger.prevData, this.instance.trigger.data)) {
                    this.updateData(this.instance.trigger.data);
                }
            }
        }
    });
}

