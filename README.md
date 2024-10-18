# NestJS API

## Descripción

Este proyecto es una API RESTful construida con NestJS. Proporciona funcionalidad para la gestión de usuarios, incluyendo creación, actualización, eliminación y autenticación.

## Tecnologías Utilizadas

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)
- [Jest](https://jestjs.io/)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- Node.js (versión 14 o superior)
- MongoDB

## Instalación

1. Clona el repositorio:

   git clone https://github.com/vcasbayprog/api-prueba.git
   


2. Navega al directorio del proyecto:

cd nombre_del_proyecto

3. Instala las dependencias:

npm install


4. Configura las variables de entorno. Puedes crear un archivo .env en la raíz del proyecto con las siguientes variables:

MONGODB_URI=mongodb://localhost:27017/nombre_bd
JWT_SECRET=tu clave secreta



5. Para ejecutar la aplicación, usa el siguiente comando:


npm run start:dev


6. Documentación:
La documentación de la API está disponible en Swagger. Puedes acceder a ella en http://localhost:3000/api.

7. Para ejecutar las pruebas unitarias, usa el siguiente comando:

npm run test



## Respuestas a Preguntas Frecuentes

### ¿Es necesario crear un endpoint logout?

No es necesario crear un botón de "cerrar sesión" en una API que usa JWT. Con JWT, el servidor no guarda información sobre si un usuario está conectado o no. En su lugar, el usuario tiene un "token" que se guarda en su dispositivo (como en el navegador). Para "cerrar sesión", solo necesita borrar ese token.

Sin embargo, si queremos más seguridad, podemos crear un botón de "cerrar sesión" que le diga al servidor que ese token ya no es válido. Esto puede ser útil si, por ejemplo, alguien roba el token y queremos evitar que esa persona acceda a la cuenta.

### La funcionalidad “Dar de baja” se puede hacer de varias formas, explica al menos 3 formas que se podría hacer.

1. **Marcado para eliminación**: Los usuarios pueden pedir que su cuenta sea marcada como "pendiente de eliminación". Esto significa que el sistema cambia el estado de la cuenta a pendingDeletion, y después de un tiempo, se eliminará automáticamente. Esto les da a los usuarios la oportunidad de cambiar de opinión y recuperar su cuenta antes de que se borre para siempre.

2. **Eliminación inmediata**: Se puede ofrecer una opción que permita a los usuarios borrar su cuenta de inmediato. Esto eliminaría todos los datos de la cuenta de forma rápida, y no se podrían recuperar. Esta opción es buena para usuarios que quieren deshacerse de sus datos rápidamente.

3. **Desactivación temporal**: En lugar de eliminar la cuenta, se puede permitir que los usuarios la desactiven temporalmente. Esto significa que la cuenta se pausa y el usuario no puede acceder a ella durante un tiempo, pero los datos siguen guardados en el sistema. Esta opción es útil para aquellos que necesitan un descanso de su cuenta, pero podrían querer volver a usarla más adelante.


