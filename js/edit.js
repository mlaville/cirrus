 var app_edit = {
	// Création d'un post-it
	quitter : function(){
		alert("exit");
	},
	load( path, out ){
		var oXHR = new XMLHttpRequest();

		alert(path);
		oXHR.onreadystatechange=function() {
			var outer = out;
		
			if (oXHR.readyState==4 && oXHR.status==200) {
				outer.textContent = oXHR.responseText;
			}
			
			return false;
		}

		oXHR.open("GET", path);  
//		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
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
/*
		['Fichier', 'Quitter'].forEach(function(item) { 
			menu.appendChild( document.createElement("li") )
				.appendChild( document.createTextNode(item) );
		});
*/
		if( path  != null ) {
		
			alert('path : ' + path );
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