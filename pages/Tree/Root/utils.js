
const utils = {

  /**
   * To Check it is an Object or not
   * @param {Object} obj The Object to Check
   * @return {Boolean} The result
   */
  isObject(obj) {
    return typeof(obj) === 'object' && !obj.length
  },

  isFrozen(obj) {
    return Object.isFrozen(obj)
  },

  /**
   * To Check it is an array or not
   * @param {Array} arr The Array to Check
   * @return {Boolean} The result
   */
  isArray(arr) {
    return typeof(arr) === 'object' && (arr.length === 0 || arr.length > 0)
  },

  isString(str) {
    return typeof(str) === 'string'
  },

  isFunction(func) {
    return typeof(func) === 'function'
  },

  howLong(name, func) {
    console.time(name);
    func()
    console.timeEnd(name);
  },

}

window.utils = utils
