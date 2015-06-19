/**
 * cirrus.js
 * 
 * @auteur marc laville
 * @copyleft 2012
 * @date 17/03/1012
 * @version    0.02
 * @revision   $1$
 *
 * A faire : réécriture pure javascript
 * calcul du chemin root
 * affichage des répertoires
 * sauvegarde du positionnement des icônes sur le bureau
 * lanceur pour fichier video
 *
 * @date   revision   marc laville  29/03/2012 : Gestion des upload
 * @date   revision   marc laville  30/04/2012 : Gestion des dossier ; renommage des fichiers
 * @date   revision   marc laville  04/02/2015 : Gestion des fenetre grace au winManager
  * @date   revision   marc laville  08/02/2015 : gestion du menu par menuFactory
  * @date   revision   marc laville  19/03/2015 : dimensionnement initial du browser
  * @date   revision   marc laville  13/05/2015 : utilise fileApi pour le renommage de fichiers
*
 * definition de l'app cirrus
 */

var app_cirrus = {
	appName : 'cirrus',
	version : '0.3.0',
	root : 'Users/home/vava/-bureau/',
//	home : './Disk/Users/home',
	home : './Users/home',
	wp : document.getElementById("workSpace"), 
	tabExtention : {
		txt : 'txt.png',
		jpg : 'jpeg.png',
		gif : 'gif.png',
		png : 'png.png',
		pdf : 'pdf.png',
		wav : 'wav.png',
		dir : 'dir.png'
	},
	objetPdf : function( url ) {
		var objPdf = document.createElement("object");
		
		objPdf.setAttribute('data', url);
		objPdf.setAttribute('type', 'application/pdf');
		objPdf.setAttribute('style', 'height:95%; width:100%;');

		return objPdf;
	},

	lanceApp : function(nomApp){

		switch(nomApp) {
		
		 case 'app_browser' :
			app_cirrus.construitBrowser();
			break;
		 case 'app_test' :
			test();
			break;

		default: 
			alert(nomApp);

		}
	},
	/*
	 * Chargement d'un fichier par double click sur le bureau ou le browser
	 */
	dblClickFile : function(figure) {
		var chemin = "./Disk/" + figure.querySelector("input[type='hidden']").value + "/",
			nomFichier = figure.querySelector("input").value,
			contenuFenetre = null;
		
		switch( nomFichier.split(".").pop().toLowerCase() ) {
			case 'pdf' :
				contenuFenetre = app_cirrus.objetPdf( chemin + nomFichier );
			break;
					
			case 'bmp' : ;
			case 'gif' : ;
			case 'png' : ;
			case 'jpg' :
				contenuFenetre = document.createElement('img');
				contenuFenetre.setAttribute( "src", chemin + nomFichier );
			break;
			
			case 'css' :
			case 'js' :
			case 'php' :
			case 'xml' :
			case 'txt' :
				app_edit.open( figure.querySelector("input[type='hidden']").value + '/' + nomFichier, document.createElement("div") );
			break;
			
			case 'wav' :
				contenuFenetre = document.createElement("audio");
				contenuFenetre.setAttribute( "controls", "controls" );
				source = contenuFenetre.appendChild( document.createElement("source") );
				source.setAttribute( "type", "audio/wav" );
				source.setAttribute( "src", chemin + nomFichier );
			break;
			
			default:
				alert( "Type de Fichier Inconnu");
		};
		if( contenuFenetre != null ) {
			winManager.createDomPanel({
				title: nomFichier,
				frame: { position: {x: 260, y: 96}, size: {width:980, height:380} },
				appName: 'cirrus',
				item: contenuFenetre
			});
		}
	},
	/**
	 * Rend le champ de saisie actif pour le renommage du fichier
	 */
	saisieLibelle : function(inputElt) {
		var tabPath = inputElt.value.split('.'),
			lgExt = ( tabPath.length > 1 ) ? tabPath.pop().length + 1 : 0;

		inputElt.disabled = false;
		
		inputElt.addEventListener('change', function(e){
			fileApi.rename(this);
		});
		inputElt.setSelectionRange(0, inputElt.value.length - lgExt);
		
		return inputElt.focus();
	},

	/*
	 * Affichage d'un icône par document
	 *  renvoi un element li
	 */
	iconFichier : function(chemin, isDir){
		var tabPath = chemin.split("/"),
			nomFichier = tabPath.pop(),
			extention = nomFichier.split(".").pop(), // Extrait l'extention
			li = document.createElement("li"),
			figure = li.appendChild( document.createElement("figure") ),
			img = figure.appendChild( document.createElement("img") ),
			figcaption = figure.appendChild( document.createElement("figcaption") ),
			input = figcaption.appendChild( document.createElement("input") ),
			hidden = document.createElement("input"),
			disableThis = function(e){ this.disabled = true; return; }; // this est le champ input qui a recu l'evenement
		
		input.setAttribute( 'type', 'text');
		input.setAttribute( 'disabled', "true" );
		input.value = nomFichier;
		input.addEventListener('blur', disableThis);
		
		figcaption.appendChild( document.createElement("p") ).textContent = nomFichier;

		hidden.setAttribute( 'type', 'hidden');
		hidden.value = tabPath.join('/'); //chemin;
		figcaption.appendChild( hidden );
		
		/*
		 * Gestion du doubleClick sur le libellé
		 * rend le champ input enable -> visible
		 */
		figcaption.addEventListener('dblclick', function(){
			return app_cirrus.saisieLibelle( this.querySelector("input") );
		});		
		
		if (typeof isDir === 'undefined') { 
		   isDir = false;
		}
		
		img.setAttribute( 'src', './css/images/docs/' + ( isDir ? 'dossier.png' : ( app_cirrus.tabExtention[ extention.toLowerCase() ] || 'defaultIcon.png') ) );

		$(figure).draggable({
			zIndex: 100,
			cancel: 'figcaption'

	//		, containment: "parent"
		});
		
		figure.querySelector("img").addEventListener('dblclick', function(){
			app_cirrus.dblClickFile(this.nextSibling, isDir);
		});
		
		li.dataset.chemin = tabPath.join('/');
		
		return li;
	},
	
	/*
	 * Charge le répertoire du bureau pour afficher les icones
	 */
	listFicBureau : function( data ){
		var ulBureau = document.getElementById("bureau");
		
		while (ulBureau.firstChild) {
		  ulBureau.removeChild(ulBureau.firstChild);
		}
		
		data.result.forEach(function( item, index, array ){
		   ulBureau.appendChild( app_cirrus.iconFichier( app_cirrus.root + item.nom ) );
		});
	},

	upload : function(){
		var divUpload = document.createElement("div"),
			listFicBureau = this.listFicBureau,
			uploader = new qq.FileUploader({
				element: divUpload,
				action: './php/deskUpload.php?rep=',
				onComplete: function(id, fileName, responseJSON){
					if(responseJSON.success) {
					//	alert(fileName + '\nok');
						$.getJSON( 'php/browser.php',  { path: "~/-bureau" }, app_cirrus.listFicBureau );
					} else {
						alert(fileName + '\nerreur');
					}
				},
				fileTemplate: '<li>' +
						'<span class="qq-upload-file"></span>' +
						'<span class="qq-upload-spinner"></span>' +
						'<button class="qq-upload-cancel" type="button"></button>' +
						'<progress class="qq-upload-progress"></progress>' +
						'<div class="qq-upload-size"></div>' +
					'</li>',
				classes: {
					// used to get elements from templates
					button: 'qq-upload-button',
					drop: 'qq-upload-drop-area',
					dropActive: 'qq-upload-drop-area-active',
					list: 'qq-upload-list',
								
					file: 'qq-upload-file',
					spinner: 'qq-upload-spinner',
					size: 'qq-upload-size',
					progress: 'qq-upload-progress',
					cancel: 'qq-upload-cancel',

					// added to list item when upload completes
					// used in css to hide progress spinner
					success: 'qq-upload-success',
					fail: 'qq-upload-fail'
				}
			});           

		return winManager.domFenetre('Upload', divUpload, 'cirrus' );
	},
	// Affichage de la fenêtre info
	info : function(){
		var element = document.createElement("div");
		
		element.setAttribute('id', 'div_infoCirrus');
		element.innerHTML = '<div class="cirrus">cirrus</div>'
			+ '<h1>cirrus'
			+ '<span><label for="input_version">version</label><input id="input_version" name="numVersion" value="'
			+ app_cirrus.version 
			+ '"></span></h1>'
			+ '<h2>Espace en ligne</h2>'
			+ '<span>Votre bureau dans les nuages</span><span id="auteur"><small>par</small> <a>marc laville</a></span>'
			+ '<hr>'
			+ '<p id="copyleft">Copyleft 2015</p>'
			+ '<div style="border-style: inset; background-color: white;">'
			+ '</div>';
		
		return element;
	},
	construitBrowser : function() {
		var divBrowser = document.createElement("div");

		divBrowser.className = "corpsAppli";
		divBrowser.innerHTML = '<div id="etagere"><p></p></div>\n<div id="viewPath"></div>\n<div id="browser"></div>';

		app_cirrus.browser = winManager.createDomPanel({
			title: 'Fichiers',
			frame: { position: {x: 260, y: 96}, size: {width:980, height:380} },
			appName: 'cirrus',
			item: divBrowser
		});

		changePath('~');

		return app_cirrus.browser;
	},
	/*
	 * menu de l'application
	 */
	appMenu : function(){
		var menuApp = menuFactory.domMenu("Cirrus"),
			itemFichier = menuFactory.domItemMenu( 'Fichier', 'cirrus', function(){} ),
			menuFichier = menuFactory.domMenu("Fichier");
			
		menuFactory.addItem( menuApp, menuFactory.domItemMenu(
			'Info', 'cirrus',
			function(){
				return winManager.createDomPanel({
					title: 'Info',
					frame: { position: {x: 160, y: 60}, size: {width:600, height:280} },
					appName: 'cirrus',
					item: app_cirrus.info()
				});
			})
		);
		
		menuFactory.addItem( menuApp, itemFichier );
		
		menuFactory.addItem( menuApp, menuFactory.domItemMenu(
				'Quitter', 'cirrus', function(){
				app_cirrus.quit();
			})
		);
		
		menuFactory.addItem( menuFichier, menuFactory.domItemMenu(
			'Upload', 'fichier', this.upload
			)
		);
		menuFactory.addItem( menuFichier, menuFactory.domItemMenu(
			'Nouveau Dossier', 'fichier', function(){
				fileApi.nouveauDossier();
			})
		);
		
		menuFactory.addSubMenu(	menuFichier,  itemFichier);

		return menuApp;
	},

	sauvParam : function(){
		var style = getComputedStyle( app_cirrus.browser ),
			p = {
				x : style.getPropertyValue("left"),
				y : style.getPropertyValue("top"),
				width : style.getPropertyValue("width"),
				height : style.getPropertyValue("height"),
			},
			strJson = JSON.stringify(p),
			oXHR = new XMLHttpRequest();

		oXHR.open("POST", "./php/sauvParam.php");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send( "param=" + strJson );
	},
	makeFront : function(){
		
	},
	liDock : function(){
		var li = document.createElement("li"),
			div = li.appendChild( document.createElement("div") );
		
		div.className = 'cirrus';
		div.textContent = this.appName;

		return li;
	},
	init : function( ul ){
		var formRd = winManager.addListWindows( this.appName );
		
		formRd.appendChild( this.appMenu() );
		
		/* Affichage du browser*/
		this.construitBrowser();
		
	/*
	 * Charge le répertoire du bureau pour afficher les icones
	 */
		$.getJSON( 'php/browser.php',  { path: "~/-bureau" }, this.listFicBureau );

		return ul.insertBefore(this.liDock(), ul.firstChild );
	},
	/*
	 * quitte l'application
	 */
	quit : function(){
//		winManager.addListWindows( this.appName );
		
		app_postit.sauvListPostIt();
		winManager.quitApp( this.appName );
		this.sauvParam();
		loginManager.deconnecte();
	}
}
