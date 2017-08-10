this.state = {
    tag: "div"
};


this.getStyle = () => {
    return {
        flexDirection: this.getDirection()
    };
};

this.renderChild = () => {
    let allowedTag = ['ui:Layout.Row', 'ui:Layout.Col', 'ui:Layout.Separator'];
    let firstTag = '';
    let result = [];
    this.getChildren().forEach((tag) => {
        if (typeof tag.type === "function" && allowedTag.indexOf(tag.props.name) >= 0) {
            if (tag.props.name === 'ui:Layout.Separator') {
                result.push(tag);
            }

            if (firstTag === '') {
                firstTag = tag.props.name;
                result.push(tag);
            } else if (tag.props.name === firstTag) {
                result.push(tag);
            }
        }
    });

    return this.cloneChildren(result);
};

this.on('componentWillMount', () => {
    if (this.props.tag) {
        this.setState({
            tag: this.props.tag,
        });
    }
});

this.on('componentWillUpdate', () => {
    if (this.props.tag) {
        this.setState({
            tag: this.props.tag,
        });
    }
});
