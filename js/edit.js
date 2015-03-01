 /**
 * edit.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       27/01/2015
 * @version    0.1
 * @revision   $0$
 *
 * module app_edit
 * Affichage et modification des fichiers txt
 *
 * @date   revision   marc laville  02/02/2015 trame de la methode sauve
 * @date   revision   marc laville  04/02/2015 : Gestion des fenetre grace au winManager
 * @date   revision   marc laville  08/02/2015 : gestion du menu par menuFactory
 * @date   revision   marc laville  10/02/2015 : Enregistrement du ficjier txt
 * @date revision marc laville 17/02/2015 : Edition -> pdf
 *
 * A faire
 * - memoriser le focus (selection) lorsqu'il est perdu par le passage sur une autre fenetre
 * - gerer le quit de l'appli
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
 /*
 http://codepen.io/polinux/pen/Bywjeq
 */
var app_edit = {
	appName : 'edit',
	arrWindows : [],
	quitter : function(){
		alert("exit");
	},
	keyWindow( ) {
		return 
		
	},
	//--- Chargement d'un fichier texte
	load( path, out ){
		var oXHR = new XMLHttpRequest();

		oXHR.onreadystatechange=function() {

			if (oXHR.readyState==4 && oXHR.status==200) {
				out.innerHTML = oXHR.responseText;
			}
			
			return false;
		}

		oXHR.open('GET', './services/loadFile?path=' + path);
		oXHR.send( );
	},
	sauve : function( path, texte, target ){
		var oXHR = new XMLHttpRequest();

		oXHR.onreadystatechange=function() {

			if (oXHR.readyState==4 && oXHR.status==200) {
				target.checked=false;
				alert( oXHR.responseText );
			}
			
			return false;
		}
		oXHR.open("POST", "./services/saveFile");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
		return oXHR.send( 'path=' + path + '&str=' + texte );
	},
//	sauveFrontDoc : function( e ){
//		var frontWindow = winManager.frontWindow( app_edit.appName );
		
//		return app_edit.sauve( frontWindow.dataset.path, frontWindow.querySelector( '.edit' ).innerHTML );
//	},
	imprime: function( texte, target ){
		var doc = new jsPDF(),
			pos = { x:'5%', y:'120px', width:'880px', height: '420px' },
			objPdf = document.createElement('object'),
			margin = 2.5,
			verticalOffset = margin,
			size = 12;

		doc.setDrawColor(0, 255, 0)
			.setLineWidth(1/72)
			.line(margin, margin, margin, 11 - margin)
			.line(8.5 - margin, margin, 8.5-margin, 11-margin)
		lines = doc.setFont('Courier','')
			.setFontSize(12)
			.splitTextToSize(texte, 180);
		doc.text(2.5, verticalOffset + size / 72, lines);
		// doc.text(20, 20, texte);
		objPdf.setAttribute('type', 'application/pdf');
		objPdf.setAttribute('width', '100%');
		objPdf.setAttribute('height', '100%');
		objPdf.setAttribute('data', doc.output('datauristring'));
		
		return winManager.domFenetre( 'Edition', objPdf, 'pdf', pos );
	},
	open : function( path ){
		var divEdit = document.createElement("div"),
			winTxt = winManager.domFenetre( 'Edit - ' + ( path || 'Nouveau document' ), divEdit, this.appName );
		
		divEdit.className = "edit";
		divEdit.contentEditable = "true";

		if( path != null ) {
			this.load( path, divEdit )
			winTxt.dataset.path = path;
		} else {
//			divEdit.innerHTML = 'Hello Word !';
			winTxt.dataset.path = 'Users/home/vava/-bureau/Nouveau document.txt';
		}
		
		return this.arrWindows.push( winTxt );
	},
	nouveauDoc : function( evt ){
		var gereMenu = function( ) {
			evt.target.checked = false;
		}
		app_edit.open( null );
		window.setTimeout(gereMenu, 500);
	},
	appMenu : function(){
		var menuApp = menuFactory.domMenu("Edit"),
			itemFichier = menuFactory.domItemMenu( 'Fichier', 'edit' ),
			menuFichier = menuFactory.domMenu("Fichier"),
			impFrontDoc = function( app ) {
				return function( e ) {
					var frontWindow = winManager.frontWindow( app.appName );
					return app.imprime( frontWindow.querySelector( '.edit' ).innerHTML.replace( /<br>/g, '\n' ), e.target );
				}
			};
			sauveFrontDoc = function( app ) {
				return function( e ) {
					var frontWindow = winManager.frontWindow( app.appName );
					return app.sauve( frontWindow.dataset.path, frontWindow.querySelector( '.edit' ).innerHTML, e.target );
				}
			};
		menuFactory.addItem( menuApp, itemFichier );
		menuFactory.addItem( menuApp, menuFactory.domItemMenu( 'Imprimer', 'edit', impFrontDoc(this) ) );
		menuFactory.addItem( menuApp, menuFactory.domItemMenu( 'Quitter', 'edit', this.quit ) );
		menuFactory.addItem( menuFichier, menuFactory.domItemMenu( 'Nouveau', 'fichier', this.nouveauDoc ) );
		menuFactory.addItem( menuFichier, menuFactory.domItemMenu( 'Sauver', 'fichier', sauveFrontDoc(this) ) );
		menuFactory.addSubMenu( menuFichier, itemFichier);
		return menuApp;
	},
	liDock : function(){
		var li = document.createElement("li"),
			img = li.appendChild( document.createElement("img") );
		
		img.setAttribute('src', './css/images/edit.png');
		li.addEventListener( 'dblclick', this.nouveauDoc );
		
		return li;
	},
	init : function( ul ){
		var formRd = winManager.addListWindows( this.appName );
		
		formRd.appendChild( this.appMenu() );

		return ul.appendChild( this.liDock() );
	},
	/*
	 * quitte l'application
	 */
	quit : function(){
		/**
		 * teste la sauvegarde des documents
		 */
		return;
	}
	
}