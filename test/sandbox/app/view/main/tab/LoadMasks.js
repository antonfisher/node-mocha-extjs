Ext.define('Sandbox.view.main.tab.LoadMasks', {
  extend: 'Ext.panel.Panel',
  xtype: 'tabLoadMasks',

  requires: [
    'Sandbox.view.main.SuitePanel'
  ],

  title: 'LoadMasks',

  items: [{
    xtype: 'suitePanel',
    suiteCode: [
      'eTT().button(\'Show component\').click(done)',
      'eTT().waitLoadMask(done)'
    ],
    suiteItems: {
      xtype: 'button',
      text: 'Show global',
      handler: 'onLoadMasksShowGlobalButtonClick'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: [
      'eTT().button(\'Show global\').click(done)',
      'eTT().waitLoadMask(done)'
    ],
    suiteItems: {
      xtype: 'button',
      text: 'Show component',
      handler: 'onLoadMasksShowComponentButtonClick'
    }
  }]
})
