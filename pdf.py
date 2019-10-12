#!/usr/bin/python

import sys
from PyPDF2 import PdfFileWriter, PdfFileReader
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import  cm
import calendar
import datetime


from reportlab.pdfbase.pdfmetrics import stringWidth
dias =["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
meses =["","Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]


class Clase_fecha:
  def __init__(self, dia, mes, ano, posicion_dia, literal):
    self.dia = dia
    self.mes = mes
    self.ano = ano
    self.posicion_dia = posicion_dia
    self.literal = literal
    

def Error():
    print("ERROR. Debes usar ./calendario <año-mes-dia> <semana|mes|ano>")
    exit()
    return

def DevuelveFecha(literal):
    literal = str(literal)
    fecha = Clase_fecha
    fecha.ano,fecha.mes, fecha.dia = (int(i) for i in literal.split('-')) 
    fecha.posicion_dia = calendar.weekday(fecha.ano, fecha.mes, fecha.dia) 
    fecha.literal = literal
    return fecha
    

if (len(sys.argv)<3):
    Error()
    exit()
else:    
    fecha_original = DevuelveFecha(sys.argv[1])
    tipo = sys.argv[2]
    if (tipo!="mes" and tipo!="semana" and tipo!="ano"):
        Error()
        exit()

    
    


def genera_pagina(fecha):
    mes_trabajo = fecha.mes
    primer_dia = datetime.date(fecha.ano, fecha.mes, fecha.dia)-datetime.timedelta(days=fecha.posicion_dia)
    ultimo_dia = datetime.date(primer_dia.year,primer_dia.month,primer_dia.day)+datetime.timedelta(days=6)


    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=A4)
    can.translate(cm, cm)

    # ---------------
    # CABECERA
    # ---------------

    can.setStrokeColorRGB(255,255,255)
    can.setFillColorRGB(255,255,255)
    can.rect(150,500,500,100, fill=1)
    can.setStrokeColorRGB(0,0,0)
    can.setFillColorRGB(0,0,0)
    can.setFont("Helvetica-Bold", 32) 
    can.drawString(170, 510, meses[fecha.mes])
    textWidth = stringWidth(meses[fecha.mes], 'Helvetica-Bold', 32) 
    x = 170 + textWidth + 1
    can.setFont("Helvetica", 32) 
    cadena = " - Semana del "+str(primer_dia.day)+ " al "+str(ultimo_dia.day)
    can.drawString(x, 510, cadena)

    # ---------------
    # DIAS
    # ---------------

    for i in range(0, 7):
        dia_actual = datetime.date(primer_dia.year,primer_dia.month,primer_dia.day)+datetime.timedelta(days=i)
        dia_semana = DevuelveFecha(dia_actual).posicion_dia

        texto = dias[dia_semana]+" "+str(dia_actual.day)
        textWidth = stringWidth(texto, 'Helvetica', 10) 
        if (i==0):
            numero_columna = 0
            numero_fila = 0
        elif (i==1):
            numero_columna = 1
            numero_fila = 0
        elif (i==2):
            numero_columna = 2
            numero_fila = 0
        elif (i==3):
            numero_columna = 3
            numero_fila = 0
        elif (i==4):
            numero_columna = 0
            numero_fila = 1
        elif (i==5):
            numero_columna = 1
            numero_fila = 1
        elif (i==6):
            numero_columna = 2
            numero_fila = 1      
        columna = numero_columna*204
        fila = numero_fila*240
        can.setStrokeColorRGB(255,255,255)
        can.setFillColorRGB(255,255,255)
        can.rect(10+77+columna-(textWidth/2)-4,470-fila,textWidth+8,20, fill=1)
        #if ((dia_actual.day)>(dia_trabajo+10)):
        if (mes_trabajo!=dia_actual.month):
        
            can.setStrokeColorRGB(0,0,0)
            can.setFillColorRGB(0.5,0.5,0.5)
        else:
            can.setStrokeColorRGB(0,0,0)
            can.setFillColorRGB(0,0,0)           
        
        can.setFont("Helvetica", 10) 
        can.drawString(10+77+columna-(textWidth/2), 478-fila, texto)

    can.save()

    packet.seek(0)

    new_pdf = PdfFileReader(packet)
    # read your existing PDF
    existing_pdf = PdfFileReader(open("original.pdf", "rb"))
    # add the "watermark" (which is the new pdf) on the existing page
    page = existing_pdf.getPage(0)
    page.mergePage(new_pdf.getPage(0))
    return page
    
    
def Genera_mes(salida,fecha):
    for i in range(0,len(calendar.monthcalendar(fecha.ano,fecha.mes))):
        #print ("Generando: "+str(fecha.ano)+"-"+str(fecha.mes)+"-"+str(fecha.dia))
        output.addPage(genera_pagina(fecha))
        fecha = DevuelveFecha(datetime.date(fecha.ano,fecha.mes,fecha.dia)+datetime.timedelta(days=7))
        
        
    
output = PdfFileWriter()
if (tipo=="semana"):
    output.addPage(genera_pagina(fecha_original))
elif (tipo=="mes"):
    fecha = DevuelveFecha(str(fecha_original.ano)+"-"+str(fecha_original.mes)+"-1")
    Genera_mes(output,fecha)
else:
    progreso = "---------"
    for i in range(1,13):
        progreso = (i-1)*"*"+(12-i)*"-"
        print ("Generando: ["+progreso+"] -> "+meses[i]+"     ", end='\r')
        fecha = DevuelveFecha(str(fecha_original.ano)+"-"+str(i)+"-1")
        Genera_mes(output,fecha)
        
print ("Generado. Creando el PDF...          ")
        
    
outputStream = open("destination.pdf", "wb")
output.write(outputStream)
outputStream.close()

