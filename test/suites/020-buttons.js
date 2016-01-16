describe('Buttons', function () {
    this.bail(true);
    this.timeout(10 * 1000);

    it('Click "Simple" button', function (done) {
        extJsTT.button('Simple').isEnabled().click(done);
    });

    it('Click "Disable" button and wait state changed to "enabled"', function (done) {
        extJsTT.button('Disable').click().isDisabled().isEnabled(done);
    });

});
