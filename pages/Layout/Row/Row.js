this.state = {
    height: 'auto'
};

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
    let flexBasis = this.props.height || 'auto';
    return {
        ...this.props.style,
        flexBasis,
        flexGrow: flexBasis === 'auto' ? 1 : 0,
        flexDirection: this.getDirection()
    };
};
