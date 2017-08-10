this.state = {
    height: 'auto',
    style: {
        flexBasis: this.state.height || 'auto'
    }
};

this.getStyle = () => {
    let flexBasis = this.props.height || 'auto';
    return {
        ...this.props.style,
        flexBasis,
        flexGrow: flexBasis === 'auto' ? 1 : 0,
        flexDirection: this.getDirection()
    };
};

this.children = null;
this.renderChild = () => {
    if (Array.isArray(this.children)) {
        this.children = this.cloneChildren(this.children);
    }
    return this.children;
};

this.on('componentWillMount', () => {
    if (!this.children) {
        this.children = this.props.children;
    }
});