# Projects

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
ng build --prod --base-href "https://harveyj7.github.io/projects-angular/"
ng build --base-href "https://harveyj7.github.io/projects-angular/"
ng build --configuration=production --base-href=/projects-angular/ --output-path docs


https://harveyj7.github.io/projects-angular/
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Postgres CMD initiation-

cd "C:\Program Files\PostgreSQL\17\bin"
initdb -D "C:\Users\harve\pgdata"
pg_ctl -D ^"C^:^\Users^\harve^\pgdata^" -l logfile start

"C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D "C:\Users\harve\pgdata" -l "C:\Users\harve\pglog.txt" start
"C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D "C:\Users\harve\pgdata" status
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U harve -d postgres
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres

BUILD & DEPLOY-
ng build --configuration production --base-href=/projects-angular/
Switch to <base href="/projects-angular/" />
npx angular-cli-ghpages --dir=dist/projects/browser --no-silent

ng deploy --base-href=/projects-angular/
