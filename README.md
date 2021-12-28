# Apz-release | Releasy

## ¿Cómo puedo añadir el envío de release notes a Slack de forma automática a mi repo?

Para que Releasy funcione correctamente, necesita que el histórico de commits tenga un formato predeterminado y que los contribuyentes al repositorio sigan la siguiente convención:
- A la hora de mergear un PR en la rama de desarrollo principal (master), quien mergee la HU deberá **mergear en modo "Squash&Merge"** y utilizar el siguiente **formato para el nombre del PR**: 
````
[(feat|fix|chore|hotfix)/${códigoHUenShortcut}] ${nombreDescriptivoDeLaRama}
````
Así, Releasy podrá parsear correctamente el histórico de nuevos PRs. Algunos ejemplos:
````
 - [feat/sc-22996] Major: Implementación de un microservicio de validación de TLD
 - [chore/sc-32793] Cambiar monthly_order_set_amount y newest_balance_date de Merchant 
 - [fix/sc-45848] A la hora de hacer un refund, el defaults_amount no debe contener penalizaciones 
````

Además de eso, deberemos configurar nuestro archivo .circleci/config.yml para que ejecute Releasy tras haber desplegado, **MUY IMPORTANTE, siempre tras haber desplegado, no antes.** Además, necesitaremos configurar Circle para que incluya un GITHUB_TOKEN con acceso de lectura al repo como variable de entorno.

Esto lo podemos hacer de la siguiente forma:
1. Añadimos un job con la siguiente estructura:
`````
manage_release:
        docker:
        - image: circleci/node:10

        steps:
        - checkout
        - add_ssh_keys
        - run:
            name: Configure Git
            command: |
                git config --global user.email "releasy@aplazame.com"
                git config --global user.name "Releasy"
                git config --global push.default current
                git config --global pull.default current

        - run: 
            name: Install releasy
            command: |
                npm i git+ssh://git@github.com/aplazame/releasy
                git checkout package.json 
                git checkout package-lock.json
        - run:
            name: Tag release - demo
            command: |
            
                export BUMP=$($(npm bin)/releasy get-bump)
                npm version $BUMP -m "Tag %s [ci skip]"
                git push --tags

        - run:
            name: Send slack and confluence notification 
            command: $(npm bin)/releasy notify --app=webapp-checkout 

        - run:
            name: Generate and push CHANGELOG.MD
            command: |
                git pull origin $CIRCLE_BRANCH
                $(npm bin)/releasy generate-changelog --app=webapp-checkout 
                git add CHANGELOG.MD
                git commit -m "Adding changelog [ci skip] "
                git push
        - run:
            name: Generate Github Release
            command: |
                git pull origin $CIRCLE_BRANCH 
                $(npm bin)/releasy github-release --app=webapp-checkout
          
          
`````
2. Añadimos el job al workflow de despliegue. E.g., en CircleCI sería así:
`````
  build_and_deploy:
    jobs:
    - manage_release:
        requires:
            - "⚠ PROD_S3"
`````
3. Añadimos las siguientes variables de entorno en CircleCI/Jenkins:
`````
CLUBHOUSE_WEB_TOKEN=5fe...575
CLUBHOUSE_APP_TOKEN=604...af3
SLACK_TOKEN=xox...SuK
CONFLUENCE_USERNAME=dev+dev@aplazame.com
CONFLUENCE_PASSWORD=dyO...3FE
CONFLUENCE_URL=https://aplazame.atlassian.net/wiki
GITHUB_TOKEN=26c...215e
`````
4. Añadimos la SSH key del usuario ```dev@aplazame.com``` al repo donde estemos metiendo Releasy.
5. Creamos una primera release en GitHUb si aún no está creada. 
   - Esta release se utilizará como referencia para ir nombrando las siguientes.
   - El tag de la release tiene que tener formato "vX.X.X", donde "X" será un número positivo entero. 
   - ¡¡OJO!! Para que releasy funcione correctamente, deberemos tener creadas al menos 2 TAGs en el repositorio.
6. Magic happens!
