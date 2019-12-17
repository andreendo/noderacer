var fs = require('fs');

function main() {
    function useStatData() {}
    function performTask() {}
    function finalize() {
        console.log('Done. Finalizing.');
    }
    var doneTasks = 0;
    var entries = 0;

    function processFile(filePath) {
        entries++;
        fs.lstat(filePath, function stat(err, stats) { 
            console.log('stat ' + filePath);
            if (err) {
                entries--;
                return;
            }
            useStatData(stats);

            fs.readFile(filePath, function read(err, data) {
                console.log('read ' + filePath);
                performTask(data);
                doneTasks++;
                if (doneTasks === entries)
                    finalize();
            });
        });
    }

    //test case
    processFile('./package.json');   //existing
    processFile('./missing.txt');   //missing
    processFile('./empty.txt');   //empty
}

module.exports = { main }