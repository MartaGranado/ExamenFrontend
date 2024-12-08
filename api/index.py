from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from typing import List, Dict, Any
from bson import ObjectId

# Crear la instancia de FastAPI con la URL personalizada para los docs y OpenAPI
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

# Conexión a MongoDB Atlas
mongo_uri = "mongodb+srv://api:Ou0K405SYDy8m5XV@cluster0.6pb8i.mongodb.net/"
client = MongoClient(mongo_uri)
db = client["laWiki2"]

# Función para convertir los documentos de MongoDB, manejando el ObjectId
def convert_objectid(document):
    """Convierte el ObjectId en una cadena para que FastAPI pueda serializar el documento."""
    if isinstance(document, dict):
        for key, value in document.items():
            if isinstance(value, ObjectId):
                document[key] = str(value)
            elif isinstance(value, dict):
                document[key] = convert_objectid(value)
            elif isinstance(value, list):
                document[key] = [convert_objectid(item) if isinstance(item, dict) else item for item in value]
    return document

# Endpoint para obtener todas las wikis
@app.get("/api/py/helloFastApi/wiki", response_model=List[Dict[str, Any]])
async def get_wikis():
    try:
        # Obtener las wikis desde MongoDB y convertir los ObjectId
        wikis = list(db.Wiki.find())  # Convertir el cursor en lista
        wikis = [convert_objectid(wiki) for wiki in wikis]  # Convertir los ObjectId en cadenas
        return wikis
    except Exception as e:
        # Manejo de errores en caso de que falle la consulta
        raise HTTPException(status_code=500, detail=f"Error al obtener las wikis: {str(e)}")
