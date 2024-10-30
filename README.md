# 🌟 Toolbox API REST Test 🌟

¡Bienvenido al proyecto **Toolbox API REST Test**! Este README te guiará a través de la instalación, ejecución y pruebas de nuestra API de manera clara y sencilla. 🚀

---

## 📦 Instalación de Dependencias

Para comenzar, debes instalar las dependencias necesarias. Abre tu terminal y ejecuta el siguiente comando:

```bash
npm i
```

---

## 🧪 Ejecución de Pruebas Unitarias

Para asegurarte de que todo funcione correctamente, puedes ejecutar las pruebas unitarias con:

```bash
npm run test
```

---

## 🚀 Construcción de la Imagen y Levantamiento de la API REST

Para construir la imagen y levantar la API REST, utiliza el siguiente comando:

```bash
npm run start
```

Esto iniciará un contenedor con la imagen ya creada, garantizando que solo exista **una instancia** de este contenedor.

### 🌐 Acceso a la API

La API se levantará en tu entorno local en el puerto **3000**. Puedes acceder a ella en:

[http://localhost:3000](http://localhost:3000)

El endpoint para obtener los archivos es:

```
http://localhost:3000/api/files/data
```

Este endpoint **no recibe ningún parámetro**.


El endpoint para obtener los archivos según su nombre:

```
http://localhost:3000/api/files/data?fileName=NombreDeTuArchivo
```

Este endpoint **recibe un Query Param ===>>> ?fileName='NombreDeTuArchivo'**.

---

## 🛑 Detener el Contenedor

**⚠️ IMPORTANTE:** Si ya hay una instancia del contenedor corriendo, es crucial detenerla antes de iniciar una nueva. Para detener el contenedor, ejecuta:

```bash
npm run docker:stop
```

---

## 📋 Versiones

A continuación, se listan las versiones de Node y las dependencias utilizadas en este proyecto:

- **Node:** v14
- **Dependencias:**
  - `axios`: ^1.7.7
  - `cors`: ^2.8.5
  - `express`: ^4.21.1
  - `morgan`: ^1.10.0
  - `nodemon`: ^3.1.7

---

¡Disfruta probando la **Toolbox API REST**! 😊 Si tienes alguna pregunta o necesitas ayuda, no dudes en preguntar. ¡Estoy aquí para ayudarte! 💬