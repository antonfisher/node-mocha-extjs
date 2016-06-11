Ext.define('Sandbox.view.main.Main', {
  extend: 'Ext.container.Container',

  requires: [
    'Ext.layout.container.VBox',
    'Ext.layout.container.HBox',
    'Sandbox.view.main.MainModel',
    'Sandbox.view.main.MainController',
    'Sandbox.view.main.tab.LoadMasks',
    'Sandbox.view.main.tab.Buttons',
    'Sandbox.view.main.tab.Windows',
    'Sandbox.view.main.tab.Content',
    'Sandbox.view.main.tab.Fields',
    'Sandbox.view.main.tab.Grids',
    'Sandbox.view.main.tab.Dataview'
  ],

  controller: 'main',
  viewModel: {
    type: 'main'
  },

  layout: {
    type: 'fit'
  },

  items: {
    xtype: 'tabpanel',
    bodyPadding: 5,
    defaults: {
      xtype: 'container',
      layout: 'vbox',
      defaults: {
        margin: 5
      }
    },
    items: [{
      xtype: 'tabButtons'
    }, {
      xtype: 'tabWindows'
    }, {
      xtype: 'tabFields'
    }, {
      xtype: 'tabGrids'
    }, {
      xtype: 'tabDataview'
    }, {
      xtype: 'tabLoadMasks'
    }, {
      xtype: 'tabContent'
    }]
  }
})
