# Übersicht

Dieses Projekt ist ein Beispielprojekt für ein node-module unter Verwendung von:

* Typescript
* Jasmine
* gulp
* typedoc
* tslint
* editorconfig
* winston
* visual studio code


# Vorbereitung

- Visual Studio Code installieren
- nodejs und npm installieren

Einen Ordner für das Projekt anlegen. Dieser sollte keine Leerzeichen enthalten,
da sonst der Name des Node Moduls angepasst werden muss.
In diesem Ordner werden ein Ordner mit dem Namen src und ein Ordner mit dem Namen test angelegt.

# Typescript Projekt anlegen

Zunächst muss Typescript installiert werden. Dies geht mit folgendem Befehl:


```
- npm install -g typescript

```

Als erstes wird ein leeres Typescript Projekt angelegt. Dazu muss folgender Befehl im Projektordner ausgeführt werden:


```
- tsc --init

```

Jetzt wurde automatisch die Datei tsconfig.json erstellt. Diese enthält die Konfiguration für den Typescript Transpiler.

Dort werden folgende Konfigurationen vorgenommen:


```javascript
{
  "compilerOptions": {
  
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    "outDir": "./dist",                        /* Redirect output structure to the directory. */
    "strict": true,                      /* Enable all strict type-checking options. */
    "sourceMap": true,                 //generiert map Datei zum Debugging
    "inlineSources": true,
    "target": "es2015",
    "types": [
      "jasmine"
    ],
  
  "noEmitOnError": true, //Kein kompilieren bei Fehlern Nicht nach Erstellung vorhande?
  "noImplicitAny": true, //Es wird nicht automatisch any gewählt, falls kein Typ angegeben ist
  "strictNullChecks": true, //Fehler wenn null Variablen verwendet werden
  "noUnusedParameters": false //Fehler bei nicht genutzten Parametern
 
  }
}

```

Damit werden landen die erzeugten Javascript Dateien im Ordner dist.

# node Modul initialisieren


Um das Projekt als node Modul bauen zu können, muss es zuerst initialisiert werden.
Im Projektverzeichnis npm init ausführen. Nach Beantwortung der Fragen, wird die Datei package.json erstellt.
Als entrypoint wird dist/src/index.js angegeben und als test command jasmine, das im nächsten Schritt konfiguriert wird.
Zusätzlich werden die types für typescript mit angegeben.
Diese enthält die Konfiguration für das Projekt und sollte ungefähr so aussehen:


```javascript
{
  "name": "solarcar_datenkomprimierung",
  "version": "0.0.1",
  "description": "",
  "main": "dist/src/index.js",
  "types" : "dist/src/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jasmine"
  },
  "author": "",
  "license": "ISC"
}

```

Zusätzlich wird eine Datei mit dem Namen .npmignore angelegt die folgenden Inhalt besitzt:


```
src/

```

Dadurch wird der Typescript Code ignoriert und nur der transpilierte Javascript Code in das npm Mopdul übernommen.


# jasmine

- npm install --save-dev jasmine
- npm install --save @types/jasmine 
- ./node_modules/.bin/jasmine init 

Nach dem ausführen von jasmine init wird die Konfigurationsdatei jasmine.json im Ordner spec angelegt.
Hier muss der Pfad, in dem die Tests liegen noch angepasst werden, so dass die zu Javascript transpilierten Tests aus /dist/test ausgeführt werden:


```javascript
{
  "spec_dir": "dist/test",
  "spec_files": [
    "*[sS]pec.js"
  ],
  "helpers": [
    "helpers/**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}

```


Quelle: https://jasmine.github.io/pages/getting_started.html






## Debugger konfigurieren

Um die Jasmine Tests in Visula Studio Code debuggen zu können, muss der Debugger über die Datei launch.json konfiguriert werden.
Diese kann in Visual Studio Code in der Debug Ansicht mit der Option Add Configuration im Dropdown Menü oben links erzeugt werden.
Dabei kann erstmal nodejs als Konfiguration gewählt werden. Diese Konfiguration wird dann wie folgt angepasst um jasmine Tests starten und debuggen zu können:


