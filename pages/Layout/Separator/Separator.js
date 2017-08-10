this.prev = null;
this.next = null;
this.mode = 'none';
this.drag = {
    dragging: false,
    start: {
        size: null,
        x: 0,
        y: 0
    },
    delta: {
        size: null,
        x: 0,
        y: 0
    }
};

this.isDragging = () => {
    return this.drag.dragging ? 'dragging' : '';
}

this.getParent = (el) => {
    return el._reactInternalInstance._currentElement._owner._instance;
};

this.handleMouseOut = this.handleMouseUp = e => {
    this.drag = {
        dragging: false
    };
    this.forceUpdate();
};

this.handleMouseDown = e => {
    this.drag = {
        dragging: true,
        start: {
            size: null,
            x: e.pageX,
            y: e.pageY
        },
        delta: {
            size: null,
            x: 0,
            y: 0
        }
    };
    this.forceUpdate();
};

this.handleMouseMove = e => {
    if (this.drag.dragging) {
        this.drag.delta.x = e.pageX - this.drag.start.x;
        this.drag.delta.y = e.pageY - this.drag.start.y;

        if (this.prev && this.next) {
            let pname = this.mode === 'col' ? 'width' : 'height';
            let oname = this.mode === 'col' ? 'offsetWidth' : 'offsetHeight';
            let dname = this.mode === 'col' ? 'x' : 'y';
            let prevsize = this.prev.props[pname];
            let nextsize = this.next.props[pname];
            let component = null;

            if (!!prevsize && prevsize !== 'auto') {
                component = this.prev;
            } else if (!!nextsize && nextsize !== 'auto') {
                component = this.next;
            }

            if ((!prevsize || prevsize === 'auto') && (!nextsize || nextsize === 'auto')) {
                component = this.prev;
            }

            if (component) {
                let el = ReactDOM.findDOMNode(component);

                if (this.drag.start.size === null) {
                    this.drag.start.size = el[oname];
                }

                if (component === this.prev) {
                    this.drag.delta.size = this.drag.start.size + this.drag.delta[dname];
                } else {
                    this.drag.delta.size = this.drag.start.size - this.drag.delta[dname];
                }

                this.props.updateComponentSize(component, this.drag.delta.size);
            }
        }
    }
};

this.getType = () => {
    let parent = this.getParent(this);
    let childrens = parent._reactInternalInstance._hostParent._renderedChildren;
    let current = null;
    for (let i in childrens) {
        let c = childrens[i];
        if (current !== null) {
            this.next = c._instance;
            break;
        }
        if (c._instance === this.props.loader) {
            current = c._instance;
        }
        if (current === null) {
            this.prev = c._instance;
        }
    }

    if ((this.prev && this.prev.name === 'ui:Layout.Row') || (this.next && this.next.name === 'ui:Layout.Row')) {
        this.mode = 'row';
        return this.mode;
    } else if ((this.prev && this.prev.name === 'ui:Layout.Col') || (this.next && this.next.name === 'ui:Layout.Col')) {
        this.mode = 'col';
        return this.mode;
    }

    this.mode = 'none';
    return this.mode;
};