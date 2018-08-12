export default class {
  constructor (props) {
    this.data = props.data
    this.copy = JSON.parse(JSON.stringify(props.data))
    this.fn = props.update || function () {}
    this.updateRunning = false
    this.__makeReactive()
  }

  // External use: Set data values
  set (data) {
    for (let prop in data) {
      if (data.hasOwnProperty(prop)) {
        this.data[prop] = Object.assign({}, this.data[prop], data[prop])
      }
    }
    this.__update()
    return Promise.resolve(this.data)
  }

  // The DOM update cycle
  __update (cb) {
    if (this.updateRunning) return
    this.updateRunning = true
    const updateFn = () => {
      this.updateRunning = false
      this.fn(this.data)
      if (typeof cb !== 'undefined') cb(this.data)
    }
    Promise.resolve().then(updateFn)
  }

  // The magic sauce, internal use only
  __makeReactive () {
    let value = null
    const descriptor = {
      set: (newValue) => {
        value = newValue
        this.__update()
      },
      get: () => { return value }
    }

    // Make properties reactive
    for (let prop in this.data) {
      if (this.data.hasOwnProperty(prop)) {
        Object.defineProperty(this.data, prop, descriptor)
      }
    }

    // Set the properties to their init value
    for (let prop in this.copy) {
      if (this.copy.hasOwnProperty(prop)) {
        this.data[prop] = this.copy[prop]
      }
    }
  }
}
