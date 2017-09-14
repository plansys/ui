if (!window.plansys.ui.tree) {
    window.plansys.ui['tree'] = {};
}


window.plansys.ui.tree.RecursiveArray = class RecursiveArray {
    constructor(childKey) {
        this.childKey = childKey;
    }

    addInfo(currentDatas, parent, root, depth, path = false) {
        const mutate = window.plansys.ui.tree.Mutator.mutate

        currentDatas.forEach((data, i) => {
            if (is.frozen(data)) return false

            data._original = Object.assign({}, data);
            Object.keys(data._original).forEach((key) => {
                const internalProps = key.indexOf('_') === 0
                if (internalProps) delete data._original[key]
            })

            data._index = i
            data._depth = depth
            data._parent = parent
            data._parentPath = parent._path
            data._group = currentDatas
            data._groupPath = (path || false)
            data._path = (path ? `${path}.${i}` : `${i}`)
            data._root = root

            data._getRoot = (clean = true) => {
                return this.deepCopy(root, clean);
            }

            data._set = (mutation, cleanRoot = true) => {
                mutate(root, data._path, mutation);
                return data._getRoot(cleanRoot);
            }

            data._delete = (cleanRoot = true) => {
                data._group.splice(data._index, 1)
                return data._getRoot(cleanRoot)
            }

            data._move = (from, to, cleanRoot = true) => {
                if (!to || !from) false
                data._group.splice(from, 1)
                data._group.splice(to, 0, data)
                return data._getRoot(cleanRoot)
            }

            data._insertAt = (siblingIndex, newItem, cleanRoot = true) => {
                // Get Only
                const isGet = !newItem
                if (isGet) return data._group[siblingIndex]
                // Validation Index
                const maxIndex = data._group.length
                const minIndex = 0
                if (siblingIndex >= maxIndex) siblingIndex = maxIndex
                if (siblingIndex < minIndex) siblingIndex = 0
                data._group.splice(siblingIndex, 0, newItem)
                return data._getRoot(cleanRoot)
            }

            data._at = data._insertAt
            data._next = data._insertNext = (newItem, cleanRoot = true) => {
                let newItemIndex = data._index + 1
                return data._insertAt(newItemIndex, newItem, cleanRoot)
            }

            data._prev = data._insertPrev = (newItem, cleanRoot = true) => {
                const isGet = !newItem
                if (isGet) return data._group[data._index - 1] || false
                let newItemIndex = data._index
                return data._insertAt(newItemIndex, newItem, cleanRoot)
            }

            data._duplicate = () => {
                return data._next(data)
            }

            data._append = (newItem, cleanRoot = true) => {
                const children = data[CHILD_KEY]
                if (is.array(children)) {
                    return data._set(Object.assign({}, {
                        [CHILD_KEY]: [
                            Object.assign({}, children),
                            newItem
                        ]
                    }));
                }
                return data._getRoot(cleanRoot)
            }

            data._prepend = (newItem, cleanRoot = true) => {
                const children = data[CHILD_KEY]
                if (is.array(children)) {
                    return data._set(Object.assign({},
                        {
                            [CHILD_KEY]: [
                                newItem,
                                Object.assign({}, children),
                            ]
                        }));
                }
                return data._getRoot(cleanRoot)
            }

            data._equal = (item) => {
                return is.shalowEqual(data._original, item && item._original ? item._original : item);
            }

            data._wrap = (wrapperObject) => {

                let wrapper = Object.assign({},
                    wrapperObject,
                    {
                        [CHILD_KEY]: [
                            data,
                        ]
                    });

                return data._set(wrapper)
            }

            if (typeof this.customInfo === 'function') {
                data = this.customInfo(data)
            }

            const children = data[this.childKey]
            if (children && is.array(children)) {
                const childrenPath = data._path + `.${this.childKey}`
                data[this.childKey] = this.addInfo(children, data, root, depth + 1, childrenPath)
            }
            Object.freeze(data)
        })
        return currentDatas
    }

    deepCopy(currentDatas, clean = false) {
        let isSingle = false
        if (!is.array(currentDatas)) {
            isSingle = true
            currentDatas = [currentDatas]
        }

        const result = currentDatas.map((data) => {
            let newData = Object.assign({}, data);

            if (clean) {
                Object.keys(newData).forEach((key) => {
                    const internalProps = key.indexOf('_') === 0
                    if (internalProps) delete newData[key]
                })
            }

            const children = newData[this.childKey]
            if (children && is.array(children)) {
                const newChildren = this.deepCopy(children, clean)
                newData[this.childKey] = newChildren
            }
            return newData
        })

        return isSingle ? result[0] : result
    }

    remakeData(datas, customInfo) {
        this.customInfo = customInfo;
        let newDatas = datas
        newDatas = this.deepCopy(newDatas)
        newDatas = this.addInfo(newDatas, false, newDatas, 0)
        return newDatas
    }

}