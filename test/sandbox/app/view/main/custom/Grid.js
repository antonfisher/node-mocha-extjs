Ext.define('Sandbox.view.main.custom.Grid', {
  extend: 'Ext.grid.Panel',
  xtype: 'customGrid',

  width: 300,
  height: 150,
  border: true,
  selModel: 'cellmodel',
  plugins: {
    ptype: 'cellediting',
    clicksToEdit: 1
  },

  columns: [{
    header: 'Name',
    dataIndex: 'name',
    flex: 1
  }, {
    header: 'Count',
    dataIndex: 'count'
  }],

  store: Ext.create('Ext.data.Store', {
    fields: ['name', 'count'],
    data: [{
      name: 'Aaa',
      count: 3
    }, {
      name: 'Bbb',
      count: 5
    }]
  })
})
