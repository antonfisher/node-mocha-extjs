describe('Fields', function () {
  this.bail(true)
  this.timeout(20 * 1000)

  it('Switch ot "Fields" tab', function (done) {
    eTT().tab('Fields').click(done)
  })

  it('Fill "Text" filed', function (done) {
    eTT().textField('Name').fill('my text', done)
  })

  it('Fill "Number" filed', function (done) {
    eTT().numberField('Count').fill(13, done)
  })

  it('Click on checkbox "include"', function (done) {
    eTT().checkBox('include').click(done)
  })

  it('Click on radio "check B"', function (done) {
    eTT().radio('check B').click(done)
  })

  it('Click on radio "check A"', function (done) {
    eTT().radio('check A').click(done)
  })

  it('Click on combobox "Select in list"', function (done) {
    eTT().comboBox('Select in list').select(1, done)
  })
})
