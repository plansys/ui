function isArray(arr) {
    return typeof arr === 'object' && arr.length;
}

function isObject(obj) {
    return typeof(obj) === 'object' && !obj.length
}

function isFrozen(obj) {
    return Object.isFrozen(obj)
}

// https://www.npmjs.com/package/lil-uuid
function uuid() {
    let uuid = '', i, random
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
    }
    return uuid
}

const addUUID = (currentDatas) => {
    const result = currentDatas.map((data) => {
        let newData = {...data}
        newData.$id = uuid()
        return newData
    })
    return result
}

const freezeData = (datas) => {
    const result = datas.map((data) => {
        if (isFrozen(data)) return data
        Object.freeze(data)
        return data
    })
    return result
}

const cleanData = (currentDatas) => {
    const result = currentDatas.map((data) => {
        const newData = {...data}
        Object.keys(newData).forEach((key) => {
            const internalProps = key.indexOf('$') !== -1
            if (internalProps) delete newData[key]
        })

        return newData
    })
    return result
}

this.active = null;

const duplicateData = (tabs) => {

    // Using forEach to not mutate the source currentDatas
    tabs.forEach((item, idx) => {
        if (isFrozen(item)) return false
        item.$index = idx;

        item.$cleanData = (datas) => {
            if (isArray(datas)) return cleanData(datas)
            if (isObject(datas)) return cleanData([datas])[0]
            return false
        }

        item.$activate = () => {
            if (typeof this.props.onChange == 'function') {
                this.props.onChange(item, this.active);
            }
            this.active = item;
            this.props.$parent.forceUpdate();
            return item;
        }

        item.$close = () => {
            tabs.splice(idx, 1);
            let newTabs = remakeData(tabs);

            if (!!this.active && item.$index === this.active.$index) {
                let newIdx = idx === tabs.length ? idx - 1 : idx;

                if (tabs.length > 1) {
                    this.active = newTabs[newIdx];
                    this.active.$index = newIdx;
                } else {
                    this.active = null;
                }
            }

            return newTabs;
        }


        item.$closeOther = () => {
            tabs.splice(idx + 1, tabs.length - 1);
            tabs.splice(0, idx);

            let newTabs = remakeData(tabs);
            this.active = newTabs[0];
            return newTabs;
        }

        item.$closeRight = () => {
            tabs.splice(idx + 1, tabs.length - 1);
            let newTabs = remakeData(tabs);

            if (this.active && this.active.$index > idx) {
                this.active = newTabs[idx];
            }
            return newTabs;
        }

        item.$closeLeft = () => {
            tabs.splice(0, idx);
            let newTabs = remakeData(tabs);

            if (this.active && this.active.$index < idx) {
                this.active = newTabs[0];
            }
            return newTabs;
        }

        item.$getRoot = () => cleanData(tabs)
    });
    return tabs;
};

const remakeData = (datas) => {
    // Deep Copy
    let result = addUUID(datas)
    // Make parent, group and root references
    result = duplicateData(result)
    // Make it Immutable
    result = freezeData(result)
    return result
}


this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

this.remakeData = remakeData
