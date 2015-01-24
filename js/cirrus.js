/**
 * cirrus.js
 * 
 * @auteur marc laville
 * @copyleft 2012
 * @date 17/03/1012
 * @version    0.02
 * @revision   $1$
 *
 * A faire : r��criture pure javascript
 * calcul du chemin root
 * affichage des r�pertoires
 * sauvegarde du positionnement des ic�nes sur le bureau
 * lanceur pour fichier video
 *
 * @date   revision   marc laville  29/03/2012 : Gestion des upload
 * @date   revision   marc laville  30/04/2012 : Gestion des dossier ; renommage des fichiers
 *
 * definition de l'app cirrus
 */


var app_cirrus = {
	version : 0.1,
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
	
	objetPdf : function( url ){
		var objPdf = document.createElement("object");
		
		objPdf.setAttribute('data', url);
		objPdf.setAttribute('type', 'application/pdf');
		objPdf.setAttribute('style', 'height:95%; width:100%;');

		return objPdf;
	},

	/*
	 * Chargement d'un fichier par double click sur le bureau ou le browser
	 */
	dblClickFile : function(figure) {
		var chemin = "./Disk/" + figure.querySelector("input[type='hidden']").value + "/",
			nomFichier = figure.querySelector("input").value,
			contenuFenetre = document.getElementById("workSpace").appendChild( domFenetre(nomFichier) )
								.querySelector(".contenuFenetre");
		
		switch( nomFichier.split(".").pop().toLowerCase() ) {
			case 'pdf' :
				contenuFenetre.appendChild( objetPdf( chemin + nomFichier ) );
			break;
					
			case 'gif' : ;
			case 'png' : ;
			case 'jpg' :
				contenuFenetre.appendChild( document.createElement("img") )
					.setAttribute( "src", chemin + nomFichier );
			break;
			
			case 'txt' :
				app_edit.open( chemin + nomFichier );
			break;
			
			case 'wav' :
				var audio = contenuFenetre.appendChild( document.createElement("audio") );
				
				audio.setAttribute( "controls", "controls" );
				source = audio.appendChild( document.createElement("source") );
				source.setAttribute( "type", "audio/wav" );
				source.setAttribute( "src", chemin + nomFichier );
			break;
			
			default:
				alert( "Type de Fichier Inconnu");
		}
	},
	/*
	 * Rend le camap de saisie actif pour le renommage du fichier
	 */
	saisieLibelle : function(input) {

		input.disabled=false;
		input.onchange = function(e){
				rename(this);
			};
		input.addEventListener('blur', function(){
				this.disabled = true;
			});
			
		return input.focus();
	},

	/*
	 * Affichage d'un ic�ne par document
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
			hidden = document.createElement("input");
		
		input.setAttribute( 'type', 'text');
		input.setAttribute( 'disabled', "true" );
		input.value = nomFichier;
		
		figcaption.appendChild( document.createElement("p") ).textContent = nomFichier;
//			.appendChild( document.createTextNode(nomFichier) );

		hidden.setAttribute( 'type', 'hidden');
		hidden.value = tabPath.join('/'); //chemin;
		figcaption.appendChild( hidden );
		
		/*
		 * Gestion du doubleClick sur le libell�
		 * rend le champ input enable -> visible
		 */
		figcaption.addEventListener('dblclick', function(){
			return app_cirrus.saisieLibelle(this.querySelector("input"));
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
		
		return li;
	},
	
	/*
	 * Charge le r�pertoire du bureau pour afficher les icones
	 */
	listFicBureau : function( ){
		$.getJSON('php/browser.php', 
			{ path: "~/-bureau" }, 
			function(data) {
				arrayFic = data.result;
				data.result.forEach(function( item, index, array ){
				   document.getElementById("bureau").appendChild( app_cirrus.iconFichier( app_cirrus.root + item.nom ) );
				});

			}
		);

	},

	upload : function(){
		var f = domFenetre("Upload");

		document.getElementById("workSpace").appendChild( f );

			var uploader = new qq.FileUploader({
				element: f.querySelector(".contenuFenetre"),
				action: './php/deskUpload.php?rep=',
				onComplete: function(id, fileName, responseJSON){
					if(responseJSON.success) {
						document.getElementById("bureau").appendChild( app_cirrus.iconFichier( app_cirrus.root + fileName ) );
//						app_cirrus.iconFichier(fileName);
					} else {
						alert(fileName);
					}
				},
			});           
		return f;
	},

	info : function(){
		element = document.createElement("div");
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
		$(divBrowser).append('<div id="etagere"><p></p></div>\n<div id="viewPath"></div>\n<div id="browser"></div>');
		
		app_cirrus.browser = document.getElementById("workSpace").appendChild( domFenetre("Fichiers", divBrowser) );

		changePath('~');
	
//		app_cirrus.browser = divBrowser;
		
		return app_cirrus.browser;
	},
	/*
	 * menu de l'application
	 */
	construitMenu : function(){
		var menu = domMenu("Cirrus");

		menu.appendChild( domItemMenu('Info', 'menu_cirrus', function(){
				document.getElementById("workSpace").appendChild( domFenetre("Info", app_cirrus.info()) );
			})
		);
		
		var menuFichier = domMenu("Fichier");
		menuFichier.appendChild( domItemMenu('Upload', 'menu_fichier', function(){
				app_cirrus.upload();
			})
		);
		menuFichier.appendChild( domItemMenu( 'Nouveau Dossier', 'menu_fichier', function(){
				nouveauDossier();
			} )
		);
		
		itemFichier = menu.appendChild( domItemMenu( 'Fichier', 'menu_cirrus', function(){} ) );
		itemFichier.querySelector("label").classList.add("sous-menu");
		itemFichier.appendChild(menuFichier);
		
		menu.appendChild( domItemMenu('Quitter', 'menu_cirrus', function(){
				app_cirrus.quit();
			})
		);
		app_cirrus.menu = menu;
		
		return menu;
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