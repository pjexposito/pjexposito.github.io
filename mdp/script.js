// State management
const state = {
  levelInfo: [],
  milestones: [],
  totalPoints: 0,
  currentLevel: 5
};

// DOM elements
const elements = {
  timeline: document.getElementById('timeline'),
  startDate: document.getElementById('startDate'),
  pointsDisplay: document.getElementById('pointsDisplay'),
  currentLevel: document.getElementById('currentLevel'),
  currentDate: document.getElementById('currentDate'),
  modal: document.getElementById('modal'),
  modalContent: document.getElementById('modalContent'),
  popup: document.getElementById('popup'),
  overlay: document.getElementById('overlay')
};

// Utility functions
const formatDate = (date) => date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
const getStatusIcon = (status) => ({ completed: '✓', pending: '?', 'in-progress': '▶' }[status] || '');
const getStatusColor = (status) => ({ completed: '#2ecc71', pending: '#95a5a6', 'in-progress': '#f39c12' }[status] || '');

// Data loading
async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    state.levelInfo = data.levelInfo;
    state.milestones = data.milestones;
    
    initializeDatePicker();
    renderTimeline();
    generateQRCode();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function initializeDatePicker() {
  const fechaInicioTrabajo = new Date();
  fechaInicioTrabajo.setMonth(fechaInicioTrabajo.getMonth() - 15);
  elements.startDate.valueAsDate = fechaInicioTrabajo;
  elements.startDate.addEventListener('change', renderTimeline);
}

function generateQRCode() {
  new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 150,
    height: 150
  });
}

// Timeline rendering
function renderTimeline() {
  elements.timeline.innerHTML = '';
  let currentLevelInTimeline = 0;
  const currentDate = new Date();
  const startDate = new Date(elements.startDate.value);

  state.milestones.forEach(milestone => {
    if (milestone.level !== currentLevelInTimeline) {
      if (currentLevelInTimeline !== 0) {
        elements.timeline.appendChild(document.createElement('div')).className = 'level-separator';
      }
      currentLevelInTimeline = milestone.level;
      renderLevel(currentLevelInTimeline, startDate, currentDate);
    }
    renderMilestone(milestone, currentLevelInTimeline);
  });

  updatePointsDisplay();
  //scrollToFirstInProgressLevel();
}

function renderLevel(level, startDate, currentDate) {
  const levelData = state.levelInfo[level - 1];
  const levelStatus = getLevelStatus(level);
  const unlockDate = new Date(startDate.getTime() + levelData.unlockTime * 30 * 24 * 60 * 60 * 1000);
  const isLocked = currentDate < unlockDate;

  const levelElement = document.createElement('div');
  levelElement.className = `level level-${levelStatus} ${isLocked ? 'level-locked' : ''}`;
  levelElement.innerHTML = `
    <div class="level-title">
      <div class="level-image">
        <img src="${levelData.imageUrl}" alt="${levelData.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      ${levelData.name}
      <span class="level-status status-${levelStatus}">
        ${isLocked ? `Disponible en ${formatDate(unlockDate)}` : 
          levelStatus === 'completed' ? 'Completado' : 
          levelStatus === 'in-progress' ? 'En curso' : 'Pendiente'}
      </span>
    </div>
    <p class="level-description">${levelData.description}</p>
  `;
  elements.timeline.appendChild(levelElement);
}

function renderMilestone(milestone, currentLevelInTimeline) {
  const levelStatus = getLevelStatus(currentLevelInTimeline);
  const milestoneElement = createMilestoneElement(milestone, levelStatus);
  milestoneElement.id = `milestone-${milestone.id}`;
  elements.timeline.lastElementChild.appendChild(milestoneElement);

  if (milestone.status === 'completed') {
    state.totalPoints += milestone.points;
  }
}

function createMilestoneElement(milestone, levelStatus) {
  const milestoneElement = document.createElement('div');
  milestoneElement.className = 'milestone';
  const isClickable = (milestone.status === 'completed' || levelStatus === 'in-progress') && !milestoneElement.closest('.level-locked');
  milestoneElement.innerHTML = `
    <div class="milestone-header ${isClickable ? 'clickable' : 'non-clickable'}">
      <div class="milestone-icon" style="background-color: ${getStatusColor(milestone.status)}">
        ${getStatusIcon(milestone.status)}
      </div>
      <div>
        <h3 class="milestone-title">${milestone.title} <span class="milestone-points">(${milestone.points} puntos)</span></h3>
        <p class="milestone-description">${milestone.description}</p>
      </div>
    </div>
    ${milestone.imageUrl ? `<img src="${milestone.imageUrl}" alt="${milestone.title}" class="milestone-image">` : ''}
  `;

  if (isClickable) {
    milestoneElement.querySelector('.milestone-header').addEventListener('click', () => openModal(milestone));
  }

  if (levelStatus === 'pending' || milestoneElement.closest('.level-locked')) {
    milestoneElement.querySelectorAll('.milestone-title, .milestone-description, .milestone-image').forEach(el => el.classList.add('blurred-content'));
  }

  return milestoneElement;
}

