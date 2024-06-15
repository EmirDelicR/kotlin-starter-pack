# kotlin-starter-pack

# Docker compose starter pack with MySQL DB, Java/Kotlin API and React app

## documentation

[General](#general)

[Folder structure](#structure)

## general

#### Description

In this application you have two folders:

- api - Java/Kotlin
- app - React with vite
- db - MySQL

There is a README file in every folder for more description.

#### Run project

To start application follow steps:

1. Step

```console
sudo chmod -R 777 scripts
```

2. Step

```console
./scripts/run.sh
```

3. Step

Go to:

[Backend Api](http://0.0.0.0:3100/api/v1/)

[Frontend App](http://0.0.0.0:3000)

NOTE: port for backend is `3100` and frontend is `3000`

4. Step

To stop application open new terminal and navigate to application folder and run:

```console
./scripts/stop.sh
```

follow instructions.

## structure

#### api

```js
└── logs/    /** application logs */
└── postman/ /** postman collection for api */
└── scripts/ /** utils script to setup project, and create migrations and entity */
└── src/
    ├── controllers/
    │   │
    │   └── [controller name]/
    │       │
    │       ├── index.ts
    │       └── [controller name].controller.spec.ts/
    │
    ├── database/
    │       ├── entities/
    │       ├── migrations/
    │       └── data-source.ts
    │
    ├── middleware/
    │
    ├── routes/
    │
    ├── services/
    │   │
    │   └── [service name]/
    │       │
    │       ├── index.ts
    │       └── [service name].service.spec.ts/
    │
    ├── swagger/ /** Api documentation */
    │
    ├── types/ /** Reusable types */
    │
    ├── utils/ /** Utils functions */
    │
    └── app.ts
```

#### app

### Folder structure

```js
└── src/
    ├── constants
    │
    ├── features/
    │   │   # "feature" contains everything related to that feature
    │   └── task/
    │       │   # this is used to export the relevant modules aka the public API
    │       ├── taskStore
    │       │   │   # the public API of the store (exports the task store)
    │       │   ├── index.ts
    │       │   ├── taskApiSlice.ts
    │       │   └── taskStoreSlice.ts
    │       │
    │       ├── TaskMainComponent.module.scss
    │       ├── TaskMainComponent.test.tsx
    │       └── TaskMainComponent.tsx
    │
    ├── hooks/
    │   │  # "hook" contains all reusable hooks
    │   ├── __test__
    │   │   └── hookTest.ts
    │   └── hook.ts
    │
    ├── assets/
    │   │  # "assets" contains all svg images
    │   └── *.svg
    │
    ├── routes/
    │   │  # "routes" contains all project routes
    │   └── Routes.tsx
    |
    ├── store/
    │   │  # "store" contains all application store
    │   │  # the public API of the store (exports the main store)
    │   ├── index.ts
    |   |
    |   ├── services/
    |   |   |   # "store" setup with main url
    |   |   └── baseAPiSetup.ts
    |   |
    │   └── userSlice/
    |       | # "store slice" individual store slice
    │       │ # the public API of the store slice (exports the slice store)
    │       ├── index.ts
    │       │ # store slice with API calls
    │       ├── userApiSlice.ts
    │       │ # store slice with redux state and selectors
    │       ├── userStoreSlice.ts
    |       ├── userStoreSlice.test.ts
    │       └── interfaces.ts
    |
    ├── UI/
    │   ├── components/
    │   │   | # "components" contains elements that can be reused across application
    │   |   │ # the public API of the components (exports all components)
    │   │   ├── index.ts
    |   |   └── button/
    |   |       ├── Button.module.scss
    |   |       ├── Button.test.tsx
    |   |       └── Button.tsx
    |   |
    │   ├── elements/
    │   │   | # "elements" contains complex elements filled with multiple components
    │   |   │ # the public API of the components (exports all components)
    │   │   ├── index.ts
    |   |   └── navigation/
    |   |       ├── Navigation.module.scss
    |   |       ├── Navigation.test.tsx
    |   |       └── Navigation.tsx
    |   |
    |   └── pages/
    │       | # "pages" application pages
    |       └── home/
    |           ├── HomePage.module.scss
    |           └── HomePage.tsx
    |
    └── utils/ # application utils functions
```

### DB instruction

If something is running on port `3306` default one for mysql you can check with command:

```console
sudo netstat -nlp | grep 3306
```

You can kill that service with command:

```console
service mysql stop
```

You can add permissions to file or folder with this command:

```console
sudo chmod -R 777 api/scripts
```

Open MySQL shell and run:

```console
mysql -u root -p
```

Enter password: **_root123_**

Commands:

```console
show databases;
```

```console
USE db_name;
```

```console
SHOW TABLES;
```
