this.state = {
    tag: "div"
};

this.getChildren = () => {
    if (typeof this.props.children === 'undefined') return [];
    else if (Array.isArray(this.props.children)) return this.props.children;
    else return [this.props.children];
};

this.renderChild = () => {
    let allowedTag = ['ui:Layout.Row', 'ui:Layout.Col', 'ui:Layout.Separator'];
    let firstTag = '';
    return this.getChildren().map((tag, idx) => {
        if (typeof tag.type === "function" && allowedTag.indexOf(tag.props.name) >= 0) {
            if (tag.props.name === 'ui:Layout.Separator') {
                return tag;
            }

            if (firstTag === '') {
                firstTag = tag.props.name;
                return tag;
            } else if (tag.props.name === firstTag) {
                return tag;
            }
        }
        return null;
    });
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
    return {
        flexDirection: this.getDirection()
    };
};

this.on('componentWillMount', () => {
    if (this.props.tag) {
        this.setState({
            tag: this.props.tag,
        });
    }

    if (this.getDirection() !== this.state.direction) {
        this.setState({direction: this.getDirection()});
    }
});


this.on('componentWillUpdate', () => {
    if (this.props.tag) {
        this.setState({
            tag: this.props.tag,
        });
    }
});
