from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import json_util
import json
from typing import List, Dict, Any

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Conexión a MongoDB Atlas
mongo_uri = "mongodb+srv://api:Ou0K405SYDy8m5XV@cluster0.6pb8i.mongodb.net/"
client = MongoClient(mongo_uri)
db = client["laWiki2"]

# READ EVERY WIKI
@app.get("/api/py/wikis", response_model=List[Dict[str, Any]])
async def get_wikis():
    try:
        # Obtener todos los documentos de la colección 'Wiki'
        wikis = list(db.Wiki.find())  # Convertir el cursor en lista
        return json.loads(json_util.dumps(wikis))  # Convertir ObjectId a string
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al obtener las wikis.")
