describe('Buttons', function () {
    this.bail(true);
    this.timeout(20 * 1000);

    it('Switch ot "Buttons" tab', function (done) {
        eTT().tab('Buttons').click(done);
    });

    it('Click "Simple button" button', function (done) {
        eTT().button('Simple button').isEnabled().click(done);
    });

    it('Click "Disable" button and wait state changed to "enabled"', function (done) {
        eTT().button('Disable').click().isDisabled().isEnabled(done);
    });

});
