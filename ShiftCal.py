import sqlite3
from calendar import monthrange
import datetime 
x = datetime.datetime.now()
hora = x.strftime("%X")
dia = x.strftime("%x")
con = sqlite3.connect('/data/data/com.termux/files/home/storage/shared/ShiftCal/ShiftCal.db')

cursorObj = con.cursor()
cursorObj.execute('SELECT * FROM calendar,shifts WHERE calendar.cal_shift_id1 = shifts.shift_rowid ORDER BY calendar.cal_date')
rows = cursorObj.fetchall()
mes_anterior = 0
datos = "{\"actualizado\":[\""+dia+","+hora+"\"],\"main\":["

for row in rows:
        mes = row[1][4:6]
        ano = row[1][0:4]
        if mes == mes_anterior: #Es el mismo mes. Añado datos nuevos
            datos = datos + str(row[10])
        else: #nuevo mes
            if mes_anterior!=0:
                datos = datos+"\","
            #print(datos)
            #print(row[1][4:6])
            #print(row[10])
            dias = monthrange(int(ano), int(mes))
            
            datos = datos+"\""+str(dias[1])+str(ano)+str(mes)+str(row[10])
            mes_anterior = mes
datos = datos+"\"]}"
file1 = open("/data/data/com.termux/files/home/pjexposito.github.io/index.html","w") 
  
file1.write(datos) 
file1.close() 
print ("Archivo creado. Subiendo a Github...")
