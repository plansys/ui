if (!window.plansys.ui) {
    window.plansys.ui = {};
}

window.plansys.ui.layout = function (current) {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    current.getChildren = () => {
        if (typeof current.props.children === 'undefined') return [];
        else if (Array.isArray(current.props.children)) return current.props.children;
        else return [current.props.children];
    };

    current.getDataProps = () => {
        if (typeof current.props !== 'object') return {};

        let dataProps = {};
        Object.keys(current.props).forEach(propKey => {
            if (propKey.indexOf('data-') === 0) {
                dataProps[propKey] = current.props[propKey];
            }
        });
        return dataProps;
    }

    current.getDirection = () => {
        let result = 'row';
        current.getChildren().map(tag => {
            if (!tag || !tag.props || !tag.props['[[name]]']) return null;

            if (typeof tag.type === "function" && tag.props['[[name]]'] === 'ui:Layout.Row') {
                result = 'column';
            }
        });
        return result;
    };

    current.isLayout = () => {
        let isLayout = false;
        if (current.props.children && current.props.children.forEach) {
            current.props.children.forEach(c => {
                if (!!c.props && c.props['[[name]]'] && c.props['[[name]]'].indexOf('ui:Layout.') === 0) {
                    isLayout = true;
                }
            });
        }
        return isLayout;
    };

    current.cloneChildren = (children) => {
        return children.map((tag, idx) => {
            if (typeof tag !== 'object') return tag;
            if (!tag || !tag.props || !tag.props['[[name]]']) return null;

            if (current.oldResizedComponent) {
                if (current.oldResizedComponent._reactInternalInstance._currentElement.key * 1 === idx * 1) {
                    let size = {};

                    if (tag.props['[[name]]'] === 'ui:Layout.Col') {
                        size.width = current.newComponentSize;
                    } else if (tag.props['[[name]]'] === 'ui:Layout.Row') {
                        size.height = current.newComponentSize;
                    }

                    let props = Object.assign({},
                        tag.props,
                        size,
                        {key: idx}
                    );

                    return React.cloneElement(tag, props);
                }
            }

            if (tag.props['[[name]]'] === 'ui:Layout.Separator') {
                return React.cloneElement(tag, Object.assign({},
                    tag.props,
                    {
                        updateComponentSize: current.updateComponentSize,
                        key: idx
                    })
                );
            } else {
                return React.cloneElement(tag, Object.assign({},
                    tag.props,
                    {key: idx}
                ));
            }
        });
    };

    current.newComponentSize = null;
    current.oldResizedComponent = null;
    current.updateComponentSize = (tag, size) => {
        current.oldResizedComponent = tag;
        current.newComponentSize = size;
        current.forceUpdate();
    };

}