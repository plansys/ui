
const { isArray, isFrozen, isObject, isFunction, isString } = utils

function RecursiveArray(theDatas, childKey, customInfo) {
  const CHILD_KEY = childKey

  function cleanData (currentDatas) {
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
        Mutator(root, data._path.split('.'), mutation)
        return cleanData(root)
      }

      data._mutator = Mutator

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
