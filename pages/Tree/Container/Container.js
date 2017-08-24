this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

this.renderChild = () => {
    if (this.props.template) {
        console.log(this.props.template);
    }
    return this.props.children;
};

this.spreadProps = () => {
    let props = {...this.props};
    if (props.loader) {
        delete props.loader;
    }

    if (props.child) {
        delete props.child;
    }

    if (props.item) {
        delete props.item;
    }

    if (props.key) {
        delete props.key;
    }

    if (props.data) {
        delete props.data;
    }

    return props;
}