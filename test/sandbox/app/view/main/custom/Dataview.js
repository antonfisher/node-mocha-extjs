Ext.define('Sandbox.view.main.custom.Dataview', {
  extend: 'Ext.view.View',
  xtype: 'customDataview',

  width: 300,
  height: 150,
  border: true,
  itemTpl: '<div>{name}</div>',

  store: Ext.create('Ext.data.Store', {
    fields: ['name', 'count'],
    data: [{
      name: 'Jhon Lennon',
      count: 3
    }, {
      name: 'Bruce Lee',
      count: 5
    }]
  })
})
