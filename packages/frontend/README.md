# Frontend

See the [Makefile](./Makefile) for the available command to build, check code standards, etc...

## Dependencies

These are needed at runtime (although Next will take care of bundling them for us):

- `react` & `react-dom` — reactive frontend library
- `next` — web framework around React, providing build tools, hot reload, routing & code splitting
- `viem` & `wagmi` — for communicating with blockchains' JSON-RPC nodes, querying chain state.
  `wagmi` handles the React integration.
  - `@tanstack/react-query` is a peer dependency — handling querying & caching logic (not web3 specific)
- `jotai` — for state management
- `connectkit` — for web3 wallet connection logic & UI (requires `wagmi`)
- `daisyui` — component library for tailwindcss
- `tslib` — runtime library for typescript, to avoid duplicating helper functions in each file

## Dev Dependencies

- `typescript` — typescript compilation support
- `eslint` — javascript linting tool
  - `eslint-config-next` —  eslint config for use with Next.js
  - `@typescript-eslint/parser` — parser enabling eslint to lint typescript files 
  - `@typescript-eslint/eslint-plugin` — typescript rules for eslint
- `tailwindcss` — a collection of css styles + a tool to generate CSS files that only include used styles,
   with peer dependencies `postcss` (CSS post-processing) and `autoprefixer` (postcss plugin that adds
   browser prefixes as needed (e.g. `-webkit-`))
- typescript type definitions, for the respective packages
  - `@types/eslint`
  - `@types/node`
  - `@types/react`
  - `@types/react-dom`

TODO
- explain tsconfig file
- add eslint configuration file + explain it
  - https://nextjs.org/docs/pages/building-your-application/configuring/eslint

- setup prettier (check PR)
- add next.js config file + explain it
- setup jotai + jotai-devtools (peer dep @emotion/react -- styling the UI devtool)

## Configuration Files

### `tsconfig.json`

Typescript configuration. Options are documented [here](https://www.typescriptlang.org/tsconfig).

- `target`: the Javascript version to compile to, using `es2022` as that is the most recent version
- `baseUrl`:  where to look for source files
- `paths`:  a set of path remappings/aliases
- `lib`:  standard JS libs to include, we want DOM access manipulation and built-in libraries
- `allowJs`: allow JS files to be imported
- `checkJs`: performs typescript checking (whenever possible) on JS files
- `skipLibCheck`: skip checking of type declaration files (.d.ts)
  - would be better to disable this (do the check) to avoid conflicting type definitions, but the
    build breaks with some library we use (at least wagmi)
- `strict`: enable a series of stricter checks
- `alwaysStrict`: emit Javascript `use strict` for every file
- `forceConsistentCasingInFileNames`: forces casing of imports to match file on disk
- `noEmit`: do not emit output (e.g. compiled) files (to let another tool do), just do checking
- `incremental`: support incremental compilation
- `importHelpers`: enable import of helper functions from tslib, to avoid duplicating them in each
  file, this requires `tslib` to be installed - `module`: module system to use in generated files —
  since we're web based, we use `esnext`, the latest version of the standard, and mandatory for use
  with Next.js
  - setting this to `esnext` also means `require` is not allowed in the code
- `moduleResolution`: how to resolve module imports, we use `node10`, which is required by Next.js —
  this only supports CommonJS `require`, but `import` can still be used, it is handled by the NextJS
  bundler
- `esModuleInterop`: enable compat with ES6 module spec, but also with non-conforming libraries
- `resolveJsonModule`: allow importing JSON files
- `isolatedModules`: makes tells TypeScript warn you if writing code that can't be interpreted by
  single-file transpilation processes (like some bundlers)
- `jsx`: set to `preserve` to emit `.jsx` file with the jsx syntax unchanged 
- `include`: files to include in the compilation
- `exclude`: files to exclude from the compilation

TODO:
- testing of actual code with the above options
- try to move everything to .mjs
- add type: "module" to package.json
  - yes: document
- one of the module or moduleResolution implies you can never write CJS type imports?
  - explain better above what you can / can't write (import/export vs require/module.exports)
- verify include / exclude necessity