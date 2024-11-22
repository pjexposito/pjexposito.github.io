function showSubcategories(divId) {
    hideAllContainers();
    document.getElementById(divId).style.transform = 'translateX(0)';
}

function showExplanation(subcategory) {
    hideAllContainers();
    document.getElementById('explica_' + subcategory).style.transform = 'translateX(0)';
}

function showMain() {
    hideAllContainers();
    document.getElementById('Principal').style.transform = 'translateX(0)';
}

function hideAllContainers() {
    var containers = document.querySelectorAll('.container');
    containers.forEach(function(container) {
        container.style.transform = 'translateX(100%)';
    });
}

function checkAnswers_palabras() {
  // Obtener respuestas ingresadas por el usuario
  var answer1 = document.getElementById('q1').value.trim().toLowerCase();
  var answer2 = document.getElementById('q2').value.trim().toLowerCase();
  var answer3 = document.getElementById('q3').value.trim();

  // Definir las respuestas correctas
  var correctAnswer1 = 'lisboa';
  var correctAnswer2 = 'canguro';
  var correctAnswer3 = '3';

  // Verificar respuestas
  if (answer1 === correctAnswer1 && answer2 === correctAnswer2 && answer3 === correctAnswer3) {
    showInfoBox(`Enhorabuena. Has respondido correctamente a las preguntas.`);
      saveCourseStatus('Curso3', true);
      checkCourseStatus('Curso3');
    return false; // Evitar el envío del formulario
  } else {
    alert('Al menos una de tus respuestas es incorrecta. Por favor, inténtalo de nuevo.');
    return false; // Evitar el envío del formulario
  }
}


function checkAnswers_check() {
    // Obtener la opción seleccionada por el usuario
    var selectedOption = document.querySelector('input[name="q1"]:checked');

    // Verificar si se seleccionó alguna opción
    if (selectedOption) {
      // Obtener el valor de la opción seleccionada
      var answer = selectedOption.value;

      // Definir la respuesta correcta
      var correctAnswer = 'c'; // La opción correcta es el valor 'c' (Océano Pacífico)

      // Verificar si la respuesta es correcta
      if (answer === correctAnswer) {
		  //alert('¡Enhorabuena! ¡Has acertado la pregunta!');
		  showInfoBox('Has acertado. Enhorabuena.');
      } else {
        alert('Respuesta incorrecta. Inténtalo de nuevo.');
      }
    } else {
      alert('Por favor, selecciona una opción antes de enviar.');
    }

    return false; // Evitar el envío del formulario
  }
  
  
  
function showInfoBox(message) {
      const infoBox = document.getElementById('info-box');
      infoBox.textContent = message;
      infoBox.classList.add('show');
      setTimeout(() => {
          infoBox.classList.remove('show');
      }, 5000); // 5000ms = 5 segundos
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {
      checkAllCoursesStatus();

      const endMarkers = document.querySelectorAll('.end-marker');

      const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const course = entry.target.getAttribute('data-course');
                  showInfoBox(`Has alcanzado el final del ${course}`);
                  saveCourseStatus(course, true);
                  checkCourseStatus(course);
                  observer.unobserve(entry.target); // Dejar de observar una vez alcanzado
              }
          });
      });

      endMarkers.forEach(marker => observer.observe(marker));
  });
  
  
  
function saveCourseStatus(course, status) {
      localStorage.setItem(course, status);
  }

  function checkCourseStatus(course) {
      const courseStatus = localStorage.getItem(course);
	  console.log(course,courseStatus)
      const statusImg = document.getElementById(`status-img-${course}`);
      if (courseStatus === 'true') {
          statusImg.src = 'ok.png';
      } else {
          statusImg.src = 'vacio.png';
      }
  }
  
  
  function checkAllCoursesStatus() {
      // Comprueba y actualiza la imagen para todos los cursos si es necesario
      const allCourses = ['Curso1', 'Curso2','Curso3']; // Añade todos los cursos que estás utilizando
      allCourses.forEach(course => checkCourseStatus(course));
  }
  
  function resetAllCoursesStatus() {
      // Restablece el estado de todos los cursos a false
      const allCourses = ['Curso1', 'Curso2','Curso3']; // Añade todos los cursos que estás utilizando
      allCourses.forEach(course => {
          saveCourseStatus(course, false);
          checkCourseStatus(course);
      });
      showInfoBox('Todos los estados de los cursos han sido reiniciados');
  }