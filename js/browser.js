/**
 * browser.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012-2015
 * @date       28/02/1012
 * @version    0.1
 * @revision   $0$
 *
 * @date   revision   marc laville  09/04/2012 chargement des fichiers depuis la liste path
 * @date   revision   marc laville  30/04/2012 gestion du drop sur les repertoires du path
 * @date   revision   marc laville  29/01/2015 réécriture pur javascript
 * 
 * A faire : 
 * - réécriture pure selon module pattern
 * - instanciation propre des noeuds dom
 * - drag sur l'étagère
 * drop dans un répertoire du path 
 * 
 * Browser
 */
 
var arrayFic = new Array();

function etagere( path ) {
	return;
}

function chemin( path ) {
	return;
}

function move(element, dest) {
	var oXHR = new XMLHttpRequest();
	
	oXHR.onreadystatechange=function() {
		
		if (oXHR.readyState==4 && oXHR.status==200) {
			resp = JSON.parse(oXHR.responseText);
			
			if(resp.success) {
				element.parentElement.removeChild(element);
				changePath(resp.dest);
			} else {
				// gerer l'erreur de déplacement
			}
		}
		
		return false;
	}
	oXHR.open("POST", "./php/moveFile.php");
	oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	oXHR.send( "path=~/-bureau/" + element.querySelector("figcaption").textContent +"&dest=" + dest );
		
	return;
}

// element est un input
function rename(element) {
	var path = null;
	var bureau = true;
	var inputs = document.getElementById("bureau").getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {   
		var input = inputs[i]; 
		if ( input === element ) {   
			path = "~/-bureau/" /*+ element.nextSibling.firstChild.nodeValue*/;
		} 
	}
	if(path == null) {
		bureau = false;
		path = element.nextSibling.nextSibling.value;
	}
	path += element.nextSibling.firstChild.nodeValue;
	
	var oXHR = new XMLHttpRequest();
	
	oXHR.onreadystatechange=function() {
		
		if (oXHR.readyState==4 && oXHR.status==200) {
			resp = JSON.parse(oXHR.responseText);
			
			if(resp.success) {
				if(bureau) {
					element.nextSibling.firstChild.nodeValue = resp.dest.split("/").pop();
				} else {
					changePath(resp.dest);
				}
			} else {
				// gerer l'erreur de déplacement
			}
		}
		
		return false;
	}
	oXHR.open("POST", "./php/renameFile.php");
	oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	oXHR.send( "path=" + path +"&dest=" + element.value );

	return;
}

function nouveauDossier( ) {

	var li = document.getElementById("viewPath").firstChild.lastChild;
	var path = li.querySelector("input[type='hidden']").value;
	
	img = li.querySelector("img");
	if( img.getAttribute("src").split("/").pop() == "dossier.png" ) {
		path += li.querySelector("input[type='text']").value;
	}

	var oXHR = new XMLHttpRequest();
	
	oXHR.onreadystatechange=function() {
		
		if (oXHR.readyState==4 && oXHR.status==200) {
			resp = JSON.parse(oXHR.responseText);
			
			if(resp.success) {
				changePath(resp.dest, true);
			} else {
				// gerer l'erreur de création de dossier
			}
		}
		
		return false;
	}
	oXHR.open("POST", "./php/nouveauDossier.php");
	oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	oXHR.send( "path=" + path );
		
	return;
}

function arrayToBrowser( tabFichier, titre, tabPath, ulPath, chemin ){
	var colPlus = null,
		items = new Array(),
		itemSelect = tabPath.shift(),
		ulColFic = '<li><div>' + titre + '</div><ul>',
		addToPath = function( nomFic, isDir ) {
			var noeudPrecedent = ulPath.lastChild,
				pathFile = (noeudPrecedent) ? noeudPrecedent.dataset.chemin + '/' + noeudPrecedent.querySelector('figcaption p').textContent : '';

			return ulPath.appendChild( app_cirrus.iconFichier( pathFile + '/' + nomFic, isDir ) );
		},
		traiteFic = function( fic, isDir ) {
			var arrClass = new Array(),
				balise = "<li";

			if(fic.isDir == false) { // Affichage du fichier en fin de liste
				if(fic.nom == itemSelect) {
					arrClass.push('sel');
//					ulPath.appendChild( app_cirrus.iconFichier( chemin + '/' + titre + '/' + itemSelect ) );
					addToPath( itemSelect );
				}
				
			} else { // Gestion des répertoires en fin de liste
					
				arrClass.push('rep');
				if( fic.rep !== null ) {
					var li;

					chemin = ( chemin || '' ) + titre + '/';
					arrClass.push('sel');
					
//					li = ulPath.appendChild( app_cirrus.iconFichier(chemin + '/' + itemSelect, true) );
					li = addToPath( itemSelect, true );
					/* Activation du dossier */
					$(li).droppable({
						tolerance: 'touch',
						accept: "figure",
						over: function(event, ui) { 
							this.querySelector("img").setAttribute( "src", './css/images/docs/dossierOuvert.png' );
						},
						out: function(event, ui) { 
							this.querySelector("img").setAttribute( "src", './css/images/docs/dossier.png' );
						},
	//					hoverClass: "recycle",
						drop: function( event, ui ) {
							var path = "",
								li = this.parentElement.firstElementChild;
							while(li !== this){
								path += (li.querySelector("figcaption").textContent + "/");
								li = li.nextElementSibling;
							}
							path += this.querySelector("figcaption").textContent;
							move(ui.draggable[0], path);
						}
					});
					
					colPlus = arrayToBrowser(fic.rep, fic.nom, tabPath, ulPath, chemin);
				}
			}
			if(arrClass.length) {
				balise +=  ( ' class="' + arrClass.join(' ') + '"');
			}
			items.push( balise + ">" + fic.nom + '</li>');
			
		};

	tabFichier.forEach( traiteFic );

	ulColFic = ulColFic + items.join('\n') + '\n</ul></li>';
	if(colPlus) {
		ulColFic += colPlus;
	}
	
	return ulColFic;
}

function changePath(unPath, edit) {

	var viewPath = document.getElementById("viewPath");
			
	$.getJSON('php/browser.php', 
		{ path: unPath, root: true }, 
		function(data) {
			var ulPath = document.createElement("ul"),
				browserLis, ulBrowser,
				path = unPath.replace('~', app_cirrus.home).split("/"),
				
				/**
				 * Reponse à un click sur une ligne du browser
				 */
				liToPath = function(e) {
					var arrPath = new Array( this.textContent ),
						ul = this.parentNode,
						li = ul.parentNode;

					while(li) {
						arrPath.unshift( li.querySelector("div").textContent );
						li = li.previousSibling;
					}
					arrPath.shift();
					changePath( arrPath.join("/") );
				};
			
			// recalcul du path
			if (viewPath.firstChild) {
				viewPath.removeChild(viewPath.firstChild);
			}			
			viewPath.appendChild(ulPath);
			
			browser = document.getElementById("browser");
			if (browser.firstChild) {
			  browser.removeChild(browser.firstChild);
			}			
			ulBrowser = browser.appendChild( document.createElement("ul") );
			ulBrowser.innerHTML = arrayToBrowser( data.result, "/", path, ulPath );
			
			browserLis = ulBrowser.querySelectorAll('li li');
			for( var i = browserLis.length - 1 ; i >= 0 ; i-- ) {
				browserLis[i].addEventListener( 'click', liToPath );
			}
			
			if(edit) {
				app_cirrus.saisieLibelle(viewPath.firstChild.lastChild.querySelector("input"));
			}
		}
	);
	
	return;
}