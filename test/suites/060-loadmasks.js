describe('LoadMasks', function () {
  this.bail(true)
  this.timeout(20 * 1000)

  it('Switch to "LoadMasks" tab', function (done) {
    eTT().tab('LoadMasks').click(done)
  })

  it('Click on "Show component" button', function (done) {
    eTT().button('Show component').click(done)
  })

  it('Load mask should disappear in 10s', function (done) {
    eTT().waitLoadMask(done)
  })

  it('Click on "Show global" button', function (done) {
    eTT().button('Show global').click(done)
  })

  it('Load mask should disappear in 10s', function (done) {
    eTT().waitLoadMask(done)
  })
})
