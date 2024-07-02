function showSubcategories(divId) {
    document.getElementById('Principal').style.transform = 'translateX(-100%)';
    document.getElementById(divId).style.transform = 'translateX(0)';
}

function showMain() {
    document.getElementById('Principal').style.transform = 'translateX(0)';
    document.getElementById('bienvenido-div').style.transform = 'translateX(100%)';
    document.getElementById('vender-div').style.transform = 'translateX(100%)';
    document.getElementById('bienvenido-principios-div').style.transform = 'translateX(100%)';
	
}
