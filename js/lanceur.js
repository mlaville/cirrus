/**
 * lanceur.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       23/01/1012
 * @version    0.05
 * @revision   $0$
 *
 * @date   revision   marc laville  27/01/2015 ne gere plus les acces aux post-its et .txt
 * 
 */

function lanceApp(nomApp){

	switch(nomApp) {
	
	 case 'app_browser' :
		app_cirrus.construitBrowser();
//		browser();
		break;
		
/*	 case 'app_edit' :
		edit();
		break;

	 case 'app_postit' :
		app_postit.ajoutPostIt();
		break;
*/
	 case 'app_test' :
		test();
		break;

	default: 
		alert(nomApp);

	}
}
/*
function objetPdf( url ){
	var objPdf = document.createElement("object");
	
	objPdf.setAttribute('data', url);
	objPdf.setAttribute('type', 'application/pdf');
	objPdf.setAttribute('style', 'height:95%; width:100%;');

	return objPdf;
}
*/
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