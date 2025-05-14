const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');


const imageUrls = ["https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.1.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.2.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.3.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.4.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.5.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.6.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.7.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.8.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.9.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.10.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.11.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.12.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.13.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.14.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.15.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.16.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.17.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.18.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.19.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.20.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.21.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.22.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.23.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.24.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.25.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.26.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.27.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.28.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.29.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.30.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.31.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.32.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.33.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.34.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.35.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.36.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.37.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.38.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.39.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.40.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.41.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.42.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.43.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.44.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.45.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.46.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.47.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.48.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.49.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.50.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.51.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.52.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.53.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.54.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.55.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.56.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.57.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.58.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.59.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.60.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.61.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.62.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.63.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.64.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.65.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.66.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.67.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.68.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.69.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.70.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.71.png",
     "https://www.rfnbike.com/wp-content/uploads/2025/ROAD/Road.72.png"
]

const outputDir = 'input';

// Crear el directorio 'input' si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log(`Directorio '${outputDir}' creado.`);
}

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Imagen descargada: ${filepath}`);
                    resolve();
                });
                fileStream.on('error', (err) => {
                    console.error(`Error escribiendo archivo ${filepath}: ${err.message}`);
                    reject(err);
                });
            } else {
                console.error(`Error descargando ${url}: Código de estado ${res.statusCode}`);
                // Intentar obtener más información del error si está disponible
                let errorData = '';
                res.on('data', (chunk) => {
                    errorData += chunk;
                });
                res.on('end', () => {
                    if (errorData) {
                        console.error(`Respuesta del servidor: ${errorData}`);
                    }
                    reject(new Error(`Código de estado ${res.statusCode}`));
                });
            }
        }).on('error', (err) => {
            console.error(`Error con la petición a ${url}: ${err.message}`);
            reject(err);
        });
    });
};

const main = async () => {
    if (imageUrls.length === 0) {
        console.log("No hay URLs para descargar. Por favor, añade URLs al array 'imageUrls'.");
        return;
    }

    for (const url of imageUrls) {
        try {
            const filename = path.basename(new URL(url).pathname);
            const filepath = path.join(outputDir, filename);
            await downloadImage(url, filepath);
        } catch (error) {
            console.error(`No se pudo procesar la URL ${url}: ${error.message}`);
        }
    }
    console.log('Descarga de imágenes completada.');
};

main();