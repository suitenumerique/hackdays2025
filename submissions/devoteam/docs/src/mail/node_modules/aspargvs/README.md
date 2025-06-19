# aspargvs

![lint status badge](https://github.com/mxxii/aspargvs/workflows/lint/badge.svg)
![test status badge](https://github.com/mxxii/aspargvs/workflows/test/badge.svg)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/mxxii/aspargvs/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/aspargvs?logo=npm)](https://www.npmjs.com/package/aspargvs)

Parse argv as a json object.

Rather opinionated solution for when you need a CLI wrapper for a library package that accepts complex options object and you don't want to manually define and maintain CLI arguments mapping for all of that.

----


## Goals / features

- construct JSON of any complexity from CLI args

- unambiguous (don't accept some ways to write args that may have different interpretations)

- compact (provide ways to reduce redundancy for deeply nested structures)


## Non-goals / out-of-scope

- performance (it's CLI - it doesn't meant to be in the hot code path)

- full JSON in arg values (what's the point? go full json then. putting keys inside values doesn't seem idiomatic for console args and it can be error-prone - would require too much attention to proper escaping - can't just copy and paste json from elsewhere)

- explicit defaults (This intended to be a thin wrapper around a package with it's own defaults. Extra layer of defaults might be confusing. If you absolutely need it - you can merge the produced json with your default object in client code. There are also preset and file reading features for cases when multiple meaningful behaviors can be provided.)


## Changelog

Available here: [CHANGELOG.md](https://github.com/mxxii/aspargvs/blob/main/CHANGELOG.md)


## Install

```shell
> npm i aspargvs
```


## Usage example

```js
import { handleArgv } from 'aspargvs';

handleArgv({
  handlers: {
    json: businessLogic
  }
});

function businessLogic (optionsObject) {
  console.log('Business logic start.');
  console.log(JSON.stringify(optionsObject));
  console.log('Business logic end.');
}
```

Usage:

```shell
> node example.js --foo --bar.baz[] 3 4 5
Business logic start.
{"foo":true,"bar":{"baz":[3,4,5]}}
Business logic end.
```

Another example: [example/example.mjs](https://github.com/mxxii/aspargvs/blob/main/example/example.mjs)


## Documentation

### API

- [docs/index.md](https://github.com/mxxii/aspargvs/blob/main/docs/index.md)


### Command line arguments

```shell
> example [commands...] [keys and values...]
  ```


### Built-in commands

Commands are only available when required conditions are met (this means specific handler is provided in most cases).

| Command   | Alias | Argument       | Description
| --------- | ----- | -------------- | -----------
| `json`    | `-j`  | \<file_name>   | Merge given file contents with the parsed args object.
| `preset`  | `-p`  | \<preset_name> | Merge given preset into the parsed args object.
| `inspect` | `-i`  |                | Pretty print the parsed args object. Useful as a dry run to check how arguments are parsed.
| `unparse` | `-u`  |                | Print the parsed args object back as args string. Can be used to check what arguments produce the result equivalent to a given json file. Albeit it's pretty dumb at this point and can't use subkeys for example.
| `help`    | `-h`  |                | Print help message.
| `version` | `-v`  |                | Print version number.

Note: short aliases cannot be merged.


### Path syntax

| Syntax        | Interpretation
| ------------- | --------------
| `foo`         | An object property key
| `foo.bar`     | Nested object property keys
| `[0]`         | Array index (Note: the root object is not an array, only subkeys can start from an index)
| `foo.[0]`     | 0-th item inside `foo` array
| `foo.[0].bar` | `bar` property of an object that is a 0-th item inside `foo` array
| `foo[0]`      | The same as `foo.[0]`
| `foo.[_]`     | Next item in array, automatic index (value will be assigned to `foo[foo.length]`)


### Key syntax

| Syntax                       | Interpretation
| ---------------------------- | --------------
| `--<path>`                   | Bare key, assigned a `true` value
| `--!<path>`                  | Negation, assigned a `false` value
| `--<path>=<value>`           | Key with a value (see next table)
| `--<path>[] <value> <value>` | Array key followed by bare values (see next table)
| `--<path>{}`                 | Empty object (use subkeys or full paths to fill a non-empty object)
| `:<path>`                    | Subkey (all above is the same except `:` prefix, but the path is nested in the last defined object or array that is not in a subkey. Subkeys recursion is not allowed.)


### Value syntax

| Syntax          | Interpretation | Notes
| --------------- | -------------- | -----
| `null`          | `null`         |
| `true`          | `true`         |
| `false`         | `false`        |
| `1.23e+4`       | Number         |
| `[<value>,...]` | Array          | Spaces are not allowed. If you quote the whole arg then any inner spaces will become part of values
| `{}`            | Empty object   | Use separate args - full keys or subkeys to build a complex object
| `"null"`        | String         | Beware - Node.js strips unescaped double quotes
| `'true'`        | String         | Beware - some shells may strip unescaped quotes
| `` `false` ``   | String         | Beware - some shells may strip unescaped quotes
| `anything_else` | String         | Don't need quotes unless it is ambiguous


### Some examples

| Syntax                              | Interpretation                               |
| ----------------------------------- | -------------------------------------------- |
| `--foo.bar=1 --foo.baz=2 --foo.qux` | `{ foo: { bar: 1, baz: 2, qux: true } }`     |
| `--foo{} :bar=1 :baz=2 :qux`        | `{ foo: { bar: 1, baz: 2, qux: true } }`     |
| `--foo.bar{} :baz.qux[_]=null`      | `{ foo: { bar: { baz: { qux: [null] } } } }` |
| `--foo[0]=1 --foo[1]=2 --!foo[2]`   | `{ foo: [ 1, 2, false ] }`                   |
| `--foo[] 1 2 false`                 | `{ foo: [ 1, 2, false ] }`                   |
| `--foo[] :[_]=1 :[_]=2 :![_]`       | `{ foo: [ 1, 2, false ] }`                   |
| `--foo=[true] :![1] :[_][] :[_]{}`  | `{ foo: [ true, false, [], {} ] }`           |
| `--foo={} :bar{} :!baz`             | `{ foo: { bar: {}, baz: false } }`           |
| `--foo[] {} :bar {} :!baz`          | `{ foo: [ { bar: true }, { baz: false } ] }` |
| `--foo[] [0] :[_]=1 [] :[_]=[2,3]`  | `{ foo: [ [0, 1], [[2, 3]] ] }`              |


### Escape syntax

- Escape syntax characters inside keys and inside arrays with "`\`";
- Use quoted strings to escape syntax inside values;
- Escape quote symbol inside quoted string with "`\`".

| Syntax            | Interpretation       |
| ----------------- | -------------------- |
| `--foo\[0]=1`     | `{ 'foo[0]': 1 }`    |
| `--foo\.bar=1`    | `{ 'foo.bar': 1 }`   |
| `--foo\=1`        | `{ 'foo=1': true }`  |
| `--\!foo`         | `{ '!foo': true }`   |
| `--foo=[a\]]`     | `{ foo: [ 'a]' ] }`  |
| `--foo=[a\,b]`    | `{ foo: [ 'a,b' ] }` |
| `--foo=['a,b']`   | `{ foo: [ 'a,b' ] }` |
| `--foo='[a,b]'`   | `{ foo: '[a,b]' }`   |
| `--foo='true'`    | `{ foo: 'true' }`    |


### Shell specifics

#### Node.js universal

Double quote (`"`) characters are used to delimit arguments but removed before arguments get to the application. Therefore they can be placed anywhere to pass string values containing spaces.

But such bare double quotes can't help to escape something that can be taken as a grammar of this arg parser (such as "true" as a string). For that, string value has to be wrapped into escaped double quotes or different quotes.

#### PowerShell

PowerShell has special meaning for too many characters and also nontrivial escape rules.

- All possible quotes are intercepted by PowerShell.

    I find the simplest way is to use a pair of backtick characters (` `` `) to pass a single backtick.

    Escaped string would look like this: ``` ``true`` ```

    Backtick + single quote (`` `' ``) would also work to pass a single quote, but it is just not as easy to type.

- PowerShell has a special meaning for curly braces.

    Escape with backtick when defining an empty object: `` `{`} ``

#### Others

_I'm not using anything else daily and can't provide any specific advice. Feel free to share your experience and findings by opening an issue._


## Roadmap

Some things left for future updates:

- Explore the possibility to support for output object type/schema - to return object of that type and generate detailed help;
- `unparse` command - provide escaped strings ready for use in different shells;
- `unparse` command - avoid string quotes when not needed;
- Recursive subkeys with `::`, `:::`, etc prefixes;
- Explore the possibility to escape syntax inside values with `\` to reduce the need for quoted strings;
- ...


## Somewhat related packages

- <https://www.npmjs.com/package/minimist>
- <https://www.npmjs.com/package/minimist-json>
- <https://www.npmjs.com/package/arg-to-object>
- <https://www.npmjs.com/package/argv-to-object>
- <https://www.npmjs.com/package/node-argv-to-object>
- <https://www.npmjs.com/package/smargparser>
