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
};

this.handleMouseUp = e => {
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
            let pName = this.mode === 'col' ? 'Width' : 'Height';
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

                if (component.props['min' + pName]) {
                    let minSize = 0;
                    if (component.props['min' + pName].indexOf('px') > 0) {
                        minSize = component.props['min' + pName].replace('px', '') * 1;
                    }

                    if (component.props['min' + pName].indexOf('%') > 0) {
                        let parentSize = ReactDOM.findDOMNode(this.getParent(this)).parentNode['client' + pName];
                        let percentage = component.props['min' + pName].replace('%', '') * 1 / 100;
                        minSize = parentSize * percentage;
                    }

                    if (!isNaN(minSize) && !isNaN(this.drag.delta.size)) {
                        this.drag.delta.size = Math.max(minSize, this.drag.delta.size);
                    }
                }

                if (component.props['max' + pName]) {
                    let maxSize = 0;
                    if (component.props['max' + pName].indexOf('px') > 0) {
                        maxSize = component.props['max' + pName].replace('px', '') * 1;
                    }

                    if (component.props['max' + pName].indexOf('%') > 0) {
                        let parentSize = ReactDOM.findDOMNode(this.getParent(this)).parentNode['client' + pName];
                        let percentage = component.props['max' + pName].replace('%', '') * 1 / 100;
                        maxSize = parentSize * percentage;
                    }

                    if (!isNaN(maxSize) && !isNaN(this.drag.delta.size)) {
                        this.drag.delta.size = Math.min(maxSize, this.drag.delta.size);
                    }
                }
                this.props.updateComponentSize(component, this.drag.delta.size);
            }
        }
    }
};

this.getType = () => {
    let parent = this._getOwner();
    let childs = parent._getRenderedChilds();
    let current = null;
    for (let i in childs) {
        let c = childs[i];
        if (current !== null) {
            this.next = c;
            break;
        }
        if (c === this.props['[[loader]]']) {
            current = c;
        }
        if (current === null) {
            this.prev = c;
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