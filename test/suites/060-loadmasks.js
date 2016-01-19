describe('LoadMasks', function () {
    this.bail(true);
    this.timeout(20 * 1000);

    it('Switch ot "LoadMasks" tab', function (done) {
        eTT.tab('LoadMasks').click(done);
    });

    it('Click on "Show" button', function (done) {
        eTT.button('Show').click(done);
    });

    it('Load mask should disappear in 10s', function (done) {
        eTT.waitLoadMask(done);
    });

});
