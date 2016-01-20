describe('Content', function () {
    this.bail(true);
    this.timeout(20 * 1000);

    it('Switch ot "Contents" tab', function (done) {
        eTT.tab('Content').click(done);
    });

    it('Click on "Show result" button', function (done) {
        eTT.button('Show result').click(done);
    });

    it('Text "Result is here!" should appears in 1s', function (done) {
        eTT.waitText('Result is here!', done);
    });

});
