/**
 * panel.js
 * 
 * @auteur     marc laville
 * @Copyleft 2013-2015
 * @date       13/12/2013
 * @version    0.2.0
 * @revision   $8$
 *
 * Fonction generique de création de fenetre et menu
 *
 * @date   revision   marc laville  03/02/2015 Gestion de la fenêtre active grace au bouton radio avant le titre de la fenêtre
 * @date   revision   marc laville  04/02/2015 Gestion de la fenetre principale ; ajout du contenaire
 * @date   revision   marc laville  08/02/2015 : menuFactory
 * @date   revision   marc laville  27/02/2015 : btnClose remplace divClose
 * @date   revision   marc laville  01/03/2015 : revise le mécanisme de mise au premier plan
 * @date   revision   marc laville  16/03/2015 : nettoyage du code
 * @date   revision   marc laville  19/03/2015 : nouvelle methode createDomPanel + gestion du decalage de position à la creation de la fenetre
 * @date   revision   marc laville  19/06/2015 : Modifie de bouton close quand la fenetre est éditée
 *
 * A faire : case de miniaturisation, plein ecran
 *
 Ext.create('Ext.window.Window', {
    title: 'Hello',
    height: 200,
    width: 400,
    layout: 'fit',
    items: {  // Let's put an empty grid in just to illustrate fit layout
        xtype: 'grid',
        border: false,
        columns: [{header: 'World'}],                 // One header just for show. There's no data,
        store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
    }
}).show();
 * 
 */
var winManager = (function (document) {
	var contenaire = document.getElementById("workSpace") || document.body,
		listDivWindows = {},
		rdFrontWindows = null,
		/**
		 * Réponse à un click sur une fenêtre
		 * On passe le form contenant la fenêtre (this) au premier plan
		 * this : le form
		 * e.target : le input radio contenu dans la fenêtre
		 * e.target.parentNode.parentNode : la fenêtre (div .fenetre)
		 */
		changeKeyWindows = function(e) {
		
			var rd = e.target,
				win = rd.parentNode.parentNode,
				listWin = listDivWindows[ rd.getAttribute('name') ],
				lastDiv = contenaire.lastChild;
			
			if(lastDiv !== listWin ) {
				contenaire.appendChild( contenaire.removeChild(listWin) );
			}
			if( rdFrontWindows != null ) {
				rdFrontWindows.checked = false;
			}
			rdFrontWindows = rd;
			
			return listWin.appendChild( listWin.removeChild(win) );
		},
		addListWindows = function( nomApp ) {
			var formRd = contenaire.appendChild( document.createElement("form") );
			
			formRd.setAttribute( 'name', nomApp );
			formRd.addEventListener( "change", changeKeyWindows );
			
			listDivWindows[ nomApp ] = contenaire.appendChild( document.createElement("section") );
			
			return listDivWindows[ nomApp ];
		},
		quitApp = function( nomApp ) {
			var formApp = document.forms[nomApp];
			if( formApp != undefined ){
				formApp.parentNode.removeChild(formApp);
			}
			
			return contenaire.removeChild( listDivWindows[ nomApp ] );
		},
		/**
		 * Ajout d'une fenêtre
		 * win : div.fenetre
		 * nomApp : string le nom du formulaire associé
		 */
		addWindow = function( win, nomApp ) {
			nomApp = nomApp || "_";
			
			if( document.forms[nomApp] == undefined ){
				addListWindows( nomApp );
			}
			
			return listDivWindows[ nomApp ].appendChild(win);
		},
		/**
		 * Retourne la fenetre au premier plan 
		 */
		frontWindow = function ( nomApp ) {
			return ( listDivWindows.hasOwnProperty(nomApp) ) ? listDivWindows[ nomApp ].querySelector('.fenetre:last-of-type') : null;
		},
		/**
		 * Création d'une fenêtre
		 */
		createDomFenetre = function ( unTitre, unContenu, nomAppli, param, keepContentOnClose ) {

			return createDomPanel({
						title: unTitre,
						appName:nomAppli,
						item: unContenu,
						keepContentOnClose: keepContentOnClose,
						closable : true,
						frame : param ? { position: {x:param.x, y:param.y}, size: {width:param.width, height:param.height} } : undefined
					});
		},
		posRef = function ( nomAppli ) {
			var pos = { x:120, y:60 };
			
			if( listDivWindows[ nomAppli ] ) {
				var w = listDivWindows[ nomAppli ].lastChild,
					s = w ? w.style : null;
					
				if(s) {
					pos.x = ( parseInt( s.left ) + 20 );
					pos.y = ( parseInt( s.top ) + 20 );
				}
			}
			return pos;
		}, 
		/**
		 * Création d'une fenêtre
		 * Construction de tous les élèments du dom constituant la fenetre
		 */
		createDomPanel = function ( options ) {
			var divFenetre = document.createElement("div"),
				labelRd = divFenetre.appendChild( document.createElement("label") ),
				inputRd = labelRd.appendChild( document.createElement("input") ),
				divTitre = labelRd.appendChild( document.createElement("div") ),
				chkDirty = document.createElement("input"),
				btnClose = document.createElement("button"),
				divContent = labelRd.appendChild( document.createElement("div") ),
				nomAppli = options.appName || '_',
				frame = options.frame || { position: posRef(nomAppli), size: {width:320, height:240} },
				
				closeFenetre = function(e) {
					e.preventDefault();
					if( (options.keepContentOnClose || false) == true ) {
						unContenu.style.display = 'none';
						divFenetre.parentNode.appendChild(unContenu);
					}
					
					return divFenetre.parentNode.removeChild(divFenetre);
				};
				
			inputRd.setAttribute( 'type', 'radio' );
			inputRd.setAttribute( 'name', nomAppli );
			inputRd.setAttribute( 'form', nomAppli );
			inputRd.addEventListener( "change", changeKeyWindows );
			
			/*
			 * positionnement du panel
			 */
			divFenetre.style.left = frame.position.x + 'px';
			divFenetre.style.top = frame.position.y + 'px';
			divFenetre.style.width = frame.size.width + 'px';
			divFenetre.style.height = frame.size.height + 'px';

			divFenetre.className = "fenetre";
			divTitre.className = "titreFenetre";
			btnClose.className = "close";
			divContent.className = "contenuFenetre";

			btnClose.addEventListener( "click", closeFenetre );
			
			chkDirty.setAttribute( 'type', 'checkbox' );
			divTitre.appendChild( chkDirty );
			divTitre.appendChild( btnClose );
			divTitre.appendChild( document.createTextNode(options.title) );
			
			/*
			 * place le conteu de la fenetre
			 */
			if(options.item) {
				divContent.appendChild(options.item);
			}
			
			$(divFenetre).draggable({ handle: '.titreFenetre' });
			divFenetre.style.position = 'fixed';
			
			addWindow(divFenetre, nomAppli);
			inputRd.dispatchEvent( new MouseEvent( "click", { bubbles: true, cancelable: true, view: window } ) );
			
			return divFenetre;
		}

  return {
	createDomPanel: createDomPanel,
	domFenetre : createDomFenetre,
	addListWindows : addListWindows,
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
	
	return winManager.domFenetre( 'Récapitulatif Mensuel d\'Activité', objPdf, null, pos, true );
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