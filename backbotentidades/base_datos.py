import mysql.connector

# Conectar a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="celulares_jeffry"
)

cursor = db.cursor()


def crear_registro(nombre_usuario,telefono,correo,precio,marca):
    query = "INSERT INTO registros (nombre_usuario,telefono,correo,precio,marca) VALUES (%s, %s,%s, %s,%s)"
    values = (nombre_usuario,telefono,correo,precio,marca)
    cursor.execute(query,values)
    db.commit()

def leer_registros():
    query = "SELECT * FROM registros"
    cursor.execute(query)
    resultados = cursor.fetchall()
    return resultados


def actualizar_registro(id,nombre_usuario,telefono,correo,precio,marca):
    query = "UPDATE registros SET nombre_usuario = %s,telefono = %s,correo = %s,precio = %s,marca = %s WHERE id_registro = %s"
    values = (id,nombre_usuario,telefono,correo,precio,marca)
    cursor.execute(query, values)
    db.commit()

def eliminar_registro(id):
    query = "DELETE FROM registros WHERE id_registro = %s"
    values = (id,)
    cursor.execute(query, values)
    db.commit()

