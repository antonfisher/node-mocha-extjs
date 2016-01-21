describe('Grids', function () {
    this.bail(true);
    this.timeout(20 * 1000);

    it('Switch ot "Grids" tab', function (done) {
        eTT.tab('Grids').click(done);
    });

    it('Click on second "Names" grid row', function (done) {
        eTT.grid('Names').select(1, done);
    });

    it('Click on first "Names" grid row', function (done) {
        eTT.grid('Names').select(0, done);
    });

    it('Rows number should be equal 2', function (done) {
        eTT.grid('Names').checkRowsCount(2, done);
    });

});
