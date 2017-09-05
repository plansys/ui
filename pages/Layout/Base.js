window.plansys.uiLayout = function (that) {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    that.getChildren = () => {
        if (typeof that.props.children === 'undefined') return [];
        else if (Array.isArray(that.props.children)) return that.props.children;
        else return [that.props.children];
    };

    that.getDirection = () => {
        let result = 'row';
        that.getChildren().map(tag => {
            if (typeof tag.type === "function" && tag.props.name === 'ui:Layout.Row') {
                result = 'column';
            }
        });
        return result;
    };

    that.getDirection = () => {
        let result = 'row';
        that.getChildren().map(tag => {
            if (!tag || !tag.props || !tag.props.name) return null;

            if (typeof tag.type === "function" && tag.props.name === 'ui:Layout.Row') {
                result = 'column';
            }
        });
        return result;
    };

    that.isLayout = () => {
        let isLayout = false;
        if (that.props.children && that.props.children.forEach) {
            that.props.children.forEach(c => {
                if (!!c.props && c.props.name && c.props.name.indexOf('ui:Layout.') === 0) {
                    isLayout = true;
                }
            });
        }
        return isLayout;
    };

    that.cloneChildren = (children) => {
        return children.map((tag, idx) => {
            if (typeof tag !== 'object') return tag;
            if (!tag || !tag.props || !tag.props.name) return null;

            if (that.oldResizedComponent) {
                if (that.oldResizedComponent._reactInternalInstance._currentElement.key * 1 === idx * 1) {
                    that.oldResizedComponent = null;

                    let size = {};

                    if (tag.props.name === 'ui:Layout.Col') {
                        size.width = that.newComponentSize;
                    } else if (tag.props.name === 'ui:Layout.Row') {
                        size.height = that.newComponentSize;
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
                    updateComponentSize: that.updateComponentSize,
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

    that.newComponentSize = null;
    that.oldResizedComponent = null;
    that.updateComponentSize = (tag, size) => {
        that.oldResizedComponent = tag;
        that.newComponentSize = size;
        that.forceUpdate();
    };

}