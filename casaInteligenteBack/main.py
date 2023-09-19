from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from baseDatos import getInfo, getInfoCasa,updateInfo,insertUser,apagarLuces,encenderLuces
app = FastAPI()

class Usuario(BaseModel):
    nombres: str
    apellidos: str

class Casa(BaseModel):
    id: int
    ubicacion: str 

origins=["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get("/")
def getCasas():
   datos = getInfo()
   if datos is None:
      return {"error": "error"}
   else:
      return datos
   
@app.get("/{id}")
def getCasa(id: int):
   datos = getInfoCasa(id)
   if datos is None:
      return {"error": "error"}
   else:
      return datos   
   
@app.post("/insertar-usuario/")
def insertUser(usurio: Usuario):
   datos = insertUser(usurio.nombres,usurio.apellidos)
   if datos:
      return {"insertado": "correcto"}
   else:
      return {"error": "error"}   
   
@app.post("/update-casa/")
def updateCasa(casa: Casa):
   print(f"{casa.id} ubi= {casa.ubicacion}")
   respuesta = updateInfo(casa.id,casa.ubicacion)
   if not respuesta:
      return {"error": "error"}  
   else:
      return {"actualizado": "correcto"}



@app.get("/luces/{id}/{estado}")
def manejar_luces(id: int, estado: int):
   if(estado):
      respuesta = encenderLuces(id)
   else:
      respuesta = apagarLuces(id)
   
   if respuesta:
      return {"luces": "cambiaron correctamente"}