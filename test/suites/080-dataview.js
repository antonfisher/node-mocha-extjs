describe('Dataview', function () {
    this.bail(true)
    this.timeout(20 * 1000)

    it('Switch to "Grids" tab', function (done) {
        eTT().tab('Dataview').click(done)
    })

    it('Click on second "customDataviewReference" grid row', function (done) {
        eTT().dataview('customDataviewReference').select(1, done)
    })
})

