// controllers/ejemploController.js
import axios from "axios"; // Importamos axios para realizar peticiones HTTP

// Token para hacer peticiones a API externa
const API_KEY = 'Bearer aSuperSecretKey';
// URL de la API externa
const BASE_URL = 'https://echo-serv.tbxnet.com/v1/secret';

// Función para gestionar la obtención y procesamiento de archivos
export const filesManagement = async (req, res) => {
    try {
        //Verifica si la peticion exige que se devuelvan los datos segun el param
        const fileName = req?.query?.fileName;
        // 1. Obtener la lista de archivos
        const filesResponse = await axios.get(`${BASE_URL}/files`, {
            headers: { authorization: API_KEY } // Añadimos el token en los headers
        });
        const { files } = filesResponse?.data; // Desestructuramos la respuesta para obtener los archivos

        if (!files || !files.length) {
            return res.status(404).json({ message: 'No se encontraron archivos.' });
        }

        const result = []; // Inicializamos un array para almacenar los resultados

        // 2. Descargar y procesar cada archivo
        for (const file of files) {
            try {
                // Realizamos la petición para descargar el contenido del archivo
                const fileResponse = await axios.get(`${BASE_URL}/file/${file}`, {
                    headers: { authorization: API_KEY }
                });

                // Procesamos el contenido del archivo CSV
                const lines = fileResponse.data.split('\n').map(line => {
                    const [fileName, text, number, hex] = line.split(',');
                    // Validamos que las columnas necesarias estén presentes
                    if (text && !isNaN(number) && hex) {
                        console.log(number); // Registro del número para depuración
                        return { text, number: parseInt(number), hex }; // Retornamos un objeto con los datos válidos
                    }
                    // Validación adicional para detectar líneas con el valor 'number'
                    if (isNaN(number)) {
                        console.error(`Error en línea: 'number' encontrado, reanudando consulta...`);
                    }
                    return null; // Línea inválida
                }).filter(Boolean); // Filtramos las líneas inválidas

                // Si el archivo no tiene líneas válidas, no se suma a la respuesta de la petición
                if (!lines?.length) continue; // Continuamos si no hay líneas válidas

                // Agregamos el archivo y sus líneas procesadas al resultado
                result.push({ file, lines });
            } catch (error) {
                // Manejo de errores al descargar un archivo
                console.error(`Error al descargar el archivo ${file}:`, error.message);
            }
        }

        //Respuesta de ser una consulta comun
        if (!fileName) {
            // Enviamos la respuesta en formato JSON
            res.json(result);            
            return;
        }
        //Respuesta de existir el filename
        if (fileName) {
            const filtering = result.filter((file) => file.file.toLowerCase().includes(fileName.toLowerCase()));
            //Si no existe un archivo, devuelve un mensaje.
            //Busca coincidencia mas no que sea totalmente igual
            if (!filtering.length) {
                res.status(404).json({ message: 'No hay archivos con este nombre' });
                return;
            }
            res.json(filtering);
            return;
        }
    } catch (error) {
        // Manejo de errores al obtener la lista de archivos
        console.error('Error al obtener la lista de archivos:', error.message);
        res.status(500).json({ error: 'Error al procesar la solicitud' }); // Enviamos un error 500 si algo falla
    }
};

