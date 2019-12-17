// Promises with multiple then callbacks
module.exports = {
    ex01: function () {
        let p = new Promise((resolve) => {
            setTimeout(function timeout() {
                resolve();
            }, 500);
        });

        p.then(function then1() {
            console.log('then 1');
        });

        p.then(function then2() {
            console.log('then 2');
        });

        /*for (let i = 1; i <= 2; i++) {
            p.then(() => {
                console.log('then ' + i);
            });
        }*/
    }
}  