#!/usr/bin/env node

const logwrapper = require.resolve('../logger/logwrap.js');
const hbIdentifier = require('../hb/identifier');
const controller = require('../controller/controller');
const report = require('../report/report');
const suspicious = require('../suspicious/suspicious');

const foreground = require('foreground-child');
const sw = require('spawn-wrap');
const path = require('path');
const argv = require('yargs');
const sanitize = require('string-sanitizer').sanitize;

argv
    .usage('Usage: $0 <command> [options]')
    .command('log <testcommand>', 'run the test and log its trace (observation)', (yargs) => {
        return yargs.option('config', {
            alias: 'c',
            describe: 'path to the config file',
            nargs: 1
        });
    }, (argv) => {
        let originalCommand = process.argv.slice(3); //remove script call and command
        if (argv.config) {
            originalCommand.pop(); //remove the config args from the command
            originalCommand.pop();
        }
        sw([logwrapper], {
            LOG_FOLDER: buildLogFolderPath(originalCommand),
            COMMAND: originalCommand,
            CONFIGFILE: argv.config && path.resolve(argv.config)
        });
        foreground(originalCommand, (done) => {
            return done();
        });
    })

    .command('hb <pathtologfile>', 'identify happens-before relations', (yargs) => {
        return yargs
            .option('image', { alias: 'i' })
            .option('noglobal', { alias: 'ng' });
    }, (argv) => {
        hbIdentifier({
            file: argv.pathtologfile,
            image: argv.image || false,
            noglobal: argv.noglobal || false
        });
    })

    .command('control [options] <testcommand>', 'run tests with guided execution', (yargs) => {
        return yargs
            .option('strategy', {
                alias: 's',
                describe: 'define strategy for guided execution',
                nargs: 1,
                demand: true
            })
            .option('runs', {
                alias: 'r',
                describe: 'define number of runs',
                nargs: 1,
                demand: true
            })
            .option('hbfile', {
                alias: 'h',
                describe: 'define the happens-before file',
                nargs: 1,
                demand: true
            });
    }, (argv) => {
        let originalCommand = process.argv.slice(9);    //remove script call, command, and other options
        controller({
            strategy: argv.strategy,
            runs: argv.runs,
            file: argv.hbfile,
            command: originalCommand
        });
    })

    .command('report <pathtologfolder>', 'open a browser-based report', () => { }, (argv) => {
        report({ dirpath: path.resolve(argv.pathtologfolder) });
    })

    .command('susp <hbfile>', 'print suspicious metrics', (yargs) => {
        return yargs
            .option('metric', { alias: 'm' });
    }, (argv) => {
        suspicious(argv.hbfile, argv.metric || '');
    })

    .argv;

if (process.argv.length <= 2)
    argv.showHelp();

function buildLogFolderPath(command) {
    let specName = command.join('_').split('/').join('_').split('.').join('_');
    specName = sanitize(specName);

    if (specName.length > 100)
        specName = specName.substring(0, 20);

    return path.join(process.cwd(), 'log', specName);
}