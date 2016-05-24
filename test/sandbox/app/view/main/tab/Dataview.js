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
    title: 'customDataview with default itemCls',
    suiteWidth: 400,
    suiteCode: [
      'eTT().grid(\'customDataviewReference\').select(1, done)'
    ],
    suiteItems: {
      xtype: 'customDataview',
      reference: 'customDataviewReference'
    }
  }, {
    xtype: 'suitePanel',
    title: 'customDataview with itemCls = "name-item"',
    suiteWidth: 400,
    suiteCode: [
      'eTT().grid(\'customDataviewReference1\').select(0, done)'
    ],
    suiteItems: {
      xtype: 'customDataview',
      itemCls: 'name-item',
      reference: 'customDataviewReference1'
    }
  }]
})
