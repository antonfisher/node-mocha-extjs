Ext.define('Sandbox.view.main.Main', {
    extend: 'Ext.container.Container',

    requires: [
        'Sandbox.view.main.MainController',
        'Sandbox.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'fit'
    },

    items: {
        xtype: 'tabpanel',
        bodyPadding: 5,
        defaults: {
            xtype: 'container',
            layout: 'vbox',
            defaults: {
                xtype: 'button',
                margin: 5
            }
        },
        items: [{
            title: 'Buttons',
            items: [{
                text: 'Simple button',
                handler: 'onButtonsSimpleButtonClick'
            }, {
                text: 'Disable',
                handler: 'onButtonsDisableButtonClick'
            }]
        }, {
            title: 'Windows',
            items: [{
                text: 'Show confirm',
                handler: 'onWindowsShowConfirmButtonClick'
            }, {
                text: 'Yes'
            }]
        }, {
            title: 'Fields',
            items: []
        }, {
            title: 'Grids',
            items: []
        }, {
            title: 'Load mask',
            items: []
        }]
    }
});
