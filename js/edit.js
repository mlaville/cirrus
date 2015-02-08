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
	//--- Chargement d'un fichier texte
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
	sauve : function( path, texte ){
		var oXHR = new XMLHttpRequest();

		oXHR.onreadystatechange=function() {

			if (oXHR.readyState==4 && oXHR.status==200) {
				alert( oXHR.responseText );
			}
			
			return false;
		}
		oXHR.open("POST", "./services/saveFile");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send( "str=" + this.listPostIt() );
	},
	open : function( path ){
		var divEdit = document.createElement("div");
		
		divEdit.className = "edit";
		divEdit.contentEditable = "true";

		if( path != null ) {
			this.load( path, divEdit )
		} else {
			divEdit.innerHTML = 'Hello Word !';
		}
		return this.arrWindows.push( winManager.domFenetre('Edit - ' + ( path || 'Nouveau document' ), divEdit, 'edit' ) );
	},
	appMenu : function(){
		var menuApp = menuFactory.domMenu("Edit"),
			itemFichier = menuFactory.domItemMenu( 'Fichier', 'edit', function(){} ),
			menuFichier = menuFactory.domMenu("Fichier");
			
		menuFactory.addItem( menuApp, itemFichier );
		
		menuFactory.addItem( menuApp, menuFactory.domItemMenu(
				'Quitter', 'edit', function(){
				app_cirrus.quit();
			})
		);
		
		menuFactory.addItem( menuFichier, menuFactory.domItemMenu( 'Nouveau', 'fichier', function(){ alert('nouveau'); } ) );
		menuFactory.addItem( menuFichier, menuFactory.domItemMenu( 'Sauver', 'fichier', function(){ alert('Sauver'); } ) );
		menuFactory.addSubMenu(	menuFichier,  itemFichier);

		return menuApp;
	},
	appMenuOld : function(){
		var	menu = domMenu("Edit"),
			itemFichier = menu.appendChild( domItemMenu( 'Fichier', 'menu_fichier', function(){app_edit.open( null );} ) ),
			menuFichier = domMenu("Fichier");
			
		menuFichier.appendChild( domItemMenu('nouveau', 'menu_nouveau', function(){ }) );
		menuFichier.appendChild( domItemMenu('sauver', 'menu_sauver', function(){ }) );
		itemFichier.querySelector("label").classList.add("sous-menu");
		itemFichier.appendChild(menuFichier);

//		menu.appendChild( domItemMenu('Fichier', 'rd_fichier', this.quitter) );
		menu.appendChild( domItemMenu('Quitter', 'rd_quitter', this.quitter) );

		return menu;
	},
	liDock : function(){
		var li = document.createElement("li"),
			img = li.appendChild( document.createElement("img") );
		
		img.setAttribute('src', './css/images/edit.png');
		li.addEventListener( 'dblclick', function(e) {
			app_edit.open( null );
		});
		
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
		document.getElementById("workSpace").removeChild( app_cirrus.menu );
				app_postit.sauvListPostIt();
				app_cirrus.sauvParam();
				deconnecte();
	}
	
}