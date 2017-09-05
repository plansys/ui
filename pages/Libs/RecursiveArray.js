const {isArray, isFrozen, isObject, isFunction, isString} = utils

function RecursiveArray(theDatas, childKey, customInfo) {
    const CHILD_KEY = childKey

    function cleanData(currentDatas) {
        const newDatas = currentDatas.map((data) => {
            const newData = {...data}
            Object.keys(newData).forEach((key) => {
                const internalProps = key.indexOf('_') === 0
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

    function addInfo(currentDatas, parent, root, path) {
      path = path || false
      // Using forEach to not mutate the source currentDatas
      currentDatas.forEach((data, i) => {
        if (isFrozen(data)) return false
        data._index = i
        data._parent = parent
        data._parentPath = parent._path
        data._group = currentDatas
        data._groupPath = (path || false)
        data._path = (path ? `${path}.${i}` : `${i}`)
        data._root = root

        data._set = (mutation) => {
          mutator(root, data._path, mutation)
          return cleanData(root)
        }
        data._mutator = mutator
        data._cleanData = cleanData
        data._getRoot = () => cleanData(data._root)

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

        data._next = (newItem) => {
          let newItemIndex = data._index + 1
          return data._insertAt(newItemIndex, newItem)
        }

        data._before = (newItem) => {
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
          if (isArray(children)) {
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
          if (isArray(children)) {
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


        if (customInfo) data = customInfo(data)
        const children = data[CHILD_KEY]
        if (children && isArray(children)) {
          const childrenPath = data._path + `.${CHILD_KEY}`
          data[CHILD_KEY] = addInfo(children, data, root, childrenPath)
        }
        Object.freeze(data)
      })
      return currentDatas
    }

    function deepCopy(currentDatas) {
        const newDatas = currentDatas.map((data) => {
            let newData = {...data}
            const children = newData[CHILD_KEY]
            if (children && isArray(children)) {
                const newChildren = deepCopy(children)
                newData[CHILD_KEY] = newChildren
            }
            return newData
        })
        return newDatas
    }

    function remakeData(datas) {
        let newDatas = datas
        newDatas = deepCopy(newDatas, false, newDatas)
        newDatas = addInfo(newDatas, false, newDatas)
        return newDatas
    }

    return remakeData(theDatas)
}
