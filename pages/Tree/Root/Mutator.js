
const { isFunction } = utils

function mutate(currentObject, currentPathIndex, arrayOfPath, mutation = false) {
  let copy = currentObject
  const currentPath = arrayOfPath[currentPathIndex]
  const nextPathIndex = currentPathIndex + 1
  const max = arrayOfPath.length
  if (nextPathIndex !== max) return mutate(copy[currentPath], nextPathIndex, arrayOfPath, mutation)
  if (mutation) {
    copy[currentPath] = isFunction(mutation) ? mutation(copy[currentPath]) : { ...copy[currentPath], ...mutation }
  }
  return copy[currentPath]
}

function Mutator(source, pathString = "", mutation = false) {
  const target = mutate(source, 0, pathString.split('.'), mutation)
  return mutation ? source : target
}
