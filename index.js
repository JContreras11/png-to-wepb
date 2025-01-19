const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configura las rutas de origen y destino
const inputFolder = './input'; // Carpeta con las imágenes originales
const outputFolder = './output'; // Carpeta para las imágenes convertidas

// Crea la carpeta de destino si no existe
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Función para convertir una imagen a formato .webp
const convertToWebp = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .toFormat('webp')
            .toFile(outputPath);
        console.log(`Convertido: ${inputPath} -> ${outputPath}`);
    } catch (error) {
        console.error(`Error al convertir ${inputPath}:`, error);
    }
};

// Función para recorrer la carpeta y convertir las imágenes
const processImages = async () => {
    const files = fs.readdirSync(inputFolder);
    for (const file of files) {
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, `${path.parse(file).name}.webp`);

        // Verifica si el archivo es una imagen válida
        if (fs.lstatSync(inputPath).isFile() && /\.(jpg|jpeg|png|gif|tiff)$/i.test(file)) {
            await convertToWebp(inputPath, outputPath);
        } else {
            console.log(`Omitido (no es imagen): ${inputPath}`);
        }
    }
};

// Ejecuta el script
processImages().then(() => {
    console.log('Conversión completa.');
}).catch((error) => {
    console.error('Error en el proceso:', error);
});
