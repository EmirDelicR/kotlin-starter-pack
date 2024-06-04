## Starter pack with

- Vite
- React v18.2
- ES lint
- Prettier
- RTL -React testing library with Vitest
- Cypress
- Mantine

## documentation

[General](#general)

[Node upgrade](#node)

[SCSS](#scss)

[Path config](#path-config)

[Unit tests](#unit-tests)

[ES linting](#es-linting)

[Prettier](#prettier)

[Cypress](#cypress)

[Mantine](#mantine)

[Packages used in project](#packages)

[PWA](#pwa)

## general

#### React app with Vite

[Vite Documentation](https://vitejs.dev/guide/)

```code
npm create vite@latest my-react-app
```

Chose `react` and `typescript`.

#### Run project

_Install:_

```console
npm i
```

_Start project:_

```console
npm run dev
```

_Test project:_

```console
npm run test
```

_Lint project:_

```console
npm run lint
```

_Run with docker_

First, you need to add permissions to the folder:

```console
sudo chmod -R 777 scripts
```

To use docker you need to install docker on your machine and run:

```console
./scripts/start_docker.sh
```

To stop the container and (optional) remove the container and image run

```console
./scripts/stop_container.sh
```

If you want to omit sudo when calling the docker command use this command and restart your PC.

```console
sudo usermod -aG docker $USER
```

[Back to TOP](#documentation)

## node

#### Update Node to latest version

```console
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

#### Update packages to latest version

```console
npm outdated
npx npm-check-updates -u
```

#### Clear cache

```console
npm cache clean --force
npm cache verify
```

[Back to TOP](#documentation)

## scss

```code
npm i -D sass
```

Now change all `.css` files to `.scss` and start project.

[Back to TOP](#documentation)

## path-config

in `vite.config.ts` add:

```js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
```

in `tsconfig.json` add:

```js
{
  "compilerOptions": {
    ...,
    /* Path - this part here */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Reload VSCode -> press `Strg + P` and type `> rel` use `Developer: Reload Window`

[Back to TOP](#documentation)

## unit-tests

**_Jest and Vitest configuration_**

[RTL Documentation](https://testing-library.com/docs/react-testing-library/setup)

```code
npm i -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom vitest
```

Add `setupTests.ts` to root of the project! and in that file add

```js
import "@testing-library/jest-dom";
```

In `vite.config.ts` add:

```js
/// <reference types="vitest" />
export default defineConfig({
  ...,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    // ADD this to not hash classes
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  },
});
```

`/// <reference types="vitest" />` This part is only needed if you use TypeScript

In `tsconfig.json` add:

```js
{

  "compilerOptions": {
    ...
    /* Types */
    "types": [
      "vite/client",
      "vitest/globals",
      "node",
      "@testing-library/jest-dom"
    ]
  }
}
```

Add script to `package.json`:

```js
"scripts": {
  ...
  "test": "vitest",
  "coverage": "vitest run --coverage"
}
```

Create `[fileName].test.[tsx/ts]` and add:

```js
describe("Simple working test", () => {
  it("should ...", () => {
    expect(true).toEqual(true);
  });
});
```

Run test:

```console
npm run test
```

[Back to TOP](#documentation)

## es-linting

Ultimately, we will configure VSCode to use ESLint and Prettier to find problems and format our code, respectively. If you don't have the extensions installed yet, install them: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

If you used command:

```code
npm create vite@latest my-react-app
```

this will create file `.eslint.cjs` but you can change that to `.eslintrc` and use config.

You can use basic presets:

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "eslint-config-prettier"
  ],
  "ignorePatterns": ["dist", ".eslintrc"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "no-console": "off",
    "object-curly-newline": "off",
    "import/prefer-default-export": "off",
    "comma-dangle": ["error", "only-multiline"],
    "@typescript-eslint/no-non-null-assertion": "off"
  }
}
```

Or you can manually setup all by fallowing this links:

[Vite Plugins](https://vitejs.dev/guide/api-plugin.html#rollup-plugin-compatibility)

[Vite all Rollup Plugins](https://vite-rollup-plugins.patak.dev/)

[ES Article](https://sourcelevel.io/blog/how-to-setup-eslint-and-prettier-on-node)

```console
npx eslint --init
```

[Back to TOP](#documentation)

## prettier

Add prettier extension for VSCode and install in project:

```console
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

Go to VSCode setting search for Default Formatter and add **_ebsenp.prettier-vscode_**

Add `.prettierrc` file

```json
{
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "endOfLine": "auto",
  "importOrder": ["^@/components", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

Update `.eslintrc`:

```json
{
  "extends": [
    ...,
    // Add this part here
    "prettier"
  ],
  // Add this part here
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "rules": {
    ...,
    // Add this part here
    "prettier/prettier": "error",
  }
}
```

And you have project setup with `Vite`, `TypeScript`, `ESLint`, `Prettier` and `Vitest`.

[Back to TOP](#documentation)

## cypress

[Documentation](https://testing-library.com/docs/cypress-testing-library/intro/)

```code
npm install -D cypress @testing-library/cypress eslint-plugin-cypress
```

Add es lint config to `.eslintrc`

```json
{
  "env": {
    ...
    "cypress/globals": true
  },
}
```

Run:

```console
npx cypress open
```

Click on E2E and configure files for cypress. This will also create `cypress.config.ts` file.

In the `cypress.config.ts` file add:

```js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
```

Add script to `package.json`

```js
"scripts": {
  ...
  "cypress:open": "cypress open --e2e"
},
```

Run:

```console
npm run cypress:open
```

[Back to TOP](#documentation)

## mantine

UI Library

[Mantine](https://mantine.dev/theming/mantine-provider/)

[Back to TOP](#documentation)

## packages

_react-icons_

[React-icons](https://react-icons.github.io/react-icons/)

_tenStack Table_

['TenStack Table'](https://tanstack.com/table/v8/docs/guide/installation)

_react hook form_

['React hook form'](https://react-hook-form.com/)

#### Adding redux to project

```console
npm i @reduxjs/toolkit react-redux
```

#### Adding router to project

['React-router'](https://reactrouter.com/en/v6.3.0/getting-started/concepts)

```console
npm i react-router-dom
```

#### SVG-generator

[tablericons](https://tablericons.com/)

[Link-with-tools](https://www.smashingmagazine.com/2021/03/svg-generators/)

## pwa

[Vite PWA](https://vite-pwa-org.netlify.app/guide/register-service-worker.html)

[Official Git Repo](https://github.com/vite-pwa/vite-plugin-pwa)

// THIS IS OLD

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

// TODO

1. Add test config (DONE)
2. Add cypress config
3. Add docker
4. Add pages
5. Add router
6. Add Forms
7. Add RTKQ
