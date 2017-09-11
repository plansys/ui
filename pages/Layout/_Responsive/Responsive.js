this.state = {
    tag: "div"
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

this.responsiveWindowResize = (e) => {
    console.log(e.target.innerWidth);
};

this.on('componentWillUnmount', () => {
    window.removeEventListener('resize', this.responsiveWindowResize);
});

this.on('componentWillMount', () => {
    window.addEventListener('resize', this.responsiveWindowResize);
});