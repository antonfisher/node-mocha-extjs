Ext.define('Sandbox.view.main.tab.Dataview', {
    extend: 'Ext.panel.Panel',
    xtype: 'tabDataview',

    requires: [
        'Sandbox.view.main.SuitePanel',
        'Sandbox.view.main.custom.Dataview'
    ],

    title: 'Dataview',

    items: [{
        xtype: 'suitePanel',
        suiteWidth: 400,
        suiteCode: [
            'eTT().grid(\'customDataviewReference\').select(1, done)'
        ],
        suiteItems: {
            xtype: 'customDataview',
            reference: 'customDataviewReference'
        }
    }]

})

