describe('Buttons', function () {
    this.timeout(10 * 1000);

    it('Click "Create" button > "No" button', function (done) {
        extJsTT.button('Create').isEnabled().click().button('No').isEnabled().click(done);
    });

    it('Click "Create" button > "Yes" button', function (done) {
        extJsTT.button('Create').isEnabled().click().button('Yes').isEnabled().click(done);
    });

    it('Click "Disable" button and wait state change to "enabled"', function (done) {
        extJsTT.button('Disable').click().isDisabled().isEnabled(done);
    });

});
