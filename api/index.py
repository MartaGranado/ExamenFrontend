import httpx
from pymongo import MongoClient
from fastapi import FastAPI, HTTPException
from typing import List, Dict, Any
import json
from bson import json_util

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
# Conexión a MongoDB Atlas
mongo_uri = "mongodb://api:Ou0K405SYDy8m5XV@cluster0.6pb8i.mongodb.net/"
client = MongoClient(mongo_uri)
db = client["laWiki2"]  # Asegúrate de que esta base de datos exista o cámbiala si es necesario
pokemon_collection = db["pokemons"]  # Cambia a la colección donde se guardarán los pokémons


# Endpoint para obtener datos de un Pokémon y guardarlos en MongoDB
@app.get("/pokemon/{pokemon_name}", response_model=Dict[str, Any])
async def get_pokemon_data(pokemon_name: str):
    try:
        # Obtener datos de Pokémon desde la API
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                pokemon_data = response.json()

                # Guardar o actualizar el Pokémon en la base de datos MongoDB
                pokemon_collection.update_one(
                    {"name": pokemon_name.lower()},
                    {"$set": pokemon_data},
                    upsert=True
                )
                
                return {"status": "success", "data": pokemon_data}
            else:
                raise HTTPException(status_code=404, detail="Pokémon no encontrado")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener o guardar datos: {str(e)}")

# Endpoint para obtener todas las wikis desde la base de datos (usando tu código de ejemplo)
@app.get("/", response_model=List[Dict[str, Any]])
async def get_wikis():
    try:
        wikis = db.Wiki.find()
        return json.loads(json_util.dumps(wikis))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al obtener las wikis.")
