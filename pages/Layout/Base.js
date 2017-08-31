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
        if (!tag || !tag.props || !tag.props.name) return null;

        if (typeof tag.type === "function" && tag.props.name === 'ui:Layout.Row') {
            result = 'column';
        }
    });
    return result;
};

this.isLayout = () => {
    let isLayout = false;
    if (this.props.children && this.props.children.forEach) {
        this.props.children.forEach(c => {
            if (!!c.props && c.props.name && c.props.name.indexOf('ui:Layout.') === 0) {
                isLayout = true;
            }
        });
    }
    return isLayout;
};

this.cloneChildren = (children) => {
    return children.map((tag, idx) => {
        if (typeof tag !== 'object') return tag;
        if (!tag || !tag.props || !tag.props.name) return null;

        if (this.oldResizedComponent) {
            if (this.oldResizedComponent._reactInternalInstance._currentElement.key * 1 === idx * 1) {
                this.oldResizedComponent = null;

                let size = {};

                if (tag.props.name === 'ui:Layout.Col') {
                    size.width = this.newComponentSize;
                } else if (tag.props.name === 'ui:Layout.Row') {
                    size.height = this.newComponentSize;
                }

                let props = {
                    ...tag.props,
                    ...size,
                    key: idx
                };

                return React.cloneElement(tag, props);
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