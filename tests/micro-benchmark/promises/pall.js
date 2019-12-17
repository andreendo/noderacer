const c = require('../happensbeforechecker')()
c
  .verify('p1', 'pall')
  .verify('p2', 'pall')
  .verify('p3', 'pall')

module.exports = {
  ex01: function () {
    var promise1 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        c.notify('p1')
        resolve(3)
      }, 300);
    });
    var promise2 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        c.notify('p2')
        resolve(42)
      }, 200);
    });
    var promise3 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        c.notify('p3')
        resolve('foo')
      }, 100);
    });

    Promise.all([promise1, promise2, promise3]).then(function (values) {
      c.notify('pall')
      console.log(values);
    });
  }
}