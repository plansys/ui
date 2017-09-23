this.active = null;
this.activate = item => {
    this.active = item;
}

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
    let hasBeenActivated = false;
    this.recursiveArray = new window.plansys.ui.tree.RecursiveArray(this.props.childKey)

    setTimeout(() => {
        if (hasBeenActivated) {
            this.activate(null);
        }
    })

    return this.recursiveArray.remakeData(datas, item => {
        if (item.active) {
            hasBeenActivated = true;
            this.activate(item);
        }

        item._close = () => {
            if (item._root.length > 1 && item.active) {
                let newActiveItem = item._next() || item._prev();
                let result = newActiveItem._set({
                    active: true
                }, false)
                this.activate(result[newActiveItem._index]);
                return result[item._index]._delete();
            } else {
                this.activate(null);
                return item._delete();
            }
        }
        return item;
    })
}

this.remakeData = remakeData
