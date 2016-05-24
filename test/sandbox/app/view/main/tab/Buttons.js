Ext.define('Sandbox.view.main.tab.Buttons', {
  extend: 'Ext.panel.Panel',
  xtype: 'tabButtons',

  requires: [
    'Sandbox.view.main.SuitePanel',
    'Sandbox.view.main.custom.Button'
  ],

  title: 'Buttons',

  items: [{
    xtype: 'suitePanel',
    suiteCode: 'eTT().button(\'Simple button\').isEnabled().click(done)',
    suiteItems: {
      text: 'Simple button',
      xtype: 'button',
      handler: 'onButtonsSimpleButtonClick'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: 'eTT().button(\'Disable\').click().isDisabled().isEnabled(done)',
    suiteItems: {
      text: 'Disable',
      xtype: 'button',
      handler: 'onButtonsDisableButtonClick'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: 'eTT().button(\'Button tooltip\').click().isDisabled(done)',
    suiteItems: {
      text: 'Select me by tooltip',
      xtype: 'button',
      tooltip: 'Button tooltip',
      handler: 'onButtonsSelectMeByTooltipButtonClick'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: 'eTT().button(\'customButton\').click().isDisabled(done)',
    suiteItems: {
      text: 'Select me by custom xtype',
      xtype: 'customButton',
      handler: 'onButtonsSelectMeByCustomXtypeButtonClick'
    }
  }]
})
