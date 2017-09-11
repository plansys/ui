window.is = {
    object: function (obj) {
        return typeof(obj) === 'object' && arr !== null && !obj.length
    },
    frozen: function (obj) {
        return Object.isFrozen(obj)
    },
    array: function (arr) {
        return typeof(arr) === 'object' && arr !== null && (arr.length === 0 || arr.length > 0)
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
    simpleEqual: function (x, y) {
        // SameValue algorithm
        if (x === y) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    },
    shallowEqual: function (objA, objB) { // https://stackoverflow.com/questions/22266826/how-can-i-do-a-shallow-comparison-of-the-properties-of-two-objects-with-javascri
        if (this.simpleEqual(objA, objB)) {
            return true;
        }

        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
            return false;
        }

        let keysA = Object.keys(objA);
        let keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        for (let i = 0; i < keysA.length; i++) {
            if (!Object.hasOwnProperty.call(objB, keysA[i]) || !this.simpleEqual(objA[keysA[i]], objB[keysA[i]])) {
                if (typeof objA[keysA[i]] === 'object' && typeof objB[keysB[i]] === 'object') {
                    try {
                        if (JSON.stringify(objA[keysA[i]]) === JSON.stringify(objA[keysB[i]])) {
                            return true;
                        }
                    } catch (e) {
                        return true;
                    }
                }
                return false;
            }
        }

        return true;
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