// Helper functions
function getLevelStatus(level) {
  const levelMilestones = state.milestones.filter(m => m.level === level);
  const allCompleted = level < state.currentLevel || levelMilestones.every(m => m.status === 'completed');
  const allPending = level > state.currentLevel || levelMilestones.every(m => m.status === 'pending');
  return allCompleted ? 'completed' : allPending ? 'pending' : 'in-progress';
}

function updatePointsDisplay() {
  const startDate = new Date(elements.startDate.value);
  const formattedDate = startDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  elements.currentLevel.textContent = `Nivel actual: ${state.currentLevel}`;
  elements.pointsDisplay.textContent = `Puntos totales: ${state.totalPoints}`;
  elements.currentDate.textContent = `Fecha inicio: ${formattedDate}`;
}

function scrollToFirstInProgressLevel() {
  const firstInProgressLevel = document.querySelector('.level-in-progress');
  if (firstInProgressLevel) {
    setTimeout(() => firstInProgressLevel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
  }
}

// Modal functions
function openModal(milestone) {
  const contentTypes = {
    'video': `
      <h2>${milestone.title}</h2>
      <div class="video-container">
        <video class="video" controls>
          <source src="${milestone.videoUrl}" type="video/mp4">
          Tu navegador no soporta el elemento de video.
        </video>
      </div>`,
    'web': `
      <h2>${milestone.title}</h2>
      <iframe src="${milestone.webURL}" width="100%" height="400" frameborder="0"></iframe>`,
    'default': `
      <h2>${milestone.title}</h2>
      <p>${milestone.content}</p>
      ${milestone.imageUrl ? `<img src="${milestone.imageUrl}" alt="${milestone.title}" class="milestone-image">` : ''}
      <a href="${milestone.url}" target="_blank" class="modal-button">Más información</a>`
  };

  elements.modalContent.innerHTML = contentTypes[milestone.type] || contentTypes['default'];
  elements.modal.style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadData);

document.querySelector('.close').addEventListener('click', () => elements.modal.style.display = 'none');

window.addEventListener('click', (event) => {
  if (event.target === elements.modal) {
    elements.modal.style.display = 'none';
  }
});

// Popup functions
function togglePopup() {
  elements.popup.classList.toggle('visible');
  elements.overlay.classList.toggle('visible');
}

function closePopup(event) {
  if (event) event.stopPropagation();
  elements.popup.classList.remove('visible');
  elements.overlay.classList.remove('visible');
}

function toggleBlur(event) {
  event.stopPropagation();
  document.querySelectorAll('.blurred-content, .level-locked .milestone').forEach(element => {
    element.style.filter = element.style.filter === 'none' ? 'blur(1px)' : 'none';
  });
}

// Mobile menu functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('navbarMenuMobile');
  mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
}

function menuItemSelected(section) {
  toggleMobileMenu();
  switch (section) {
    case 'desarrollo':
    case 'cursos':
      toggleModal('cursosModal');
      break;
    case 'logros':
      toggleModal('achievementsModal');
      break;
    case 'recompensas':
      toggleModal('recompensasModal');
      break;
    case 'config':
      toggleModal('configModal');
      break;
      
    case 'usuario':
      toggleUserModal();
      break;
  }
}

function showSection(section) {
  alert('Mostrando la sección: ' + section);
}

function toggleModal(modalId) {
  const iframe = document.getElementById('iframecurso');
  iframe.src = iframe.src;
  const modal = document.getElementById(modalId);
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function toggleUserModal() {
  const userModal = document.getElementById('userModal');
  document.getElementById('userCurrentLevel').textContent = elements.currentLevel.textContent;
  document.getElementById('userPoints').textContent = elements.pointsDisplay.textContent;
  document.getElementById('userStartDate').textContent = elements.currentDate.textContent;
  userModal.style.display = userModal.style.display === 'block' ? 'none' : 'block';
}

// Close modals when clicking outside
window.onclick = function(event) {
  ['achievementsModal', 'userModal'].forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};
