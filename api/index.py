from fastapi import FastAPI, HTTPException
import httpx

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon"

@app.get("/api/py/helloFastApi")
async def hello_fast_api(pokemon: str = "pikachu"):
    """
    Get Pokémon data from the PokeAPI.
    :param pokemon: The name of the Pokémon to retrieve data for (default is Pikachu).
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{POKEAPI_URL}/{pokemon.lower()}")
        if response.status_code == 200:
            data = response.json()
            return {
                "name": data["name"],
                "height": data["height"],
                "weight": data["weight"],
                "base_experience": data["base_experience"],
                "abilities": [ability["ability"]["name"] for ability in data["abilities"]],
            }
        else:
            raise HTTPException(status_code=404, detail="Pokémon not found")
