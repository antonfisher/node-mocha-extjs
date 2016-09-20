'use strict'

export function waitForFn (waitFn, callback,
  {delay, timeout, ticInterval} = {delay: 10, timeout: 10 * 1000, ticInterval: 500}) {
  const startTimestamp = +(new Date())
  let interval
  let lastError = ''
  let exectution = false

  const intervalFn = () => {
    if ((+new Date() - startTimestamp) > timeout) {
      exectution = false
      clearInterval(interval)
      return callback(`Out of time: ${timeout / 1000}s (${lastError})`)
    }

    if (!exectution) {
      try {
        exectution = true
        waitFn((err, result) => {
          if (!exectution) {
            console.warn('waitForFn(): Operation finished after time out.')
            return
          }
          exectution = false
          if (err) {
            lastError = err
          } else {
            clearInterval(interval)
            return callback(null, result)
          }
        })
      } catch (e) {
        exectution = false
        throw e
      }
    }
  }

  setTimeout(() => {
    interval = setInterval(intervalFn, ticInterval)
    intervalFn()
  }, delay)
}
