const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const readline = require('node:readline');

// Configura las rutas de origen y destino
const inputFolder = './input'; // Carpeta con las imágenes originales
const outputFolder = './output'; // Carpeta para las imágenes convertidas
 
// Crea la carpeta de destino si no existe
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Códigos ANSI para colores
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Función para preguntar al usuario
const askUserRename = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`${colors.cyan}¿Deseas renombrar las imágenes? (s/n): ${colors.reset}`, (answer) => {
            rl.close();
            const shouldRename = answer.toLowerCase() === 's' || answer.toLowerCase() === 'si';
            resolve(shouldRename);
        });
    });
};

// Función para convertir una imagen a formato .webp
const convertToWebp = async (inputPath, outputPath) => {
    try {
        // Crea la carpeta destino si no existe
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        await sharp(inputPath)
            .toFormat('webp')
            .toFile(outputPath);
        console.log(`${colors.green}✓ Convertido: ${inputPath} -> ${outputPath}${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}✗ Error al convertir ${inputPath}:${colors.reset}`, error);
    }
};

// Función recursiva para procesar carpetas y subcarpetas
const processDirectory = async (currentInputDir, currentOutputDir, shouldRename) => {
    const files = fs.readdirSync(currentInputDir);
    let counter = 1; // Contador para cada carpeta
    
    // Obtiene el nombre de la carpeta actual
    const folderName = path.basename(currentInputDir);
    
    for (const file of files) {
        const inputPath = path.join(currentInputDir, file);
        const stats = fs.lstatSync(inputPath);
        
        if (stats.isDirectory()) {
            // Si es una carpeta, procesarla recursivamente
            const subOutputDir = path.join(currentOutputDir, file);
            await processDirectory(inputPath, subOutputDir, shouldRename);
        } else if (stats.isFile() && /\.(jpg|jpeg|png|gif|tiff)$/i.test(file)) {
            let outputPath;
            
            if (shouldRename) {
                // Si renombrar, usar formato carpeta_001.webp
                const paddedCounter = counter.toString().padStart(3, '0');
                const newFileName = `${folderName}_${paddedCounter}.webp`;
                outputPath = path.join(currentOutputDir, newFileName);
                counter++; // Incrementa el contador
            } else {
                // Si no renombrar, mantener nombre original pero cambiar extensión
                const originalName = path.parse(file).name;
                outputPath = path.join(currentOutputDir, `${originalName}.webp`);
            }
            
            await convertToWebp(inputPath, outputPath);
        } else {
            console.log(`${colors.yellow}⚠ Omitido (no es imagen): ${inputPath}${colors.reset}`);
        }
    }
};

// Función principal para procesar las imágenes
const processImages = async () => {
    console.log(`${colors.cyan}🚀 Iniciando conversión...${colors.reset}`);
    
    // Pregunta al usuario si desea renombrar
    const shouldRename = await askUserRename();
    
    if (shouldRename) {
        console.log(`${colors.blue}📝 Modo: Renombrar archivos (carpeta_001.webp)${colors.reset}`);
    } else {
        console.log(`${colors.blue}📝 Modo: Mantener nombres originales${colors.reset}`);
    }
    
    await processDirectory(inputFolder, outputFolder, shouldRename);
};

// Ejecuta el script
processImages().then(() => {
    console.log(`${colors.green}✅ Conversión completa.${colors.reset}`);
}).catch((error) => {
    console.error(`${colors.red}❌ Error en el proceso:${colors.reset}`, error);
});