#!/usr/bin/env node

import fs from 'fs';
import stdin from 'get-stdin';
import meow from 'meow';
import JSON5 from 'json5';

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
  importMeta: import.meta,
  flags: {
    help: {
      type: 'boolean',
      shortFlag: 'h',
    },
    version: {
      type: 'boolean',
      shortFlag: 'v',
    },
    indent: {
      type: 'number',
      shortFlag: 'i',
      default: 2,
    },
    format: {
      type: 'string',
      shortFlag: 'f',
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
      ? replacer(key, JSON5.parse(val))
      : val;
  } catch (err) {
    return val;
  }
};

const parseFromFile = async ({ file = '' }) => {
  const raw = await fs.readFileSync(file, 'utf8');
  return JSON5.parse(JSON5.stringify(raw, replacer));
};

if(process.stdin.isTTY) {
  if(!filePath) {
    cli.showHelp();
    process.exit(1);
  }
  parseFromFile({ file: filePath })
    .then(data => {
      if(flags.format === 'json5') {
        console.log(JSON5.stringify(data, {
          replacer,
          space: flags.indent,
        }));
        process.exit(0);
      }
      if(flags.format === 'json') {
        console.log(JSON.stringify(data, replacer, flags.indent));
        process.exit(0);
      }
      console.dir(data, { depth: null });
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  stdin()
    .then(str => {
      if(flags.format === 'json5') {
        console.log(JSON5.stringify(str, {
          replacer,
          space: flags.indent,
        }));
        process.exit(0);
      }
      if(flags.format === 'json') {
        console.log(JSON.stringify(str, replacer, flags.indent));
        process.exit(0);
      }
      console.dir(JSON5.parse(JSON5.stringify(str, replacer)), { depth: null });
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
