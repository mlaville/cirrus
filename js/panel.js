/**
 * panel.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-2015
 * @date       13/12/2013
 * @version    0.10
 * @revision   $0$
 *
 * Fonction generique de création de fenetre et menu
 *
 * @date   revision   marc laville  03/02/2015 Gestion de la fenêtre active grace au bouton radio avant le titre de la fenêtre
 * @date   revision   marc laville  04/02/2015 Gestion de la fenetre principale ; ajout du contenaire
 * @date   revision   marc laville  08/02/2015 : menuFactory
 *
 * A faire : case de miniaturisation, plein ecran
 * 
 */
var winManager = (function (document) {
	var contenaire = document.getElementById("workSpace") || document.body,
//		listWindows = {},
		/**
		 * Réponse à un click sur une fenêtre
		 * On passe le form contenant la fenêtre (this) au premier plan
		 * this : le form
		 * e.target : le input radio contenu dans la fenêtre
		 * e.target.parentNode.parentNode : la fenêtre (div .fenetre)
		 */
		changeKeyWindows = function(e, formThis) {
			var forms = formThis.parentNode.querySelectorAll('form'),
				lastForm = forms[forms.length - 1],
				inputRd = e.target,
				win = formThis.removeChild(e.target.parentNode.parentNode);
			
//			if(lastForm !== formThis && lastForm.lastChild != undefined) {
			if( lastForm !== formThis ) {
				if( lastForm.lastChild != undefined ) {
					lastForm.lastChild.firstChild.firstChild.checked = false;
				}
				formThis.parentNode.appendChild( formThis.parentNode.removeChild(formThis) );
			}
			
			return formThis.appendChild(win);
		},
		clickWindow = function(e) {
			var rd = e.target;
			
			return ( rd.classList.contains('rdFenetre') ) ? changeKeyWindows( e, this ) : null;
		},
		addListWindows = function( nomApp ) {
			var formRd = contenaire.appendChild( document.createElement("form") );
			
			formRd.setAttribute( 'name', nomApp );
			formRd.addEventListener( "change", clickWindow );
			
			return formRd;
		},
		removeListWindows = function(nomApp) {
			var formApp = document.forms[nomApp];
			
			return ( formApp != undefined ) ? null : formApp.parentNode.removeChild(formApp)
		},
		quitApp = function( nomApp ) {
			var formApp = document.forms[nomApp];
			if( formApp != undefined ){
				formApp.parentNode.removeChild(formApp);
			}
		},
		/**
		 * Ajout d'une fenêtre
		 * win : div.fenetre
		 * nomApp : string le nom du formulaire associé
		 */
		addWindow = function( wn, win, nomApp ) {
			nomApp = nomApp || "_";
			
			if( document.forms[nomApp] == undefined ){
				wn.addListWindows( nomApp );
			}
			
			return document.forms[nomApp].appendChild(win);
		},
		frontWindow = function ( nomApp ) {
			var formApp = document.forms[nomApp];
			
			return (formApp != null) ? formApp.querySelector('.fenetre:last-of-type') : null;
		},
		/**
		 * Création d'une fenêtre
		 * Construction de tous les élèments du dom constituant la fenetre
		 */
		createDomFenetre = function ( unTitre, unContenu, nomAppli, param, keepContentOnClose ) {
			var divFenetre = document.createElement("div"),
				labelRd = divFenetre.appendChild( document.createElement("label") )
				inputRd = labelRd.appendChild( document.createElement("input") ),
				divTitre = labelRd.appendChild( document.createElement("div") ),
				divClose = document.createElement("div"),
	//			divClose = document.createElement("button"),
				divContent = labelRd.appendChild( document.createElement("div") );

			inputRd.setAttribute( 'type', 'radio' );
			inputRd.setAttribute( 'name', nomAppli || '_' );
			
			if( param != undefined ) {
				divFenetre.style.left = param.x;
				divFenetre.style.top = param.y;
				divFenetre.style.width = param.width;
				divFenetre.style.height = param.height;
			}
			divFenetre.className = "fenetre";
			divTitre.className = "titreFenetre";
			divClose.className = "closeFenetre";
			divContent.className = "contenuFenetre";
			inputRd.className = "rdFenetre";
			
			divClose.textContent = "X";
			divClose.addEventListener("click", function() {
			
					if( (keepContentOnClose || false) == true ) {
						unContenu.style.display = 'none';
						divFenetre.parentNode.appendChild(unContenu);
					} else {
					}
					return divFenetre.parentNode.removeChild(divFenetre);
					
				}, false
			);
			
			divTitre.appendChild( divClose );
			divTitre.appendChild( document.createTextNode(unTitre) );
			if(unContenu) {
				divContent.appendChild(unContenu);
			}
			
			$(divFenetre).draggable({ handle: '.titreFenetre' });
			divFenetre.style.position = 'fixed';
			
			addWindow( this, divFenetre, nomAppli);
			inputRd.dispatchEvent( new MouseEvent( "click", { bubbles: true, cancelable: true, view: window } ) );
			
			return divFenetre;
		}

  return {
	domFenetre : createDomFenetre,
	// listeFenetres : listDomFenetres,
	addListWindows : addListWindows,
	removeListWindows : removeListWindows,
	quitApp:quitApp,
	frontWindow : frontWindow
  };
}(window.document));

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

function domFenetrePdf(chainePDF, unTitre) {
	var pos = { x:'5%', y:'120px', width:'880px', height: '420px' },
		objPdf = document.createElement('object');

	objPdf.setAttribute('type', 'application/pdf');
	objPdf.setAttribute('width', '100%');
	objPdf.setAttribute('height', '100%');
	objPdf.setAttribute('data', chainePDF);
	
	return winManager.domFenetre( 'Récapitulatif Mensuel d\'Activité', objPdf, pos, true );
}

var menuFactory = (function (document) {
	var	domMenu = function(unTitre) {
			var menu = document.createElement("nav");

			menu.appendChild( document.createElement("h4") )
				.textContent = unTitre;
			menu.appendChild( document.createElement("ul") )
			$(menu).draggable({ handle: 'h4' });

			return menu;
		},
		domItemMenu = function(unTitre, nomMenu, action) {
			var label = document.createElement("label"),
				input = label.appendChild(document.createElement("input"));
				span = label.appendChild(document.createElement("span"));
			
			input.setAttribute( 'type', 'radio' );
			input.setAttribute( 'name', 'menu_' + nomMenu );
			
			span.textContent = unTitre;
			
			if( action !== undefined ) {
				input.addEventListener('change', action);
			}
			return label;
		},
		addItem = function(unMenu, unItem) {
			return unMenu.querySelector('ul').appendChild(document.createElement("li")).
				appendChild(unItem);
		},
		addSubMenu = function(unMenu, unItem) {
			unItem.className = 'sous-menu';
			
			return unItem.appendChild(unMenu);
		}
		
  return {
	domMenu : domMenu,
	domItemMenu : domItemMenu,
	addItem : addItem,
	addSubMenu : addSubMenu
  };
}(window.document));

