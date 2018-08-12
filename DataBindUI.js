import DataBind from './DataBind.js'

export default class extends DataBind {
  constructor (props) {
    super(props)
    this.el = props.el
    this.eventDispatcher()
  }

  forEach (arr, callback, scope) {
    for (let i = 0; i < arr.length; i++) {
      callback.call(scope, arr[i], i)
    }
  }

  strToObj (key, value) {
    let object = {}
    let result = object
    let arr = key.split('.')
    for (let i = 0; i < arr.length - 1; i++) {
      object = object[arr[i]] = {}
    }
    object[arr[arr.length - 1]] = value
    return result
  }

  getDataValueFromAttr (obj, keys, curIndex = 0) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === keys[curIndex]) {
          if (typeof obj[key] === 'object') {
            return this.getDataValueFromAttr(obj[key], keys, curIndex + 1)
          } else {
            return obj[key]
          }
        }
      }
    }
  }

  getEls(el) {
    return document.querySelectorAll(el)
  }

  update () {
    super.update(() => {
      this.forEach(this.getEls(`${this.el} [data-bind]`), (el) => {
        el.textContent = this.getDataValueFromAttr(this.data, el.dataset.bind.split('.'))
      })

      this.forEach(this.getEls(`${this.el} [data-bind-html]`), (el) => {
        el.innerHTML = this.getDataValueFromAttr(this.data, el.dataset.bindHtml.split('.'))
      })

      this.forEach(this.getEls(`${this.el} [data-model], ${this.el} [data-model-change]`), (el) => {
        const modelType = el.dataset.model || el.dataset.modelChange
        el.value = this.getDataValueFromAttr(this.data, modelType.split('.'))
      })

      this.forEach(this.getEls(`${this.el} [data-if]`), (el) => {
        let value = ''
        if (el.dataset.if.indexOf('!') !== -1) {
          el.style.display = this.getDataValueFromAttr(this.data, el.dataset.if.replace('!', '').split('.')) ? 'none' : ''
        } else {
          el.style.display = this.getDataValueFromAttr(this.data, el.dataset.if.split('.')) ? '' : 'none'
        }
      })
    })
  }

  eventDispatcher () {
    const self = this
    const modelFn = function (event) {
      const key = this.dataset.model || this.dataset.modelChange
      const value = this.value
      let obj = self.strToObj(key, value)
      self.set(obj)
    }

    const toggleFn = function (event) {
      const key = this.dataset.toggle
      const value = self.getDataValueFromAttr(self.data, key.split('.'))
      let obj = self.strToObj(key, !value)
      self.set(obj)
    }

    this.forEach(this.getEls(`${this.el} [data-model]`), (el) => {
      el.addEventListener('keyup', modelFn)
    })

    this.forEach(this.getEls(`${this.el} [data-model-change]`), (el) => {
      el.addEventListener('change', modelFn)
    })

    this.forEach(this.getEls(`${this.el} [data-toggle]`), (el) => {
      el.addEventListener('click', toggleFn)
    })
  }
}
