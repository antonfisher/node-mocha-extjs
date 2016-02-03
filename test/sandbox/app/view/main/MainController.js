Ext.define('Sandbox.view.main.MainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.main',

  requires: [
    'Ext.window.MessageBox'
  ],

  // buttons

  onButtonsSimpleButtonClick: function (btn) {
    btn.setDisabled(true)
    btn.setText(btn.getText() + ' [done]')
  },

  onButtonsDisableButtonClick: function (btn) {
    btn.setDisabled(true)
    btn.setText('Wait for 1s..')
    setTimeout(function () {
      btn.setText(btn.getText() + ' [done]')
      btn.setDisabled(false)
    }, 1000)
  },

  onButtonsSelectMeByTooltipButtonClick: function (btn) {
    btn.setDisabled(true)
    btn.setText(btn.getText() + ' [done]')
  },

  onButtonsSelectMeByCustomXtypeButtonClick: function (btn) {
    btn.setDisabled(true)
    btn.setText(btn.getText() + ' [done]')
  },

  // windows

  onWindowsShowConfirmButtonClick: function (btn) {
    Ext.getBody().mask('Wait window...')
    setTimeout(function () {
      Ext.getBody().unmask()
      Ext.Msg.confirm('Confirm', 'Are you sure?', function () {
        btn.setText(btn.getText() + ' [done]')
      })
    }, 1000)
  },

  // loadMasks

  onLoadMasksShowGlobalButtonClick: function (btn) {
    Ext.getBody().mask('Wait load mask...')
    setTimeout(function () {
      Ext.getBody().unmask()
      btn.setText(btn.getText() + ' [done]')
    }, 1000)
  },

  onLoadMasksShowComponentButtonClick: function (btn) {
    var tab = btn.up('tabpanel')
    tab.setLoading('Wait setLoading load mask...')
    setTimeout(function () {
      tab.setLoading(false)
      btn.setText(btn.getText() + ' [done]')
    }, 1000)
  },

  // content

  onTextsShowTextButtonClick: function (btn) {
    var self = this
    Ext.getBody().mask('Wait for text appears...')
    btn.setText('Wait for text appears...')
    setTimeout(function () {
      Ext.getBody().unmask()
      self.getViewModel().set('buttonResultText', 'Result is here!')
      btn.setText(btn.getText() + ' [done]')
    }, 1000)
  },

  onContentHideMeButtonClick: function (btn) {
    Ext.getBody().mask('Hide button...')
    setTimeout(function () {
      btn.hide()
      Ext.getBody().mask('Show button...')
      setTimeout(function () {
        Ext.getBody().unmask()
        btn.show()
      }, 1000)
    }, 1000)
  }

})
