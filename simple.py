import simplenote
import json
import base64
from itertools import cycle
key = 'simplenote'
passwd = input("Contraseña Simplenote: ")
sn = simplenote.Simplenote("pjexposito@gmail.com",passwd)
todo=sn.get_note_list(data=True, tags=[])
en_json = json.dumps(todo, indent=4)
mensaje = ''.join(chr(ord(c)^ord(k)) for c,k in zip(en_json, cycle(key)))
with open('/data/data/com.termux/files/home/pjexposito.github.io/datos.hex', 'wb') as f:
    f.write(mensaje.encode())


print ("Archivo creado. Subiendo a Github...")
