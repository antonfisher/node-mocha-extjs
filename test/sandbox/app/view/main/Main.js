Ext.define('Sandbox.view.main.Main', {
  extend: 'Ext.container.Container',

  requires: [
    'Sandbox.view.main.MainController',
    'Sandbox.view.main.MainModel',
    'Sandbox.view.main.custom.Grid',
    'Sandbox.view.main.custom.Button'
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
        xtype: 'button',
        margin: 5
      }
    },
    items: [{
      title: 'Buttons',
      items: [{
        text: 'Simple button',
        handler: 'onButtonsSimpleButtonClick'
      }, {
        text: 'Disable',
        handler: 'onButtonsDisableButtonClick'
      }, {
        text: 'Select me by tooltip',
        tooltip: 'Button tooltip',
        handler: 'onButtonsSelectMeByTooltipButtonClick'
      }, {
        text: 'Select me by custom xtype',
        xtype: 'customButton',
        handler: 'onButtonsSelectMeByCustomXtypeButtonClick'
      }]
    }, {
      title: 'Windows',
      items: [{
        text: 'Show confirm',
        handler: 'onWindowsShowConfirmButtonClick'
      }, {
        text: 'Yes'
      }]
    }, {
      title: 'Fields',
      items: [{
        xtype: 'textfield',
        fieldLabel: 'Name'
      }, {
        xtype: 'numberfield',
        fieldLabel: 'Count'
      }, {
        xtype: 'checkbox',
        boxLabel: 'include'
      }, {
        xtype: 'radio',
        boxLabel: 'check A',
        name: 'checkMe',
        value: 'a'
      }, {
        xtype: 'radio',
        boxLabel: 'check B',
        name: 'checkMe',
        value: 'b'
      }, {
        xtype: 'combobox',
        fieldLabel: 'Select in list',
        editable: false,
        store: [
          ['a', 'Position A'],
          ['b', 'Position B']
        ]
      }]
    }, {
      title: 'Grids',
      items: [{
        xtype: 'customGrid',
        title: 'Names'
      }, {
        xtype: 'customGrid',
        reference: 'customGridReference'
      }, {
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
        }]
      }]
    }, {
      title: 'LoadMasks',
      items: [{
        text: 'Show global',
        handler: 'onLoadMasksShowGlobalButtonClick'
      }, {
        text: 'Show component',
        handler: 'onLoadMasksShowComponentButtonClick'
      }]
    }, {
      title: 'Content',
      items: [{
        text: 'Show result',
        handler: 'onTextsShowTextButtonClick'
      }, {
        xtype: 'displayfield',
        labelWidth: 145,
        fieldLabel: 'Wait new content here',
        bind: {
          value: '{buttonResultText}'
        }
      }, {
        text: 'Hide me',
        handler: 'onContentHideMeButtonClick'
      }]
    }]
  }
})
