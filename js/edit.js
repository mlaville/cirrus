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
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
 /*
 http://codepen.io/polinux/pen/Bywjeq
 */
var app_edit = {
	arrWindows : [],
	quitter : function(){
		alert("exit");
	},
	load( path, out ){
	//--- Chargement d'un fichier texte
		var oXHR = new XMLHttpRequest(),
			divEdit = document.createElement("div");
			
		
		divEdit.className = "edit";
		divEdit.contentEditable = "true";
		
		out.appendChild( divEdit );

		oXHR.onreadystatechange=function() {

			if (oXHR.readyState==4 && oXHR.status==200) {
				divEdit.innerHTML = oXHR.responseText;
			}
			
			return false;
		}

		oXHR.open('GET', './services/loadFile?path=' + path);
		oXHR.send( );
	},
	sauve : function( path, texte ){
		var oXHR = new XMLHttpRequest();

		oXHR.open('POST', './services/loadFile?path=' + path);
		oXHR.send( );
	},
	open : function( path ){
		var divEdit = document.createElement("div");
			menu = domMenu("Edit");
			itemFichier = menu.appendChild( domItemMenu( 'Fichier', 'menu_fichier', function(){} ) )
			menuFichier = domMenu("Fichier");
		
		menuFichier.appendChild( domItemMenu('nouveau', 'menu_nouveau', function(){ }) );
		menuFichier.appendChild( domItemMenu('sauver', 'menu_sauver', function(){ }) );
		divEdit.className = "edit";
		divEdit.contentEditable = "true";

//		this.arrWindows.push( document.getElementById("workSpace").appendChild( domFenetre( 'Edit - ' + ( path || 'Nouveau document' ), divEdit ) ) );
		this.arrWindows.push( winManager.domFenetre('Edit - ' + ( path || 'Nouveau document' ), divEdit, 'edit' ) );
		
		itemFichier.querySelector("label").classList.add("sous-menu");
		itemFichier.appendChild(menuFichier);

//		menu.appendChild( domItemMenu('Fichier', 'rd_fichier', this.quitter) );
		menu.appendChild( domItemMenu('Quitter', 'rd_quitter', this.quitter) );

		if( path != null ) {
			this.load( path, divEdit )
		} else {
			divEdit.innerHTML = 'Hello Word !';
		}
		return document.getElementById("workSpace").appendChild( menu );
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
		return ul.appendChild( this.liDock() );
	}
}