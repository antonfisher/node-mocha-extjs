Ext.define('Sandbox.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'Ext.window.MessageBox'
    ],

    // Buttons

    onButtonsSimpleButtonClick: function (btn) {
        btn.setDisabled(true);
        btn.setText(btn.getText() + ' [done]');
    },

    onButtonsDisableButtonClick: function (btn) {
        btn.setDisabled(true);
        btn.setText('Wait for 1s..');
        setTimeout(function () {
            btn.setText(btn.getText() + ' [done]');
            btn.setDisabled(false);
        }, 1000);
    },

    // Windows

    onWindowsShowConfirmButtonClick: function (btn) {
        Ext.getBody().mask('Wait window...');
        setTimeout(function () {
            Ext.getBody().unmask();
            Ext.Msg.confirm('Confirm', 'Are you sure?', function () {
                btn.setText(btn.getText() + ' [done]');
            });
        }, 1000);
    }

});
