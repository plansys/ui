this.tag = () => {
    if (typeof this.props.tag === 'string') {
        return this.props.tag;
    }
    return 'div';
};

const cleanData = (datas) => {
  const newDatas = datas.map((data) => {
    delete data.treeId
    delete data.set
    delete data.groups

    const { children } = data
    if (children && isArray(children)) {
      const newChildren = cleanData(children)
      data.children = newChildren
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
      const { children } = newData
      if (children && isArray(children)) {
        const newChildren = findIt(children)
        newData.children = newChildren
      }
      newItem = newData
      return newData
    })
    return newDatas
  }
  const nextData = findIt(root);
  return { newItem, nextData, prevData }
}


const addGroupAndSet = (datas, parent, root) => {
  // Using forEach to not mutate the source datas
  datas.forEach((data) => {
    data.parent = parent
    data.groups = datas
    data.set = (mutation) => {
      const { nextData } = findAndMutate(datas, data.treeId, mutation, root)
      return nextData
    }
    const { children } = data
    if (children && isArray(children)) {
      data.children = addGroupAndSet(children, data, root)
    }
  })
  return datas
}


const addUUID = (datas) => {
  const newDatas = datas.map((data) => {
    let newData = {...data}
    const { name } = newData
    if (!name) return false
    newData.treeId = uuid()
    const { children } = newData
    if (children && isArray(children)) {
      const newChildren = remakeData(children)
      newData.children = newChildren
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
