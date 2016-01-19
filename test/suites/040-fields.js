describe('Fields', function () {
    this.bail(true);
    this.timeout(20 * 1000);

    it('Switch ot "Fields" tab', function (done) {
        eTT.tab('Fields').click(done);
    });

    it('Fill "Text" filed', function (done) {
        eTT.textfield('Name').fill('my text', done);
    });

    it('Fill "Number" filed', function (done) {
        eTT.numberfield('Count').fill(13, done);
    });

});
