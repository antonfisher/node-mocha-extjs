describe('Content', function () {
  this.bail(true)
  this.timeout(20 * 1000)

  it('Switch ot "Content" tab', function (done) {
    eTT().tab('Content').click(done)
  })

  it('Click on "Show result" button', function (done) {
    eTT().button('Show result').click(done)
  })

  it('Text "Result is here!" should appears in 1s', function (done) {
    eTT().waitText('Result is here!', done)
  })

  it('"Hide me" button should be hidden after click', function (done) {
    eTT().button('Hide me').click().isHidden(done)
  })

  it('"Hide me" button should be visible again', function (done) {
    eTT().button('Hide me').isVisible(done)
  })
})
