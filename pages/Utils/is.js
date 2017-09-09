window.is = {
    object: function (obj) {
        return typeof(obj) === 'object' && !obj.length
    },
    frozen: function (obj) {
        return Object.isFrozen(obj)
    },
    array: function (arr) {
        return typeof(arr) === 'object' && (arr.length === 0 || arr.length > 0)
    },
    number: function (obj) {
        return typeof(obj) === 'number'
    },
    string: function (str) {
        return typeof(str) === 'string'
    },
    function: function (func) {
        return typeof(func) === 'function'
    },
    deepEqual: function (a, b) { // https://github.com/epoberezkin/fast-deep-equal
        if (a === b) return true;

        let arrA = Array.isArray(a)
            , arrB = Array.isArray(b)
            , i;

        if (arrA && arrB) {
            if (a.length !== b.length) return false;
            for (i = 0; i < a.length; i++)
                if (!this.deepEqual(a[i], b[i])) return false;
            return true;
        }

        if (arrA !== arrB) return false;

        if (a && b && typeof a === 'object' && typeof b === 'object') {
            let keys = Object.keys(a);
            if (keys.length !== Object.keys(b).length) return false;

            let dateA = a instanceof Date
                , dateB = b instanceof Date;
            if (dateA && dateB) return a.getTime() === b.getTime();
            if (dateA !== dateB) return false;

            let regexpA = a instanceof RegExp
                , regexpB = b instanceof RegExp;
            if (regexpA && regexpB) return a.toString() === b.toString();
            if (regexpA !== regexpB) return false;

            for (i = 0; i < keys.length; i++)
                if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

            for (i = 0; i < keys.length; i++)
                if (!this.deepEqual(a[keys[i]], b[keys[i]])) return false;

            return true;
        }

        return false;
    }
}