```javascript
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Tests",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/node_modules/jasmine/bin/jasmine",
            "stopOnEntry": false,
            "cwd": "${workspaceRoot}",
            "sourceMaps": true,
            "outFiles": ["${workspaceRoot}/dist"]
        }
    ]
}

```


# gulp

Gulp ist ein Tool um definierte Task auszuführen und kann über npm installiert werden:


```
npm install -g gulp-cli
npm install gulp -D

```

Danach muss im Projektordner eine Datei mit dem Namen gulpfile.js angelegt werden.
Dort lassen sich Tasks definieren

Quelle: http://www.typescriptlang.org/docs/handbook/gulp.html


# typedoc

Typedoc ermöglicht die automatische Generierung von Dokumentation anhand von Kommentaren im Quellcode.
Installiert wird es mit:


```
npm install typedoc

```


## gulp task für Typedoc

Um die Dokumentation zu generiern, kann ein gulp task angelegt werden. Dazu muss zunächst das gulp Plugin für Typedoc installiert werden:


```
npm install --save-dev gulp-typedoc

```


Anschließend kann der Task im gulpfile.js hinzugefügt werden.


```javascript
var gulp = require('gulp'); 
var typedoc = require("gulp-typedoc");
gulp.task("typedoc", function() {
    return gulp
        .src(["*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "My project title"
        }))
    ;
});

```


Dieser Task läst sich dann mit dem Befehl: gulp typedoc ausführen.
Die erstellte Dokumentation landet dann im Ordner docs im Projektverzeichnis

Quelle: http://typedoc.org/guides/installation/




# winston


```
npm install winston@2.3.0
npm install --save @types/winston

```


Achtung für die neueste Version von winston gibt es noch keine Typdefintionen daher wird Version 2.3.0 verwendet

## Loggerinstanz anlegen:

Zur Nutzung von Winston wird empfohlen eine eigene Instanz des Loggers anzulegen. Dazuz wird eine Neue Datei Logger.ts mit folgendem Inhalt im src-Ordner angelegt:



```typescript
import {Logger, LoggerInstance, LoggerOptions, transports} from "winston";

export const log: LoggerInstance = new (Logger)(
    {
        level: "info",
        transports: [
            new transports.Console({
                colorize: true,
            }),
           // new (winston.transports.File)({ filename: "module.log" }),
        ],
    },
);

```

## Logger verwenden
Der Logger kann nun in anderen Dateien wie folgt verwendet werden:


```typescript
import {log} from "./Logger";

log.debug("This is a debug log");

```


Quelle: https://github.com/winstonjs/winston

# tslint

- npm install tslint
- tslint Plugin in Visual Studio Code installieren
- tslint --init im Projektordner aufrufen

Warnungen werden jetzt automatisch in Visual Studio Code angezeigt.
Verwendet werden dabei die Standardregeln von tslint. Diese lassen sich in der Datei tslint.json anpassen.

Alternativ kann tslint auch manuell oder als gulp Task ausgeführt werden.

Quelle: https://palantir.github.io/tslint/usage/cli/


# editorconfig

editorconfig plugin in vsc installieren
.editorconfig Datei im Projektverzeichnis anlegen (https://github.com/Microsoft/TypeScript/blob/master/.editorconfig)
Pfade in .editorconfig anpassen

Die Datei sollte dann folgenden Inhalt haben:


```
root = true

[{src,test}/**.{ts,json,js}]
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 4
```


# npm plugin:
npm plugin in vcs installieren
jetzt werden die Einträge in der package.json Datei automatisch geprüft

# code-runner plugin:
Plugin in vcs installieren
npm install -g ts-node
code der gerade geöfnneten Datei kann mit play Button oben rechts im Editor ausgeführt werden