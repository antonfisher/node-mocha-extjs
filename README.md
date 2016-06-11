# mocha-extjs

[![build](https://travis-ci.org/antonfisher/node-mocha-extjs.svg?branch=master)](https://travis-ci.org/antonfisher/node-mocha-extjs)
[![npm](https://img.shields.io/npm/dt/mocha-extjs.svg?maxAge=86400)](https://www.npmjs.com/package/mocha-extjs)
[![bitHound Overall Score](https://www.bithound.io/github/antonfisher/node-mocha-extjs/badges/score.svg)](https://www.bithound.io/github/antonfisher/node-mocha-extjs)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
![status](https://img.shields.io/badge/status-alpha-lightgray.svg)

Framework for testing ExtJs applications which simulates user actions.

[Online demo](http://antonfisher.com/demo/mocha-extjs/)

![Demo](https://raw.githubusercontent.com/antonfisher/node-mocha-extjs/docs/images/mocha-extjs-v1.gif)

Component search by _title_, _fieldLabel_, _reference_, _boxLabel_, _xtype_, _text_ properties:

```javascript
// click on button "Save"
eTT().button('Save').click(done);

// select first item in combobox with "Country" fieldLabel.
eTT().combobox('Country').select(1, done);
```

## Getting Started:

Update _index.html_:

```html
<body>
    ...

    <!-- mocha ui -->
    <div id="mocha"></div>

    <!-- mocha library -->
    <link href="http://cdn.rawgit.com/mochajs/mocha/2.3.0/mocha.css" rel="stylesheet"/>
    <script src="http://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"></script>
    <script src="http://cdn.rawgit.com/mochajs/mocha/2.3.0/mocha.js"></script>

    <!-- mocha-extjs library -->
    <link href="https://cdn.rawgit.com/antonfisher/node-mocha-extjs/master/dist/mocha-extjs.css" rel="stylesheet" />
    <script src="https://cdn.rawgit.com/antonfisher/node-mocha-extjs/master/dist/mocha-extjs.js"></script>

    <!-- setup mocha -->
    <script>
        mocha.setup('bdd');
    </script>

    <!-- first test suite -->
    <script src="https://cdn.rawgit.com/antonfisher/node-mocha-extjs/master/test/suites/010-environment.js"></script>

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

## PhantomJs

It works now, but some hack needed.
First of all you need _PhantonJs_ version 2 and `mocha-phantomjs` library.
After install `mocha-phantomjs` upgrade one of its dependency to latest version:

```bash
$ npm install mocha-phantomjs@4.0.2 mocha-phantomjs-core@2.0.1 phantomjs-prebuilt@2.1.7
$ rm -rf ./node_modules/mocha-phantomjs/node_modules/mocha-phantomjs-core

# check PhantonJs version, should be like:
$ ./node_modules/.bin/phantomjs --version
2.1.1
```

Run tests in console:

```bash
# http://localhost:3000 - application address
$ ./node_modules/.bin/mocha-phantomjs --timeout 15000 --path ./node_modules/.bin/phantomjs --setting disk-cache=false --view 1024x768 http://localhost:3000
```

Self library test with _PhantonJs_:

```bash
$ npm test
```

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
        |    |            |- dataview                           |
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
eTT().button('Simple button').isEnabled().click(done);
eTT().button('Hide me').click().isHidden(done);
eTT().tab('Windows').click(done);
eTT().window('Confirm').button('Yes').isEnabled().click(done);
eTT().no.window('Confirm', done);
eTT().textfield('Name').fill('my text', done);
eTT().numberfield('Count').fill(13, done);
eTT().checkbox('include').click(done);
eTT().radio('check B').click(done);
eTT().combobox('Select in list').select(1, done);
eTT().grid('Names').select(1, 1, done);
eTT().grid('Names').checkRowsCount(2, done);
eTT().grid('Cell editing').cellEditor(1, 0).select(0, done);
eTT().grid('Cell editing').cellEditor(0, 2).fill('test1', done);
eTT().grid('Cell editing').cellEditor(0, 3).click(done);
eTT().grid('customDataviewReference').select(1, done);
eTT().waitLoadMask(done);
eTT().waitText('Result is here!', done);
```

### Taking screenshots

```javascript
MochaExtJs.screenshot();
MochaExtJs.screenshot('./mypath/');
```

## Installation

- `$ npm install mocha-extjs`
- use files from `./dist` folder.

## Development

- install _NodeJs v5.10.1_ or newer
- clone repository `$ git clone https://github.com/antonfisher/node-mocha-extjs.git`
- copy _ExtJs v5_ or _v6_ framework to `./test/sandbox/ext` folder
- build _Sandbox_ application
```bash
$ cd ./node-mocha-extjs/test/sandbox
$ sencha app build 
```
- install dependencies `$ npm install`
- run _lint_: `$ npm run lint`
- run _gulp_: `$ npm start`.

## Contributing

Please take care to maintain the existing coding style, tests for any changed functionality.
`npm test` and `npm run lint` your code.
Push your changes without `./dist/mocha-extjs.*` files, to keep commits cleaner between library releases.

## Releases History

* 0.1.7 Move to _PhantomJs v2_, _ExtJs v6_, add _DataView_ support (thanks [@vadimpopa](https://github.com/antonfisher/node-mocha-extjs/pull/1))
* 0.1.6 _CellEditing_ plugin support in _PhantomJs_
* 0.1.5 Update click method, minor fixes
* 0.1.4 New grid cell editor methods
* 0.1.3 Fix previous release trouble
* 0.1.2 Update documentation
    * ES2015
    * standardjs
    * grid select rows and cells
* 0.1.1 Update documentation
* 0.1.0 Initial Alpha release

## ToDo

- [x] update Mocha UI style
- [ ] Migrate to WebPack
- [ ] Use sencha test env
- [ ] Self tests
- [ ] New components
- [ ] Documenation

## License

Copyright (c) 2016 Anton Fisher <a.fschr@gmail.com>

MIT License. Free use and change.
