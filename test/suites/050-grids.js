describe('Grids', function () {
  this.bail(true)
  this.timeout(20 * 1000)

  it('Switch ot "Grids" tab', function (done) {
    eTT().tab('Grids').click(done)
  })

  it('Click on second "Names" grid row', function (done) {
    eTT().grid('Names').select(1, done)
  })

  it('Click on first "Names" grid row', function (done) {
    eTT().grid('Names').select(0, done)
  })

  it('Rows number should be equal 2', function (done) {
    eTT().grid('Names').checkRowsCount(2, done)
  })

  it('Click on cells of second grid', function (done) {
    eTT().grid('customGridReference').select(0, 0).select(0, 1).select(1, 1).select(1, 0, done)
  })

  it('Edit "Cell editing" grid #2 row, select item #1', function (done) {
    eTT().grid('Cell editing').cellEditor(1, 0).select(0, done)
  })

  it('Edit "Cell editing" grid #1 row, select item #3', function (done) {
    eTT().grid('Cell editing').cellEditor(0, 0).select(2, done)
  })

  it('Edit "Cell editing" grid #1 row, fill column #3 with "test1"', function (done) {
    eTT().grid('Cell editing').cellEditor(0, 2).fill('test1', done)
  })

  it('Edit "Cell editing" grid #2 row, fill column #3 with "test2"', function (done) {
    eTT().grid('Cell editing').cellEditor(1, 2).fill('test2', done)
  })

  it('Edit "Cell editing" grid #1 row, check column #3', function (done) {
    eTT().grid('Cell editing').cellEditor(0, 3).click(done)
  })

  it('Edit "Cell editing" grid #2 row, check column #3', function (done) {
    eTT().grid('Cell editing').cellEditor(1, 3).click(done)
  })
})
