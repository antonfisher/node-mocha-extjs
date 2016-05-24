Ext.define('Sandbox.view.main.tab.Fields', {
  extend: 'Ext.panel.Panel',
  xtype: 'tabFields',

  requires: [
    'Sandbox.view.main.SuitePanel'
  ],

  title: 'Fields',

  items: [{
    xtype: 'suitePanel',
    suiteCode: 'eTT().textField(\'Name\').fill(\'my text\', done)',
    suiteItems: {
      xtype: 'textfield',
      fieldLabel: 'Name'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: 'eTT().numberField(\'Count\').fill(13, done)',
    suiteItems: {
      xtype: 'numberfield',
      fieldLabel: 'Count'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: 'eTT().checkBox(\'include\').click(done)',
    suiteItems: {
      xtype: 'checkbox',
      boxLabel: 'include'
    }
  }, {
    xtype: 'suitePanel',
    suiteCode: [
      'eTT().radio(\'check B\').click(done)',
      'eTT().radio(\'check A\').click(done)'
    ],
    suiteItems: [{
      xtype: 'radio',
      boxLabel: 'check A',
      name: 'checkMe',
      value: 'a'
    }, {
      xtype: 'radio',
      boxLabel: 'check B',
      name: 'checkMe',
      value: 'b'
    }]
  }, {
    xtype: 'suitePanel',
    suiteCode: 'eTT().comboBox(\'Select in list\').select(1, done)',
    suiteItems: {
      xtype: 'combobox',
      fieldLabel: 'Select in list',
      editable: false,
      store: [
        ['a', 'Position A'],
        ['b', 'Position B']
      ]
    }
  }]
})
