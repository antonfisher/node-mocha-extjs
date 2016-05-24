Ext.define('Sandbox.view.main.tab.Content', {
  extend: 'Ext.panel.Panel',
  xtype: 'tabContent',

  requires: [
    'Sandbox.view.main.SuitePanel'
  ],

  title: 'Content',

  items: [{
    xtype: 'suitePanel',
    suiteWidth: 280,
    suiteCode: [
      'eTT().button(\'Show result\').click(done)'
    ],
    suiteItems: [{
      xtype: 'button',
      text: 'Show result',
      handler: 'onTextsShowTextButtonClick'
    }, {
      xtype: 'displayfield',
      labelWidth: 145,
      fieldLabel: 'Wait new content here',
      bind: {
        value: '{buttonResultText}'
      }
    }]
  }, {
    xtype: 'suitePanel',
    suiteWidth: 280,
    suiteCode: [
      'eTT().button(\'Hide me\').click().isHidden(done)',
      'eTT().button(\'Hide me\').isVisible(done)'
    ],
    suiteItems: {
      xtype: 'button',
      text: 'Hide me',
      handler: 'onContentHideMeButtonClick'
    }
  }]
})
