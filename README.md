stsbroker
=========

CLI to configure and interact with your own AWS STS Broker.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/stsbroker.svg)](https://npmjs.org/package/stsbroker)
[![Downloads/week](https://img.shields.io/npm/dw/stsbroker.svg)](https://npmjs.org/package/stsbroker)
[![License](https://img.shields.io/npm/l/stsbroker.svg)](https://github.com/sts-broker-cli/stsbroker/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g stsbroker
$ stsbroker COMMAND
running command...
$ stsbroker (-v|--version|version)
stsbroker/0.0.0 darwin-x64 node-v13.8.0
$ stsbroker --help [COMMAND]
USAGE
  $ stsbroker COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`stsbroker configure`](#stsbroker-configure)
* [`stsbroker hello [FILE]`](#stsbroker-hello-file)
* [`stsbroker help [COMMAND]`](#stsbroker-help-command)
* [`stsbroker policies [FILE]`](#stsbroker-policies-file)

## `stsbroker configure`

Configure your STS Broker

```
USAGE
  $ stsbroker configure
```

_See code: [src/commands/configure.ts](https://github.com/sts-broker-cli/stsbroker/blob/v0.0.0/src/commands/configure.ts)_

## `stsbroker hello [FILE]`

describe the command here

```
USAGE
  $ stsbroker hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ stsbroker hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/sts-broker-cli/stsbroker/blob/v0.0.0/src/commands/hello.ts)_

## `stsbroker help [COMMAND]`

display help for stsbroker

```
USAGE
  $ stsbroker help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `stsbroker policies [FILE]`

describe the command here

```
USAGE
  $ stsbroker policies [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/policies.ts](https://github.com/sts-broker-cli/stsbroker/blob/v0.0.0/src/commands/policies.ts)_
<!-- commandsstop -->
