#!/usr/bin/env node

const fs = require('fs');
const stdin = require('get-stdin');
const meow = require('meow');
const help = require('./help');

const cli = meow(help, {
  flags: {
    help: {
      type: 'boolean',
      alias: 'h',
    },
    version: {
      type: 'boolean',
      alias: 'v',
    },
    indent: {
      type: 'number',
      alias: 'i',
      default: 2,
    },
    format: {
      type: 'string',
      alias: 'f',
      default: 'object',
    },
  },
});

const filePath = cli.input[0];
const { flags } = cli;

const replacer = (key, val) => {
  const regex = new RegExp('\\"');

  try {
    return (typeof val === 'string' && regex.test(val))
      ? replacer(key, JSON.parse(val))
      : val;
  } catch (err) {
    return val;
  }
};

const parseFromFile = async ({ file = '' }) => {
  const raw = await fs.readFileSync(file, 'utf8');
  return JSON.parse(JSON.stringify(raw, replacer));
};

if(process.stdin.isTTY) {
  if(!filePath) {
    cli.showHelp();
  }
  parseFromFile({ file: filePath })
    .then(data => {
      if(flags.format === 'json') {
        console.log(JSON.stringify(data, replacer, flags.indent));
        process.exit(0);
      }
      console.log(data);
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  stdin()
    .then(str => {
      if(flags.format === 'json') {
        console.log(JSON.stringify(str, replacer, flags.indent));
        process.exit(0);
      }
      console.log(JSON.parse(JSON.stringify(str, replacer)));
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
