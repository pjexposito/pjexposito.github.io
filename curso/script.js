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

function checkAnswers() {
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
    alert('¡Enhorabuena! ¡Has acertado todas las preguntas!');
    return false; // Evitar el envío del formulario
  } else {
    alert('Al menos una de tus respuestas es incorrecta. Por favor, inténtalo de nuevo.');
    return false; // Evitar el envío del formulario
  }
}


function checkAnswers() {
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
        alert('¡Enhorabuena! ¡Has acertado la pregunta!');
      } else {
        alert('Respuesta incorrecta. Inténtalo de nuevo.');
      }
    } else {
      alert('Por favor, selecciona una opción antes de enviar.');
    }

    return false; // Evitar el envío del formulario
  }