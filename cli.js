#!/usr/bin/env node

const fs = require('fs');
const stdin = require('get-stdin');
const meow = require('meow');

// document format follow http:docopt.org
const cli = meow(`
  Usage:
    $ json-parse [options] <path>

  Options:
    -h --help     Show this screen.
    -v --version  Show version.
    -i --indent   Indent length (only work with --format=json).
    -f --format   Format, either object or json [default: object].

  Examples:
    $ json-parse foo.log
    $ json-parse --format=json foo.log
    $ json-parse --format=json --indent=4 foo.log
    $ cat foo.log | json-parse -f json -i 4
    $ echo '{"name": "akccakcctw"}' | json-parse
`, {
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
