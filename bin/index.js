#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yaml = require("yaml");
const fs = require("fs");

const createLogger = (argv) => function() {
    if(!argv.verbose) return;
    console.log.apply(this,Array.from(arguments));
};

console.log("+======================================+");
console.log("| Simple Stats Logger                  |");
console.log("| by Kevin Aird                        |");
console.log("+======================================+");
console.log("");

yargs(hideBin(process.argv))
  .command('start [config]', 'start collecting metrics based on config', (yargs) => {
    return yargs
      .positional('config', {
        describe: 'path to yml file defining configuration of what metrics to capture',
        default: 5000
      })
  }, (argv) => {

    
    try { 
        const log = createLogger(argv);
        
        log("loading config:",argv.config);
        const configString = fs.readFileSync(argv.config,'utf8');

        const parsedConfig = yaml.parse(configString);
        log("parsed config:",parsedConfig);

        require("../index")({ ...parsedConfig, ...argv, log });
    } catch(err) {
        console.error(err);
        process.exit(0);
    }

  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'where to output stats'
  })
  .demandCommand(1)
  .parse()