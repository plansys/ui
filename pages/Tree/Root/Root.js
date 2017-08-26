this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

const CHILD_KEY = this.props.childKey;
const cleanData = (datas) => {
    const newDatas = datas.map((data) => {
        delete data.treeId
        delete data.set
        delete data.groups
        delete data.parent

        const children = data[CHILD_KEY]
        if (children && isArray(children)) {
            const newChildren = cleanData(children)
            data[CHILD_KEY] = newChildren
        }

        return data
    })
    return newDatas
}

const findAndMutate = (datas, treeId, mutation, root) => {
    const prevData = root
    let newItem = false

    const findIt = (currentDatas) => {
        const newDatas = currentDatas.map((data, index) => {
            let newData = {...data}
            const criteria = data.treeId === treeId
            if (criteria) {
                newData = {
                    ...data,
                    ...mutation,
                    treeId
                }
            }
            const children = newData[CHILD_KEY]
            if (children && isArray(children)) {
                const newChildren = findIt(children)
                newData[CHILD_KEY] = newChildren
            }
            newItem = newData
            return newData
        })
        return newDatas
    }
    const nextData = findIt(root);
    return {newItem, nextData, prevData}
}

const addGroupAndSet = (datas, parent, root) => {
    // Using forEach to not mutate the source datas
    datas.forEach((data) => {
        if (typeof (data) == 'object' && !data.length) {
            data.parent = parent
            data.groups = datas
            data.set = (mutation) => {
                const {nextData} = findAndMutate(datas, data.treeId, mutation, root)
                return cleanData(nextData)
            }
            const children = data[CHILD_KEY]
            if (children && isArray(children)) {
                data[CHILD_KEY] = addGroupAndSet(children, data, root)
            }
        }
    })
    return datas
}

function isArray() {
    return typeof arr === 'object' && arr.length;
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

const addUUID = (datas) => {
    const newDatas = datas.map((data) => {
        let newData = {...data}

        newData.treeId = uuid()

        const children = newData[CHILD_KEY]
        if (children && isArray(children)) {
            const newChildren = remakeData(children)
            newData[CHILD_KEY] = newChildren
        }
        return newData
    })
    return newDatas
}

this.remakeData = (datas) => {
    const uniqData = addUUID(datas)
    return addGroupAndSet(uniqData, false, uniqData)
};

// {props.renderBranch(remakeData(props.data), props.renderBranch)}
