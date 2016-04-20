Ext.define('Sandbox.view.main.SuitePanel', {
  extend: 'Ext.panel.Panel',
  xtype: 'suitePanel',

  layout: 'hbox',
  minHeight: 40,

  initComponent: function () {
    var self = this

    if (Ext.isArray(self.suiteCode)) {
      self.suiteCode = self.suiteCode.join('\n')
    }

    self.suiteWidth = (self.suiteWidth || 250)

    self.items = [{
      width: self.suiteWidth,
      defaults: {
        width: (self.suiteWidth - 20),
        labelWidth: 80
      },
      items: self.suiteItems
    }, {
      html: '<pre style="margin: 5px 0;"><code>' + self.suiteCode + '</code></pre>',
      flex: 1
    }]

    self.callParent(arguments)
  }

})
