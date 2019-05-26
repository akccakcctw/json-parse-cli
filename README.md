# json-parse-cli

![NPM-downloads](https://img.shields.io/npm/dt/json-parse-cli.svg)
![LICENSE](https://img.shields.io/github/license/akccakcctw/json-parse-cli.svg)

> Parse JSON string in your CLI

## Features

- support [JSON5](https://github.com/json5/json5)

## Install

```sh
$ npm install -g json-parse-cli
```

## Usage

Just type `json-parse -h` for detail usage.

```sh
$ json-parse --help

  Usage:
    $ json-parse [options] <path>

  Options:
    -h --help     Show this screen.
    -v --version  Show version.
    -i --indent   Indent length (only work with --format=json).
    -f --format   Format, object|json|json5 [default: object].

  Examples:
    $ json-parse foo.log
    $ json-parse --format=json foo.log
    $ json-parse --format=json --indent=4 foo.log
    $ cat foo.log | json-parse -f json -i 4
    $ echo '{"name": "akccakcctw"}' | json-parse
```

## Issues

<https://github.com/akccakcctw/json-parse-cli/issues>

## License

MIT © [Rex Tsou](https://github.com/akccakcctw)
