/**
 * lanceur.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       23/01/1012
 * @version    0.01
 * @revision   $0$
 *
 * A faire : ecrire une fonction generique de création de fenetre
 * 
 */

function lanceApp(nomApp){

	switch(nomApp) {
	
	 case 'app_browser' :
		browser();
		break;
		
	 case 'app_edit' :
		edit();
		break;

	 case 'app_postit' :
		app_postit.ajoutPostIt();
		break;

	 case 'app_test' :
		test();
		break;

	default: 
		alert(nomApp);

	}
}

function objetPdf( url ){
	var objPdf = document.createElement("object");
	
	objPdf.setAttribute('data', url);
	objPdf.setAttribute('type', 'application/pdf');
	objPdf.setAttribute('style', 'height:95%; width:100%;');

	return objPdf;
}

function browser(){
	var divBrowser = document.createElement("div");

	divBrowser.className = "corpsAppli";
	$(divBrowser).append('<div id="etagere"><p></p></div>\n<div id="viewPath"></div>\n<div id="browser"></div>');
	
	document.getElementById("workSpace").appendChild( domFenetre("Fichiers", divBrowser) );

	changePath('~');
	
}

function edit(){
	var divEdit = document.createElement("div");
	
	divEdit.innerHTML = 'Hello Word !';
	divEdit.className = "edit";
	divEdit.contentEditable = "true";

	document.getElementById("workSpace").appendChild( domFenetre("Edit", divEdit) );
	
	menu = domMenu("Edit");
	
	menu.appendChild( domItemMenu('Fichier', 'rd_fichier', 'menu_cirrus') );
	menu.appendChild( domItemMenu('Quitter', 'rd_quitter', 'menu_cirrus') );

	['Fichier', 'Quitter'].forEach(function(item) { 
		menu.appendChild( document.createElement("li") )
			.appendChild( document.createTextNode(item) );
	});

	return document.getElementById("workSpace").appendChild( menu );
}

function test(){
	var f = domFenetre("Upload");

	document.getElementById("workSpace").appendChild( f );

		var uploader = new qq.FileUploader({
			element: f.querySelector(".contenuFenetre"),
			action: './php/deskUpload.php?rep=',
			onComplete: function(id, fileName, responseJSON){
				if(responseJSON.success) {
					app_cirrus.listFicBureau();
					app_cirrus.iconFichier(fileName);
				} else {
					alert(fileName);
				}
			},
		});           
	return f;
}