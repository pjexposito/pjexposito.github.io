import simplenote
import json
import base64
from itertools import cycle
key = 'simplenote'
    
        
passwd=input("Contraseña Simplenote: ")    
print ("Cargando datos...")
sn = simplenote.Simplenote("pjexposito@gmail.com",passwd)
todo=sn.get_note_list(data=True, tags=[])
en_json = json.dumps(todo, indent=4)
#print (en_json)
#mensaje = en_json.encode("utf-8")
#encoded = base64.b64encode(base64.b64encode(mensaje))
#print (en_json)
mensaje = ''.join(chr(ord(c)^ord(k)) for c,k in zip(en_json, cycle(key)))
mensaje = base64.b64encode(mensaje.encode("utf-8"))
mensaje = str(mensaje,'utf-8')
print('%s' % (mensaje))

file1 = open("/data/data/com.termux/files/home/pjexposito.github.io/datos.json","w") 
file1.write(mensaje) 
file1.close() 
print ("Archivo creado. Subiendo a Github...")
