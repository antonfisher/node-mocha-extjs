describe('Dataview', function () {
  this.bail(true)
  this.timeout(20 * 1000)

  it('Switch to "Dataview" tab', function (done) {
    eTT().tab('Dataview').click(done)
  })

  it('Click on second "customDataviewReference" dataview item', function (done) {
    eTT().dataview('customDataviewReference').select(1, done)
  })

  it('Click on first "customDataviewReference1" dataview item with itemCls', function (done) {
    eTT().dataview('customDataviewReference1').select(0, done)
  })
})

