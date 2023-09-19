import mysql.connector

db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "",
    database = "casa_inteligente"
)

cursor = db.cursor()

def getInfo():
    query = "SELECT * FROM casa"
    cursor.execute(query)
    datos = cursor.fetchall()
    db.commit()
    return datos

def insertUser(nombres, apellidos):
    query = "INSERT INTO usuarios (nombres, apellidos) values (%s,%s)"
    values = (nombres, apellidos)
    cursor.excute(query, values)
    respuesta = db.commit()
    print(respuesta)


def getInfoCasa(id, ubicacion):
    query = "SELECT {} FROM casa WHERE casa.id = %s".format(ubicacion)
    cursor.execute(query, (id,))
    datos = cursor.fetchone()
    db.commit()
    return datos


def updateInfo(id, ubicacion):
    try:
        query = "UPDATE casa set {} WHERE casa.id = %s".format(ubicacion)

        cursor.execute(query, (id,))
        db.commit()
        return True  
    except:
        return False

def apagarLuces(id):
    query = "UPDATE casa set cocina = 0, patio = 0, oficina = 0, sala = 0 WHERE casa.id = %s"
    cursor.execute(query, (id,))
    db.commit()
    return True

def encenderLuces(id):
    query = "UPDATE casa set cocina = 1, patio = 1, oficina = 1, sala = 1 WHERE casa.id = %s"
    cursor.execute(query, (id,))
    db.commit()
    return True