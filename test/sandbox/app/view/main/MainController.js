Ext.define('Sandbox.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'Ext.window.MessageBox'
    ],


    // buttons

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


    // windows

    onWindowsShowConfirmButtonClick: function (btn) {
        Ext.getBody().mask('Wait window...');
        setTimeout(function () {
            Ext.getBody().unmask();
            Ext.Msg.confirm('Confirm', 'Are you sure?', function () {
                btn.setText(btn.getText() + ' [done]');
            });
        }, 1000);
    },


    // loadMasks

    onLoadMasksShowButtonClick: function (btn) {
        Ext.getBody().mask('Wait load mask...');
        setTimeout(function () {
            Ext.getBody().unmask();
            btn.setText(btn.getText() + ' [done]');
        }, 1000);
    }

});
