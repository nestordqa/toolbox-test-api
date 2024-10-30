// app.js
import express from 'express';
import cors from 'cors';
import filesRoutes from './routes/filesRoutes.js';
import morgan from 'morgan';

const app = express();

//Implementación de middleware para permitir
//realizar peticiones desde cualquier origen
app.use(cors());

//Implementacion de logs para todas las peticiones
app.use(morgan('combined'));

app.use(express.json());

//Se setea un prefijo 'api' para todos los endpoints
app.use('/api', filesRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} ✔︎✔`);
});