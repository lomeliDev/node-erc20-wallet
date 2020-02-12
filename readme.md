# erc20-wallet

[![N|Solid](https://lomeli.io/assets/img/logo.png)](https://lomeli.io)



## Introducción
Es el api rest para envio de notificaciones de transacciones entrantes de eth y tokens.

## Instalación y configuración

Instalar dependencias de node:

```bash
sudo npm i
```

Luego debemos renombrar el archivo llamado example.configs.js a configs.js

```bash
mv example.configs.js configs.js
```

Abrimos el archivo configs.js y empezaremos a modificarlo:

**1.- En esta parte donde dice testnet es un valor booleano que indicaremos si estamos en modo ropsten o en mainet.**
**2.- En donde dice puerto es el puerto en el cual esta corriendo el servidor http , te recomendamos no sea el 80 y 443.**
**3.- En donde dice token va la direccion eth del token.**

```js
let testnet = true;
let port = 5050;
let token = 'addresstoken';
```

**4.- en idProjectInfura va el id del proyecto de infura, debes registrarte en infura crear un proyecto y poner el id**
**5.- en apiEtherScan va apikey de etherscan, debes crear un apikey en etherscan para poder trabajar**

```js
let idProjectInfura = 'IDPROJECT';
let apiEtherScan = 'APIETHERSCAN';
```

**6.- en oneSignal.appID debe ir el appID que te da oneSignal para el envio de pushNotifications**
**7.- en oneSignal.secret debe ir la llave secreta que te da oneSignal para el envio de pushNotifications**
**8.- en imgPush debe ir el url de un icono png para el envio de push notifications**

```js
let oneSignal = {
    appID: 'appIDoneSignak',
    secret: 'secretoneSignal',
};
let imgPush = 'iconPushNotifications';
```

**9.- en titleToken va el nombre del token , tal cual como se llama de preferencia**
**10.- en symbolToken va el simbolo del token**

```js
let titleToken = 'nameToken';
let symbolToken = 'symbolToken';
```

**11.- en pathAdmin es el path de la url de administrador, de preferencia solo poner letras y numeros**
**12.- en symbolToken es el password para poder hacer acciones en el administrador**

```js
let pathAdmin = 'admin';
let symbolToken = 'admin';
```

## Configuracion de la wallet

Debemos dar permisos 777 a la carpeta db
```bash
chmod +x ./db
```


## Configuracion de demonios

Debemos crear un alias de la configuracion del demonio supervisor a su carpeta de configuraciones.

Tenemos 4 demonios que debemos crear un alias


```bash
ln -s /home/<Mi-CARPETA-DEL-REPO>/tmp/supervisor_eth.conf /etc/supervisor/conf.d/<NOMBRE-TOKEN>_eth.conf

ln -s /home/<Mi-CARPETA-DEL-REPO>/tmp/supervisor_tokens.conf /etc/supervisor/conf.d/<NOMBRE-TOKEN>_token.conf

ln -s /home/<Mi-CARPETA-DEL-REPO>/tmp/supervisor_server.conf /etc/supervisor/conf.d/<NOMBRE-TOKEN>_server.conf

ln -s /home/<Mi-CARPETA-DEL-REPO>/tmp/supervisor_notifications.conf /etc/supervisor/conf.d/<NOMBRE-TOKEN>_notifications.conf
```

Donde dice <Mi-CARPETA-DEL-REPO> deberia ir el nombre de tu carpeta raiz donde se encuentra el proyecto.
Donde dice <NOMBRE-TOKEN> debe ir el nombre o el symbolo del token.

**Nota .-** Despues debemos abrir los demonios que se encuentranen la carpeta /home/<Mi-CARPETA-DEL-REPO>/tmp/ y modificar la carpeta del repo , remplazar **erc20-wallet** por **<Mi-CARPETA-DEL-REPO>**.


## Configuracion de nginx

En esta parte crearemos un alias de nginx para hacer que el servidor que corre en un puerto local se vea reflejado en el dominio global.

```bash
ln -s /home/<Mi-CARPETA-DEL-REPO>/tmp/nginx_server.conf /etc/nginx/sites-available/nginx_server.conf
```

Donde dice <Mi-CARPETA-DEL-REPO> deberia ir el nombre de tu carpeta raiz donde se encuentra el proyecto.

**Nota .-** Despues debemos abrir el archivo que se encuentranen la carpeta /home/<Mi-CARPETA-DEL-REPO>/tmp/nginx_server.conf y modificar el puerto que se encuentra en proxy_pass http://127.0.0.1:5050/api/ por el puerto que configuraste en el archivo configs.js. Asi mismo puedes modificar el path de erc20-wallet por el de tu token, para que cuando ejecuten dominio.com/erc20-wallet se abra el api rest.


Una vez tengamos la modifacion del fichero de nginx podemos incluirlo en las configuraciones del dominio personalizado de nginx.

```bash
include /etc/nginx/sites-available/nginx_server.conf;
```

### Panel Administrador

Para entrar al panel adminsitrador seria 
```bash
http://dominio.com/erc20-wallet/<path-admin>
```
Donde dice <path-admin> va el path que configuraste en el archivo configs.

Para poder crear alguna accion en el panel debes ingresar primero el password.

En el puedes crear noticias. Esta noticia es bilingue , español e ingles , asi mismo puedes enviar una imagen y un link , y enviar notificaciones push a todos los usuarios, o que solo la vean reflejada en la app cuando ingresen.

En el puedes listar las noticias y ver el detalle dando click en la noticia indicada.

Asi mismo puedes vaciar la base de datos de noticias y de usuarios que se registraron previamente para el envio de notificaciones de transacciones de ethereum y el token.


### Probando

Para provar que todo este en funcionamiento reinicia los demonios y nginx
```bash
sudo supervisorctl reload all

sudo service nginx restart
```

## Errores y contribuciones

Para un error escribir directamente el problema en github issues o enviarlo
al correo miguel@lomeli.io. Si desea contribuir con el proyecto por favor enviar un email.

#Miguel Lomeli , #MiguelLomeli , #Lomeli , #Toopago , #ethereum , #tokens , #wallets , #erc20