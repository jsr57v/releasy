# Releasy Architecture

## Componentes principales:

- ChangelogGenerator ( Generador de changelog basado en la info de GitScraper y ShortcutClient )
- ShortcutClient ( scrapper de la información de Shortcut)
- ConfluenceNotifier ( encargado de crear las notas de despliegue en Confluence )
- GithubReleaser ( encargado de crear la release en GitHub)
- Notifier ( orquestador de notificaciones a nivel Slack / Confluence )
- ReleaseNotesGenerator ( Generador de release notes )


## Flujo de ejecución:
 Al invocar a releasy con la opción "notify", releasy realizará los siguientes pasos:

 - Llamará a GitScraper para tener información del commit history desde el HEAD del repo hasta el último tag que se hubiera creado.
 - Al obtener la información de los commits que hay entre el HEAD y el último tag, llamará a ReleaseNotesGenerator, para que éste, filtre y obtenga las HUs correspondientes llamando a ShortcutClient.
 - Al obtener la lista, el método .generate generará un objeto con varias propiedades, entre ellas: el mensaje a enviar a Slack y la plantilla rellenada de Confluence.
 - Estos valores se envían a la clase Notifier y se notifica tanto en Slack como en Confluence, si procede.

 *Side note:* Estas plantillas están escritas en .ejs y se compilan en runtime.

## Generate Changelog

Para generar el changelog, se sigue el mismo proceso que para las notificaciones de Slack y Confluence, pero en este caso se compila un template de .ejs con los datos necesarios y se pushea a la rama **release** con un tag [ci skip] en el commit para evitar que se dispare otro flujo en el CI.

## Generate Release

Para generar la release en GitHub, se sigue el mismo proceso que para generar el Changelog.MD, pero en este caso las notas se publican en una release de Github mediante el uso del SDK "Octokit" de Github.


