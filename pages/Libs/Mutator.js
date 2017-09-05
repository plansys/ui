window.plansys.Mutator = class Mutator {
    static mutate(source, pathString = "", mutation = false) {
        Mutator.is = window.plansys.Checker;
        const target = Mutator._mutateInternal(source, 0, pathString.split('.'), mutation)
        return mutation ? source : target
    }

    static _mutateInternal(currentObject, currentPathIndex, arrayOfPath, mutation = false) {
        let copy = currentObject
        const currentPath = arrayOfPath[currentPathIndex]
        const nextPathIndex = currentPathIndex + 1
        const max = arrayOfPath.length
        if (nextPathIndex !== max) return Mutator._mutateInternal(copy[currentPath], nextPathIndex, arrayOfPath, mutation)
        if (mutation) {
            copy[currentPath] = Mutator.is.func(mutation) ? mutation(copy[currentPath]) : {...copy[currentPath], ...mutation}
        }

        return copy[currentPath]
    }
}
