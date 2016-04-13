describe('Windows', function () {
  this.bail(true)
  this.timeout(20 * 1000)

  it('Switch to "Windows" tab', function (done) {
    eTT().tab('Windows').click(done)
  })

  it('Click "Show confirm" button', function (done) {
    eTT().button('Show confirm').click(done)
  })

  it('window "Confirm" should be presented', function (done) {
    eTT().window('Confirm', done)
  })

  it('click on "Yes" button in "Confirm" window', function (done) {
    eTT().window('Confirm').button('Yes').isEnabled().click(done)
  })

  it('window "Confirm" should be hidden', function (done) {
    eTT().no.window('Confirm', done)
  })
})
