function showSubcategories(divId) {
    document.getElementById('Principal').style.transform = 'translateX(-100%)';
    document.getElementById(divId).style.transform = 'translateX(0)';
}

function showMain() {
    document.getElementById('Principal').style.transform = 'translateX(0)';
    document.getElementById('Div1').style.transform = 'translateX(100%)';
    document.getElementById('Div2').style.transform = 'translateX(100%)';
}
