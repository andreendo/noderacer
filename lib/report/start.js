const app = require('./app');
// set some default folder to test
app.locals.__settings = {
    mainfolder: '/benchmarks/xlsx-extract/log/nodemodulesmochabinmochatesttestsjsgshouldreadallcolumnsandrows'
};

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});