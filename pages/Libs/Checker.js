window.plansys.Checker = class Checker {
    static object(obj) {
        return typeof(obj) === 'object' && !obj.length
    }

    static frozen(obj) {
        return Object.isFrozen(obj)
    }

    static array(arr) {
        return typeof(arr) === 'object' && (arr.length === 0 || arr.length > 0)
    }

    static number(obj) {
        return typeof(obj) === 'number'
    }

    static string(str) {
        return typeof(str) === 'string'
    }

    static func(func) {
        return typeof(func) === 'function'
    }

    static howLong(name, func) {
        console.time(name);
        func()
        console.timeEnd(name);
    }
}