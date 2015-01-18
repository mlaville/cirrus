/**
 * panel.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       26/01/1012
 * @version    0.01
 * @revision   $0$
 *
 * Fonction generique de création de fenetre et menu
 * 
 * @date   revision   marc laville  27/02/2012 : case de fermeture
 *
 * A faire : case de miniaturisation, plein ecran
 * 
 */

function domFenetre(unTitre, unContenu, param) {
	var divFenetre = document.createElement("div");
	
	if( param != undefined ) {
		divFenetre.style.left = param.x;
		divFenetre.style.top = param.y;
		divFenetre.style.width = param.width;
		divFenetre.style.height = param.height;
	}
	divFenetre.className = "fenetre";
	t = divFenetre.appendChild( document.createElement("div") );
	t.className = "titreFenetre";
	
	c = t.appendChild( document.createElement("div") );
	c.className = "closeFenetre";
	c.appendChild( document.createTextNode("X") );
	c.addEventListener("click", function() {
			divFenetre.parentNode.removeChild(divFenetre);
		}, false
	);

	t.appendChild( document.createTextNode(unTitre) );
	
	t = divFenetre.appendChild( document.createElement("div") );
	t.className = "contenuFenetre";

	contenuFenetre = divFenetre.querySelector(".contenuFenetre");
	if(unContenu) {
		contenuFenetre.appendChild(unContenu);
	}
	$(divFenetre).draggable({ handle: '.titreFenetre' });

	return divFenetre;
}

function domItemMenu(unTitre, nomMenu, action) {
	var item = document.createElement("li");
	var input = item.appendChild(document.createElement("input"));
	var label = item.appendChild(document.createElement("label"));
	
	input.setAttribute( 'type', 'radio' );
	input.setAttribute( 'name', nomMenu );
	input.setAttribute( 'id', nomMenu + '-' + unTitre );
	
	label.setAttribute( 'for', nomMenu + '-' + unTitre );
	label.appendChild( document.createTextNode(unTitre) );
	
	if( action !== undefined ) {
//		item.addEventListener('click', action);
		input.addEventListener('change', action);
	}

	return item;
}

function domMenu(unTitre) {
	var menu = document.createElement("menu");
	
	menu.appendChild( document.createElement("div") )
		.appendChild( document.createTextNode(unTitre) );

	$(menu).draggable({ handle: 'div' });

	return menu;
}