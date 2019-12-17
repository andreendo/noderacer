'use strict';
//prepare pre-conditions
const fs = require('fs')
fs.appendFileSync('tmp.txt', 'some text here')

require('./nodeAVfig01').ex01()