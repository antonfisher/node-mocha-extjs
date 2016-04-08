# mocha-extjs

![Status](https://img.shields.io/badge/status-alpha-orange.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Framework for testing ExtJs applications which simulates user actions.

[Online demo](http://antonfisher.com/demo/mocha-extjs/)

![Demo](https://raw.githubusercontent.com/antonfisher/mocha-extjs/docs/images/mocha-extjs-v1.gif)

Component search by _title_, _fieldLabel_, _reference_, _boxLabel_, _xtype_, _text_ properties:

```javascript
// click on button "Save"
eTT().button('Save').click(done)

// select first item in combobox with "Country" fieldLabel.
eTT().combobox('Country').select(1, done)
```

## Getting Started:

Update _index.html_:

```html
<body>
    ...

    <!-- mocha ui -->
    <div id="mocha"></div>


    <!-- mocha library -->
    <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
    <script src="https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"></script>
    <script src="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js"></script>


    <!-- mocha-extjs library -->
    <link href="https://raw.githubusercontent.com/antonfisher/mocha-extjs/master/dist/mocha-extjs.css"
          rel="stylesheet" />
    <script src="https://raw.githubusercontent.com/antonfisher/mocha-extjs/master/dist/mocha-extjs.js"></script>


    <!-- first test suite -->
    <script src="https://raw.githubusercontent.com/antonfisher/mocha-extjs/master/test/suites/010-environment.js"></script>


    <!-- run script -->
    <script>
            mocha.checkLeaks();
            mocha.globals(['Ext', 'Sandbox']); // update name here!

            var eTT = new MochaExtJs(); // init testing framework

            window.onload = function () {
                setTimeout(function () {
                    mocha.run();
                }, 1000);
            };
        </script>
</body>
```
Done. Run your application!

## Jenkins

_Cooming soon, waiting for pull request in new release version of one dependency..._

## Usage

### Init library before running MochaJs

```javascript
var eTT = new MochaExtJs(); // init testing framework
```

### Add test suite:

```javascript
// tests/suites/020-buttons.js
describe('Buttons', function () {
    this.bail(true);         // exit on first test fails
    this.timeout(20 * 1000); // necessary timeout for ui operations

    it('Switch to "Buttons" tab', function (done) { // done - async tests callback
        eTT().tab('Buttons').click(done);
    });

    it('Click "Simple button" button', function (done) {
        eTT().button('Simple button').isEnabled().click(done);
    });
});
```

### Supported components and methods:

```
var eTT = new MochaExtJs();

eTT() -->--->|------->--->|- button ---> (|- '%title%'     )----.
        |    |       |    |- window       |- '%fieldLabel%'     |
        |    |- no --'    |- numberfield  |- '%reference%'      |
        |    |            |- textfield    |- '%boxLabel%'       |
        |    |            |- checkbox     |- '%xtype%'          |
        |    |            |- combobox     `- '%text%'           |
        |    |            |- radio                              |
        |    |            |- grid        .----------------------x----------------------.
        |    |            `- tab         |                                             |
        |    |                           |-->|- click -------> (...) ------------------v
        |    |                           |   |- isEnabled                              |
        |    |- waitLoadMask() ------.   |   |- isDisabled                             |
        |    |                       |   |   |- isHidden                               |
        |    `- waitText('%text%')---v   |   |- isVisible                              |
        |                            |   |   |- select                                 |
        |                            |   |   |- checkRowsCount                         |
        |                            |   |   |- edit                                   |
        |                            |   |   `- fill                                   |
        |                            |   |                                             |
        |                            |   `--> cellEditor() --->|- select ---> (...) ---v
        |                            |                         |- click                |
        |                            |                         `- fill                 |
        |                            |                                                 |
        x----------------------------<-------------------------------------------------'
        |
        |
        `--> done.
```

Examples:

```javascript
eTT().button('Simple button').isEnabled().click(done)
eTT().button('Hide me').click().isHidden(done)
eTT().tab('Windows').click(done)
eTT().window('Confirm').button('Yes').isEnabled().click(done)
eTT().no.window('Confirm', done)
eTT().textfield('Name').fill('my text', done)
eTT().numberfield('Count').fill(13, done)
eTT().checkbox('include').click(done)
eTT().radio('check B').click(done)
eTT().combobox('Select in list').select(1, done)
eTT().grid('Names').select(1, 1, done)
eTT().grid('Names').checkRowsCount(2, done)
eTT().grid('Cell editing').cellEditor(1, 0).select(0, done)
eTT().grid('Cell editing').cellEditor(0, 2).fill('test1', done)
eTT().grid('Cell editing').cellEditor(0, 3).click(done)
eTT().waitLoadMask(done)
eTT().waitText('Result is here!', done)
```

## Installation

- `$ npm install mocha-extjs`
- use files from `./dist` folder.

## Development

- install _NodeJs v5.3_ or newer
- clone repository `$ git clone git@github.com:antonfisher/mocha-extjs.git`
- copy _ExtJs v5_ or _v6_ framework to `./test/Sandbox/ext` folder
- build _Sandbox_ application
```bash
$ cd ./mocha-extjs/test/Sandbox
$ sencha app build 
```
- install dependencies `$ npm install`
- run _lint_: `$ npm run lint`
- run _gulp_: `$ npm run build`.

## Contributing

Please take care to maintain the existing coding style, unit tests for any changed functionality.
Eslint and test your code.

## Releases History

* 0.1.4 New grid cell editor methods
* 0.1.3 Fix previous release trouble
* 0.1.2 Update documentation
    * ES2015
    * standardjs
    * grid select rows and cells
* 0.1.1 Update documentation
* 0.1.0 Initial Alpha release

## ToDo

- [x] ES2015
- [x] StandardJs
- [x] Grid Cell Editing
- [ ] Self tests
- [ ] New components
- [ ] Documenation

## License

Copyright (c) 2016 Anton Fisher <a.fschr@gmail.com>

MIT License. Free use and change.
