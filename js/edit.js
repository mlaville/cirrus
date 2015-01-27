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
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var app_edit = {
	quitter : function(){
		alert("exit");
	},
	load( path, out ){
	//--- Chargement d'un fichier texte
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
	open : function( path ){
		var divEdit = document.createElement("div");
		
		divEdit.className = "edit";
		divEdit.contentEditable = "true";

		document.getElementById("workSpace").appendChild( domFenetre('Edit - ' + ( path || 'Nouveau document' ), divEdit) );
		
		menu = domMenu("Edit");
		
		menu.appendChild( domItemMenu('Fichier', 'rd_fichier', this.quitter) );
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