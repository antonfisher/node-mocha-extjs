describe('Windows', function () {
    this.bail(true);
    this.timeout(20 * 1000);

    it('Switch ot "Windows" tab', function (done) {
        extJsTT.tab('Windows').click(done);
    });

    it('Click "Show confirm" button', function (done) {
        extJsTT.button('Show confirm').click(done);
    });

    it('window "Confirm" should be presented', function (done) {
        extJsTT.window('Confirm', done);
    });

    it('click on "Yes" button in "Confirm" window', function (done) {
        extJsTT.window('Confirm').button('Yes').isEnabled().click(done);
    });

    //it('window "Confirm" should be presented', function (done) {
    //    extJsTT.noWindow('Confirm', done);
    //});

    after(function () {
        setTimeout(function () {
            document.location.href = document.location.href;
        }, 1000);
    });

});
