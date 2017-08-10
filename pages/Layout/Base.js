this.getChildren = () => {
    if (typeof this.props.children === 'undefined') return [];
    else if (Array.isArray(this.props.children)) return this.props.children;
    else return [this.props.children];
};

this.getDirection = () => {
    let result = 'row';
    this.getChildren().map(tag => {
        if (typeof tag.type === "function" && tag.props.name === 'ui:Layout.Row') {
            result = 'column';
        }
    });
    return result;
};

this.getDirection = () => {
    let result = 'row';
    this.getChildren().map(tag => {
        if (typeof tag.type === "function" && tag.props.name === 'ui:Layout.Row') {
            result = 'column';
        }
    });
    return result;
};

this.cloneChildren = (children) => {
    return children.map((tag, idx) => {
        if (this.oldResizedComponent) {
            if (this.oldResizedComponent._reactInternalInstance._currentElement.key * 1 === idx * 1) {
                this.oldResizedComponent = null;

                let size = {};
                if (tag.props.name === 'ui:Layout.Col') {
                    size.width = this.newComponentSize;
                } else if (tag.props.name === 'ui:Layout.Row') {
                    size.height = this.newComponentSize;
                }

                return React.cloneElement(tag, {
                    ...tag.props,
                    ...size,
                    key: idx
                });
            }
        }

        if (tag.props.name === 'ui:Layout.Separator') {
            return React.cloneElement(tag, {
                ...tag.props,
                updateComponentSize: this.updateComponentSize,
                key: idx
            });
        } else {
            return React.cloneElement(tag, {
                ...tag.props,
                key: idx
            });
        }
    });
};

this.newComponentSize = null;
this.oldResizedComponent = null;
this.updateComponentSize = (tag, size) => {
    this.oldResizedComponent = tag;
    this.newComponentSize = size;
    this.forceUpdate();
};