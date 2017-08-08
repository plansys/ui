this.state = {
    height: 'auto',
    style: {
        flexBasis: this.state.height || 'auto'
    }
};

this.onResize = e => {
    console.log(e);
}

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

this.getStyle = () => {
    let flexBasis = this.props.width || 'auto';
    return {
        ...this.props.style,
        flexBasis,
        flexGrow: flexBasis === 'auto' ? 1 : 0,
        flexDirection: this.getDirection()
    };
};