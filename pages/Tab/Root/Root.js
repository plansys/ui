// https://www.npmjs.com/package/lil-uuid
function uuid() {
    var uuid = '', i, random
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
    }
    return uuid
}


this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

const remakeData = (datas) => {
    const reray = new window.plansys.RecursiveArray(this.props.childKey)
    return reray.remakeData(datas)
}

this.remakeData = remakeData
