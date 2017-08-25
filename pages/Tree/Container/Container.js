this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

this.remakeData = (data) => {
    return data;
};

this.updateTree = (item) => {

};
