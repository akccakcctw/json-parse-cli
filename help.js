// document format follow http:docopt.org
module.exports = `
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
`;
