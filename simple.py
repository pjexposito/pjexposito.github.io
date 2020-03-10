import simplenote
import json
import base64
    
        
in = input("Contraseña Simplenote: ")    
sn = simplenote.Simplenote("pjexposito@gmail.com",in)
todo=sn.get_note_list(data=True, tags=[])
en_json = json.dumps(todo, indent=4)
#print (en_json)
mensaje = en_json.encode("utf-8")
encoded = base64.b64encode(base64.b64encode(mensaje))
file1 = open("/data/data/com.termux/files/home/pjexposito.github.io/datos.json","w") 
file1.write(encoded.decode("utf-8")) 
file1.close() 
print ("Archivo creado. Subiendo a Github...")
