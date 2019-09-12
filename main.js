/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var textbox = document.querySelector("#calendar"),
fecha = new Date(),
mes = fecha.getMonth()+1,
ano = fecha.getFullYear(),
con_numeros = 1,
base_datos;
posicion = 0;

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;




function pintaCalendario() {
    console.log(base_datos);
    var cabecera = document.getElementById('actualizado');
    cabecera.innerHTML=base_datos.actualizado[0]+" a las "+base_datos.actualizado[1];
    var today = new Date(),
        calendar = document.getElementById('calendar'),
        date, day, firstDay, lastDate, el, count, i, turnos, mes_str, turno_dia, ano_actual, mes_actual,
	    matriz_turnos=["C","M","T","AM","AT","L","FM","FT","D"];
	var cabecera = document.getElementById('cabecera');
    cabecera.style.visibility = "visible";   
    calendar.textContent="";
    date = today.getDate();
    mes_actual = today.getMonth();
    ano_actual = today.getFullYear();
    document.getElementById('month').textContent = MESES[mes];
    today.setYear(ano);
    today.setMonth(mes);
    today.setDate(0);
    lastDate = today.getDate();
    today.setDate(1);
    firstDay = today.getDay();
    mes_str = mes<10 ? "0"+mes:mes;
	
	//turnos =  tizen.preference.getValue(ano+""+mes_str);
	if (base_datos != null) {
		for (var t in base_datos.main){
			if ((ano+""+mes_str)==base_datos.main[t].substring(2, 8))
			{
				turnos = base_datos.main[t].substring(8);
			}
		}
	}
	else{
		turnos = "00000000000000000000000000000000000";
	}

	
	
	//turnos = "811111185111118111111822222285";
	if (turnos===null){
		turnos = "00000000000000000000000000000000000";
	}
    for (i = 1; i < firstDay; i++) {
		//console.log(i);
        el = document.createElement('div');
        el.classList.add('days');
        if (i === 0) {
            el.classList.add('domingo');
        }
        calendar.appendChild(el);
    }
	if (firstDay ===0) {
		
        for (i=1;i<7;i++){
            el = document.createElement('div');
			el.classList.add('days');
            calendar.appendChild(el);
        }
	}

    for (i = 1; i <= lastDate+1; i++) {
        day = i + firstDay;
        el = document.createElement('div');
        el.classList.add('days');
        if (day % 7 === 1) {
            el.classList.add('domingo');
        } 
		if (i<=lastDate) {
			turno_dia = turnos.substring(i-1,i);
			if (turno_dia.length === 0)
				{
				turno_dia =0;
				}
			if (con_numeros ===1)
				{
	        	el.textContent = i;
				}
			else
				{
	        	el.textContent = matriz_turnos[turno_dia];

				}
            el.classList.add(matriz_turnos[turno_dia]);
			
		}
//console.log("i: "+i+"Date: "+date+"Mes: "+mes+"Mes_actual: "+mes_actual+"Ano: "+ano+"Ano actual: "+ano_actual);
        if ((i === date) && (mes===mes_actual) && (ano === ano_actual)) {
            el.classList.add('today');
        }
        calendar.appendChild(el);

    }

    count = (42 - (firstDay + lastDate)) % 7;
    for (i = 1; i <= count; i++) {
        el = document.createElement('div');
        el.classList.add('days');
        if (i === count) {
            el.classList.add('domingo');
        }
        calendar.appendChild(el);
    }
    if (count + firstDay +lastDate === 35) {
        document.getElementById('calendar').style.paddingTop = '19px';
    } else if (count + firstDay + lastDate === 43) {
        document.getElementById('calendar').style.paddingTop = '3px';
    } else if (count + firstDay + lastDate === 28) {
        document.getElementById('calendar').style.paddingTop = '36px';
    }
}	 


       
function pregunta(){
	var calendar = document.getElementById('calendar');
	var cabecera = document.getElementById('cabecera');
    calendar.innerHTML="<div style=\"font-size:30px;\">¿Quieres descargar datos nuevos?<br><br><span onclick=\"descarga_datos();\">Sí</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=\"cierra();\">No</span></div>";
    cabecera.style.visibility = "hidden";
}

function cierra(){
 
    pintaCalendario();
	
}

function siguiente(){
	mes = mes+1;
	if (mes > 12) {
		mes = 1;
		ano = ano+1;
	}
    pintaCalendario();
	
}

function anterior(){
    mes = mes-1;
	if (mes < 1) {
		mes = 12;
		ano = ano-1;
	} 
    pintaCalendario();
	
}



function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            siguiente();
        } else {
            anterior();
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};



function descarga_datos() { 
	console.log("Descargando...");
	var xmlhttp = new XMLHttpRequest(),
        datos,
        //XML_ADDRESS = "https://pjexposito.000webhostapp.com/datos2.php",
        XML_ADDRESS = "https://pjexposito.github.io",

        XML_METHOD = "GET";
        xmlhttp.open(XML_METHOD, XML_ADDRESS, true);
        xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            datos = xmlhttp.responseText;
            base_datos = JSON.parse(datos);
      		//for (var t in base_datos.main){
      		//	 window.localStorage.setItem(base_datos.main[t].substring(2, 8),base_datos.main[t].substring(8));      	  			
      		//}
      		console.log("Descargado");
			console.log(base_datos.actualizado[0]);
      		cierra();
            xmlhttp = null;
        } 
    };
    xmlhttp.send();
    
}  



  

(function() {
    /**
     * Handles the hardware key event.
     * @private
     * @param {Object} event - The hardware key event object
     */
    function keyEventHandler(event) 
      {
    	if (event.keyName === "back") 
    	  {
    	  try {tizen.application.getCurrentApplication().exit();}
    	  catch (ignore) {}
    	  }
      } 

    /**
     * Initializes the application.
     * @private
     */
    
  function init() {
	  console.log("Iniciando");
	
// También se puede usar tizen.preference.exists('key1') para ver si un valor existe.


    
    
    
    
    textbox.addEventListener("click", 
      function() 
        {	
    	con_numeros = (con_numeros===1) ? 0 : 1;
        pintaCalendario();
        }); 
    
    var mes_str = mes<10 ? "0"+mes:mes;


		descarga_datos();


	pintaCalendario();    
    } // Cierra la función INIT

    // The function "init" will be executed after the application successfully loaded.
    window.onload = init;
}()); // Esto cierra la función principal y el programa
