function isArray() {
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

this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

const CHILD_KEY = this.props.childKey
const addUUID = (currentDatas) => {
    const newDatas = currentDatas.map((data) => {
        let newData = {...data}
        newData.$id = uuid()
        const children = newData[CHILD_KEY]
        if (children && isArray(children)) {
            const newChildren = addUUID(children)
            newData[CHILD_KEY] = newChildren
        }
        return newData
    })
    return newDatas
}

const findAndMutate = (id, mutation, root) => {
    const prevData = root
    let newItem = false

    const findIt = (currentDatas) => {
        const newDatas = currentDatas.map((data, index) => {
            let newData = data
            const criteria = data.$id === id
            if (criteria) {
                newData = {
                    ...data,
                    ...mutation,
                }
                newItem = newData
            }
            if (!newItem) {
                const children = newData[CHILD_KEY]
                if (children && isArray(children)) {
                    const newChildren = findIt(children)
                    newData = {
                        ...newData,
                        [CHILD_KEY]: newChildren
                    }
                }
            }
            return newData
        })
        return newDatas
    }

    const nextData = findIt(root);
    return {newItem, nextData, prevData}
}

const findRecursive = (id, root) => {
    let target = false
    const recursive = (currentRoot) => {
        currentRoot.forEach((item) => {
            if (target) return false
            const found = item.$id === id
            if (found) {
                target = item
                return false
            } else {
                const children = item[CHILD_KEY]
                if (children && isArray(children)) {
                    const newChildren = recursive(children)
                }
            }
        })
    }
    recursive(root)
    return target
}

const cleanData = (currentDatas) => {
    const newDatas = currentDatas.map((data) => {
        const newData = {...data}
        Object.keys(newData).forEach((key) => {
            const internalProps = key.indexOf('$') !== -1
            if (internalProps) delete newData[key]
        })
        const children = newData[CHILD_KEY]
        if (children && isArray(children)) {
            const newChildren = cleanData(children)
            newData[CHILD_KEY] = newChildren
        }

        return newData
    })
    return newDatas
}


const addGroupAndSet = (currentDatas, parent, root) => {

    // Using forEach to not mutate the source currentDatas
    currentDatas.forEach((data, i) => {
        if (isFrozen(data)) return false

        data.$index = i
        data.$parent = parent
        data.$group = currentDatas

        data.$cleanData = (datas) => {
            if (isArray(datas)) return cleanData(datas)
            if (isObject(datas)) return cleanData([datas])[0]
            return false
        }
        data.$getRoot = () => cleanData(root)
        data.$getRawRoot = () => root
        data.$make = (obj) => makeData(obj)
        data.$set = (mutation) => {

            // if (mutation[CHILD_KEY]) {
            //     let newChild = addUUID(mutation[CHILD_KEY])
            //     // Make parent, group and root references
            //     let newChildSet =  addGroupAndSet(newChild, mutation, root)
            //     // Make it Immutable
            //     mutation[CHILD_KEY] = freezeData(newChildSet)
            // }

            const {nextData} = findAndMutate(data.$id, mutation, data.$getRawRoot())
            // Fix new parent, group, and root references
            const fixData = addGroupAndSet(nextData, false, nextData)
            const immutable = freezeData(fixData)
            const newItem = findRecursive(data.$id, immutable);
            return newItem
        }

        data.$delete = (clean) => {
            const targetIndex = data.$group.findIndex((find) => find.$id === data.$id)
            if (targetIndex === false) return false

            data.$group.splice(targetIndex, 1)

            return clean ? data.$cleanData(data.$group) : data.$group;
        }

        data.$move = (from, to) => {
            if (!to || !from) false
            let newGroup = [...data.$group]
            let item = newGroup[from]
            newGroup.splice(from, 1)
            newGroup.splice(to, 0, item)
            if (item.$parent) {
                item = item.$parent.$set({
                    ...item.$parent,
                    [CHILD_KEY]: newGroup,
                })
                return item
            } else {
                return remakeData(newGroup)[to];
            }
        }

        data.$insertAt = (siblingIndex, newItem) => {
            const itemId = data.$id

            // Get Only
            const isGet = !newItem
            if (isGet) return data.$group[siblingIndex]

            // Validation Index
            const maxIndex = data.$group.length
            const minIndex = 0
            if (siblingIndex >= maxIndex) siblingIndex = maxIndex
            if (siblingIndex < minIndex) siblingIndex = 0

            let newGroup = [...data.$group]
            const newSibling = makeData(newItem)
            newGroup.splice(siblingIndex, 0, newSibling)
            const newIndex = newGroup.findIndex((item) => item.$id === data.$id)
            if (data.$parent) {
                data = data.$parent.$set({
                    ...data.$parent,
                    [CHILD_KEY]: newGroup,
                })
                return data[CHILD_KEY][newIndex];
            } else {
                return remakeData(newGroup)[newIndex];
            }
        }

        data.$at = data.$insertAt

        data.$next = (newItem) => {
            let newItemIndex = data.$index + 1
            return data.$insertAt(newItemIndex, newItem)
        }

        data.$before = (newItem) => {
            const isGet = !newItem
            if (isGet) return data.$group[data.$index - 1] || false
            let newItemIndex = data.$index
            return data.$insertAt(newItemIndex, newItem)
        }

        data.$duplicate = () => {
            const cleanItem = data.$cleanData(data)
            const newItem = makeData(cleanItem)
            data = data.$next(newItem)
            return data
        }

        data.$setChild = (childs) => {
            
        }

        data.$append = (newItem) => {
            let item = data
            const children = item[CHILD_KEY]
            if (isArray(children)) {
                const newChild = makeData(newItem)
                item = item.$set({
                    [CHILD_KEY]: [
                        ...children,
                        newChild
                    ]
                })
            }
            return item
        }

        data.$prepend = (newItem) => {
            let item = data
            const children = item[CHILD_KEY]
            if (isArray(children)) {
                const newChild = makeData(newItem)
                item = item.$set({
                    [CHILD_KEY]: [
                        newChild,
                        ...children,
                    ]
                })
            }
            return item
        }


        data.$wrap = (wrapperObject) => {
            // Need to Swap TreeId to change focus to the wrapper
            let wrapper = data.$make({
                ...wrapperObject,
                [CHILD_KEY]: [
                    {...data, $id: uuid()}
                ]
            })
            data = data.$set({
                ...wrapper,
                $id: data.$id,
            })
            return data
        }

        const children = data[CHILD_KEY]
        if (children && isArray(children)) {
            data[CHILD_KEY] = addGroupAndSet(children, data, root)
        }
    })
    return currentDatas
}

const freezeData = (datas) => {
    const newDatas = datas.map((data) => {
        if (isFrozen(data)) return data
        const children = data[CHILD_KEY]
        if (children && isArray(children)) {
            const newChildren = freezeData(children)
            data = {
                ...data,
                [CHILD_KEY]: newChildren
            }
        }
        Object.freeze(data)
        return data
    })
    return newDatas
}

const remakeData = (datas) => {
    let newDatas = datas
    // Deep Copy
    newDatas = addUUID(newDatas)
    // Make parent, group and root references
    newDatas = addGroupAndSet(newDatas, false, newDatas)
    // Make it Immutable
    newDatas = freezeData(newDatas)
    return newDatas
}

const makeData = (data) => {
    const fakeArray = [data]
    return remakeData(fakeArray)[0]
}

this.remakeData = remakeData
