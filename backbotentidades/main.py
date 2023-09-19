from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from base_datos import crear_registro, leer_registros
from pydantic import BaseModel
import uvicorn


app = FastAPI()

class Registro(BaseModel):
    nombre_usuario: str
    telefono: str
    correo: str
    precio: int
    marca: str

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
def index(registro_js: Registro):
    crear_registro(registro_js.nombre_usuario,registro_js.telefono,registro_js.correo,registro_js.precio,registro_js.marca)
    return {"registros": "exitoso"}


@app.get("/usuarios")
def usuarios():
    registros = leer_registros()
    return {"registros": registros}

# if __name__ == '__main__':
#     uvicorn.run('main:app', host='0.0.0.0', port=8000)

