Ext.define('Sandbox.view.main.tab.Windows', {
  extend: 'Ext.panel.Panel',
  xtype: 'tabWindows',

  requires: [
    'Sandbox.view.main.SuitePanel'
  ],

  title: 'Windows',

  items: [{
    xtype: 'suitePanel',
    suiteCode: [
      'eTT().button(\'Show confirm\').click(done)',
      'eTT().window(\'Confirm\', done)',
      'eTT().window(\'Confirm\').button(\'Yes\').isEnabled().click(done)',
      'eTT().no.window(\'Confirm\', done)'
    ],
    suiteItems: {
      xtype: 'button',
      text: 'Show confirm',
      handler: 'onWindowsShowConfirmButtonClick'
    }
  }, {
    xtype: 'button',
    text: 'Yes'
  }]
})
