import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin, urlparse
import ast
from typing import List
import time
import re
import hashlib

def descargar_imagen(session: requests.Session, img_url: str, nombre_archivo: str, carpeta_destino: str):
    """Descarga una imagen individual"""
    try:
        response = session.get(img_url, stream=True)
        if response.status_code == 200:
            ruta_completa = os.path.join(carpeta_destino, nombre_archivo)
            with open(ruta_completa, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            return True, nombre_archivo
        return False, f"Error {response.status_code} al descargar {img_url}"
    except Exception as e:
        return False, f"Error descargando {img_url}: {str(e)}"

def procesar_url(session: requests.Session, url: str, carpeta_destino: str):
    """Procesa una URL individual"""
    try:
        print(f"\nProcesando URL: {url}")
        response = session.get(url)
        if response.status_code != 200:
            return f"Error {response.status_code} al acceder a {url}"
        
        soup = BeautifulSoup(response.text, 'html.parser')
        imagenes = soup.find_all('img')
        
        if not imagenes:
            return f"No se encontraron imágenes en {url}"
        
        resultados = []
        exitos = []
        errores = []
        
        dominio = urlparse(url).netloc
        
        for i, img in enumerate(imagenes):
            img_url = img.get('src')
            if img_url:
                img_url = urljoin(url, img_url)
                # Obtener el nombre original de la imagen
                nombre_original = os.path.basename(urlparse(img_url).path)
                
                # Si no hay nombre o es inválido, crear uno basado en la URL
                if not nombre_original or nombre_original == '' or '/' in nombre_original:
                    nombre_original = f'img_{i+1}'
                
                # Obtener la extensión, defaulteando a png si no es válida
                extension = img_url.split('.')[-1].split('?')[0].lower()
                if extension not in ['jpg', 'jpeg', 'png', 'webp']:
                    extension = 'png'
                elif extension == 'gif':
                    continue
                
                # Limpiar el nombre original para eliminar caracteres no válidos
                nombre_base = re.sub(r'[\\/*?:"<>|]', "", os.path.splitext(nombre_original)[0])
                
                # Crear un hash corto de la URL original para garantizar unicidad
                url_hash = hashlib.md5(img_url.encode()).hexdigest()[:8]
                
                # Crear un nombre único combinando dominio, nombre original y hash
                nombre_archivo = f'{dominio}_{nombre_base}_{url_hash}.{extension}'
                
                resultado = descargar_imagen(session, img_url, nombre_archivo, carpeta_destino)
                
                if resultado[0]:
                    exitos.append(resultado[1])
                else:
                    errores.append(resultado[1])
        
        return {
            'url': url,
            'imagenes_descargadas': len(exitos),
            'errores': errores
        }
            
    except Exception as e:
        return f"Error procesando {url}: {str(e)}"

def descargar_imagenes(urls: List[str], carpeta_destino: str = 'input'):
    """Gestiona la descarga de imágenes de múltiples URLs"""
    if not os.path.exists(carpeta_destino):
        os.makedirs(carpeta_destino)
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    resultados = []
    for url in urls:
        resultado = procesar_url(session, url, carpeta_destino)
        resultados.append(resultado)
    
    return resultados

def parse_urls_input(entrada: str) -> List[str]:
    """Convierte la entrada del usuario en una lista de URLs"""
    try:
        if entrada.startswith('[') and entrada.endswith(']'):
            urls = ast.literal_eval(entrada)
            if not isinstance(urls, list):
                raise ValueError("La entrada debe ser una lista de URLs")
            return [url.strip() for url in urls if url.strip()]
        else:
            return [entrada.strip()]
    except Exception as e:
        raise ValueError(f"Error al procesar las URLs: {str(e)}")

def main():
    print("=== Descargador de Imágenes ===")
    print("Puedes ingresar una URL individual o una lista de URLs en formato: ['url1', 'url2']")
    
    while True:
        try:
            entrada = input("\nIngresa la(s) URL(s) (o presiona Enter para salir): ").strip()
            if not entrada:
                print("¡Programa terminado!")
                break
            
            # Procesar entrada de URLs
            urls = parse_urls_input(entrada)
            
            # Añadir https:// si no está presente
            urls = ['https://' + url if not url.startswith(('http://', 'https://')) else url for url in urls]
            
            print(f"\nProcesando {len(urls)} URL(s)...")
            inicio = time.time()
            
            # Ejecutar descarga
            resultados = descargar_imagenes(urls)
            
            # Mostrar resultados
            print("\nResultados:")
            for resultado in resultados:
                if isinstance(resultado, dict):
                    print(f"\nURL: {resultado['url']}")
                    print(f"Imágenes descargadas: {resultado['imagenes_descargadas']}")
                    if resultado['errores']:
                        print("Errores:")
                        for error in resultado['errores']:
                            print(f"  - {error}")
                else:
                    print(f"\nError: {resultado}")
            
            tiempo_total = time.time() - inicio
            print(f"\nTiempo total de procesamiento: {tiempo_total:.2f} segundos")
            
            continuar = input("\n¿Quieres procesar más URLs? (s/n): ").lower()
            if continuar != 's':
                print("¡Programa terminado!")
                break
                
        except Exception as e:
            print(f"Error: {str(e)}")
            print("Por favor, intenta de nuevo.")

if __name__ == "__main__":
    main()