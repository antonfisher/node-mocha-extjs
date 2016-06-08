'use strict'

import {Set} from './utils/set.js'
import {ChainActionItem} from './chain/actionItem.js'
import {ChainComponentItem} from './chain/componentItem.js'
import {ChainComponentActionItem} from './chain/componentActionItem.js'

export class Chain {

  constructor ({driver, itemsRunDelay = 50}) {
    this._itemsSet = new Set()

    this._chainRunned = false
    this._chainCallback = () => {
      throw new Error('Chain callback is not presented.')
    }

    this.driver = driver
    this.itemsRunDelay = itemsRunDelay
    this.no = {}

    // entrance actions

    for (let component of driver.supportedComponents) {
      this[component] = this.createActionFunction(component)
      this.no[component] = this.createActionFunction(component, true)
    }

    for (let action of driver.supportedComponentActions) {
      this[action] = this.createActionFunction(action)
    }

    for (let action of driver.supportedActions) {
      this[action] = this.createActionFunction(action)
    }

    return this
  }

  createActionFunction (actionType, invert) {
    return (...args) => {
      if (this._chainRunned) {
        throw new Error('Cannot add an action after the action which calls Mocha test callback.')
      }

      let actionArgs = []
      for (let arg of args) {
        if (typeof arg === 'function') {
          this._chainRunned = true
          this._chainCallback = arg
          break
        }
        actionArgs.push(arg)
      }

      const chainProperties = {
        type: actionType,
        chain: this,
        invert: invert,
        callArgs: actionArgs
      }

      if (this.driver.supportedComponents.includes(actionType)) {
        this._itemsSet.push(new ChainComponentItem(chainProperties))
      } else if (this.driver.supportedComponentActions.includes(actionType)) {
        this._itemsSet.push(new ChainComponentActionItem(chainProperties))
      } else if (this.driver.supportedActions.includes(actionType)) {
        this._itemsSet.push(new ChainActionItem(chainProperties))
      }

      if (this._chainRunned) {
        this.run()
      }

      return this
    }
  }

  run () {
    const itemsGenerator = this._itemsSet.items()

    const runNextAction = () => {
      const item = itemsGenerator.next()

      if (item.done) {
        return this._chainCallback(null)
      } else {
        return item.value.run((err) => {
          if (err) {
            return this._chainCallback(err)
          }

          setTimeout(() => {
            runNextAction()
          }, this.itemsRunDelay)
        })
      }
    }

    runNextAction()
  }

  get lastComponent () {
    for (let item of this._itemsSet.reversedItems()) {
      if (item.component) {
        return item.component
      }
    }

    return null
  }

}
