window.plansys.uiLayout(this);

this.state = {
    height: 'auto'
};

this.getStyle = () => {
    let flexBasis = this.props.width || 'auto';

    let justifyContent = 'flex-start';
    switch (this.props.halign) {
        case 'left':
            justifyContent = 'flex-start';
            break;
        case 'center':
            justifyContent = 'center';
            break;
        case 'right':
            justifyContent = 'flex-end';
            break;
    }

    let alignItems = 'stretch';
    switch (this.props.valign) {
        case 'top':
            alignItems = 'flex-start';
            break;
        case 'center':
            alignItems = 'center';
            break;
        case 'bottom':
            alignItems = 'flex-end';
            break;
    }

    return {
        position: 'relative',
        ...this.props.style,
        flexBasis,
        flexGrow: flexBasis === 'auto' ? 1 : 0,
        flexDirection: this.getDirection(),
        justifyContent,
        alignItems
    };
};

this.getClassName = () => {
    return 'layout-col ' + (this.props.className || '')
};

this.children = null;
this.renderChild = () => {
    if (this.isLayout()) {
        if (Array.isArray(this.children)) {
            this.children = this.cloneChildren(this.children);
        }
        return this.children;
    } else {
        return this.props.children;
    }
};

this.on('componentWillMount', () => {
    if (!this.children) {
        this.children = this.props.children;
    }
});

this.on('componentWillReceiveProps', (newProps) => {
    this.children = newProps.children;
});