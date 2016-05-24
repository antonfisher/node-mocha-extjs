Ext.define('Sandbox.view.main.tab.Grids', {
  extend: 'Ext.panel.Panel',
  xtype: 'tabGrids',

  requires: [
    'Sandbox.view.main.SuitePanel',
    'Sandbox.view.main.custom.Grid'
  ],

  title: 'Grids',

  items: [{
    xtype: 'suitePanel',
    suiteWidth: 400,
    suiteCode: [
      'eTT().grid(\'Names\').select(1, done)',
      'eTT().grid(\'Names\').select(0, done)',
      'eTT().grid(\'Names\').checkRowsCount(2, done)'
    ],
    suiteItems: {
      xtype: 'customGrid',
      title: 'Names'
    }
  }, {
    xtype: 'suitePanel',
    suiteWidth: 400,
    suiteCode: 'eTT().grid(\'customGridReference\').select(0, 0).select(0, 1).select(1, 1).select(1, 0, done)',
    suiteItems: {
      xtype: 'customGrid',
      reference: 'customGridReference'
    }
  }, {
    xtype: 'suitePanel',
    suiteWidth: 400,
    suiteCode: [
      'eTT().grid(\'Cell editing\').cellEditor(1, 0).select(0, done)',
      'eTT().grid(\'Cell editing\').cellEditor(0, 0).select(2, done)',
      'eTT().grid(\'Cell editing\').cellEditor(0, 2).fill(\'test1\', done)',
      'eTT().grid(\'Cell editing\').cellEditor(1, 2).fill(\'test2\', done)',
      'eTT().grid(\'Cell editing\').cellEditor(0, 3).click(done)',
      'eTT().grid(\'Cell editing\').cellEditor(1, 3).click(done)'
    ],
    suiteItems: {
      title: 'Cell editing',
      xtype: 'customGrid',
      columns: [{
        header: 'Name',
        dataIndex: 'name',
        flex: 1,
        editor: {
          xtype: 'combobox',
          store: [['Aaa', 'Aaa'], ['Bbb', 'Bbb'], ['Ccc', 'Ccc']],
          editable: false
        }
      }, {
        header: 'Count',
        dataIndex: 'count'
      }, {
        header: 'Comment',
        dataIndex: 'comment',
        editor: {
          xtype: 'textfield'
        }
      }, {
        header: 'Enabled',
        dataIndex: 'enabled',
        editor: {
          xtype: 'checkbox'
        }
      }]
    }
  }]
})
