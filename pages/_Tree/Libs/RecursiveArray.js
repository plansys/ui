if (!window.plansys.ui || !window.plansys.ui.tree ) {
    window.plansys.ui = { ...window.plansys.ui, tree: {} };
}

window.plansys.ui.tree.RecursiveArray = class RecursiveArray {
    constructor(childKey, customInfo) {
        this.childKey = childKey;
        this.customInfo = customInfo;
    }

    addInfo(currentDatas, parent, root, depth, path = false) {
        const mutate = window.plansys.ui.tree.Mutator.mutate

        // Using forEach to not mutate the source currentDatas
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
            data._originalRoot = root

            data._getRoot = () => {
                return this.deepCopy(root, true);
            }

            data._set = (mutation) => {
                mutate(root, data._path, mutation);
                return data._getRoot();
            }

            data._delete = () => {
                data._group.splice(data._index, 1)
                return data._getRoot()
            }

            data._move = (from, to) => {
                if (!to || !from) false
                data._group.splice(from, 1)
                data._group.splice(to, 0, data)
                return data._getRoot()
            }

            data._insertAt = (siblingIndex, newItem) => {
                // Get Only
                const isGet = !newItem
                if (isGet) return data._group[siblingIndex]
                // Validation Index
                const maxIndex = data._group.length
                const minIndex = 0
                if (siblingIndex >= maxIndex) siblingIndex = maxIndex
                if (siblingIndex < minIndex) siblingIndex = 0
                data._group.splice(siblingIndex, 0, newItem)
                return data._getRoot()
            }

            data._at = data._insertAt
            data._next = data._insertNext = (newItem) => {
                let newItemIndex = data._index + 1
                return data._insertAt(newItemIndex, newItem)
            }

            data._prev = data._insertPrev = (newItem) => {
                const isGet = !newItem
                if (isGet) return data._group[data._index - 1] || false
                let newItemIndex = data._index
                return data._insertAt(newItemIndex, newItem)
            }

            data._duplicate = () => {
                return data._next(data)
            }

            data._append = (newItem) => {
                const children = data[CHILD_KEY]
                if (is.array(children)) {
                    return data._set({
                        [CHILD_KEY]: [
                            ...children,
                            newItem
                        ]
                    })
                }
                return data._getRoot()
            }

            data._prepend = (newItem) => {
                const children = data[CHILD_KEY]
                if (is.array(children)) {
                    return data._set({
                        [CHILD_KEY]: [
                            newItem,
                            ...children,
                        ]
                    })
                }
                return data._getRoot()
            }

            data._wrap = (wrapperObject) => {
                let wrapper = {
                    ...wrapperObject,
                    [CHILD_KEY]: [
                        data,
                    ]
                }
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
            let newData = {...data}

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

    remakeData(datas) {
        let newDatas = datas
        newDatas = this.deepCopy(newDatas)
        newDatas = this.addInfo(newDatas, false, newDatas, 0)
        return newDatas
    }

}