describe('Buttons', function () {
    this.bail(true);
    this.timeout(10 * 1000);

    it('Switch ot "Buttons" tab', function (done) {
        eTT.tab('Buttons').click(done);
    });

    it('Click "Simple" button', function (done) {
        eTT.button('Simple').isEnabled().click(done);
    });

    it('Click "Disable" button and wait state changed to "enabled"', function (done) {
        eTT.button('Disable').click().isDisabled().isEnabled(done);
    });

});
