/**
 * postIt.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012-2015
 * @date       14/02/1012
 * @version    0.2
 * @revision   $1$
 *
 * @date   revision   marc laville  27/02/2012 : gestion de retours à la line
 * @date   revision   marc laville  19/01/2015 : formalisation du code en un module
 *
 * A faire
 * - Positionnement à la création
 * - gerer la mise à la corbeille
 * - Tester si le post-it est vide ; 
 *
 * Gestion des posti-it
 */

 var app_postit = {
	// Création d'un post-it
	creePostIt : function( param ){
		var element = document.createElement("div"),
			divTxt = element.appendChild( document.createElement("div") );
		
		element.className = "postick";
		element.style.left = param.x;
		element.style.top = param.y;
	
		divTxt.className = "editable";
		divTxt.setAttribute('contenteditable', true);
		if( param.contenu != undefined ) {
			param.contenu.forEach(function(item) {
				divTxt.appendChild( document.createTextNode(item) );
				divTxt.appendChild( document.createElement("br") );
			});
		}

		$(element).draggable({
			cancel: '.editable', 
			containment: "parent"
		});

		return element;
	},
	ajoutPostIt : function( param ){

		param = param || {};
		if( param.x == undefined )
			param.x = '20px';
		if( param.y == undefined )
			param.y = '20px';

		return document.getElementById("workSpace").appendChild( this.creePostIt( param ) );
	},
	// Passage d'un div dans la corbeille
	dropPostIt : function( unDiv ){
		var	ul = document.getElementById("list_recycleur").querySelector("ul"),
			li = ul.appendChild( document.createElement("li") );
			// Récupère le contenu du post-it pour le placer dans la corbeille
			li.appendChild( unDiv.querySelector(".editable") )
				.classList.remove("editable");
			// efface le postit
			unDiv.parentNode.removeChild(unDiv);
	},
	// Representation json de l'ensemble des post-it
	listPostItInElement : function( elt ){
		var postIts = elt.querySelectorAll("div.postick"),
			list = new Array();
		
		for( var i = postIts.length - 1 ; i >= 0  ; i-- ) {
			var p = postIts.item(i),
				style = window.getComputedStyle(p),
				nd = p.querySelector(".editable").firstChild,
				listNode = new Array(),
				str;
			
			while(nd) {
				str = nd.nodeValue;
				if( str != null) {
					listNode.push(str);
				}
				nd = nd.nextSibling;
			}
			list.push({
				x : style.getPropertyValue("left"),
				y : style.getPropertyValue("top"),
				contenu : listNode
			});
		}
		
		return JSON.stringify(list);
		
	},
	// Representation json de l'ensemble des post-it
	listPostIt : function(){
		return this.listPostItInElement( document.getElementById("workSpace") );
	},
	chargeListPostIt : function(){
		var oXHR = new XMLHttpRequest();

		oXHR.onreadystatechange=function() {
		
			if (oXHR.readyState==4 && oXHR.status==200) {
				resp = JSON.parse(oXHR.responseText);
				
				if(resp.success) {
					resp.postit.forEach(function(item) {
						app_postit.ajoutPostIt(item);
					});
				} else {
					alert("erreur chargement des posts-it");
				}
			}
			
			return false;
		}

		oXHR.open("POST", "./php/postIt.php");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send( );
	},
	sauvListPostIt : function(){
		var oXHR = new XMLHttpRequest();

		oXHR.open("POST", "./php/postIt.php");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send( "str=" + this.listPostIt() );
	},
	liDock : function(){
		var li = document.createElement("li"),
			img = li.appendChild( document.createElement("img") );
		
		img.setAttribute('src', './css/images/postit.png');
		li.addEventListener( 'dblclick', function(e) {
			app_postit.ajoutPostIt();
		});
		
		return li;
	},
	init : function( ul ){
		
		this.chargeListPostIt();
			/* Activation de la corbeille */
		$("#recycleur").droppable({
			tolerance: 'touch',
			hoverClass: "recycle",
			drop: function( event, ui ) {
				app_postit.dropPostIt( ui.draggable[0] );
				this.classList.add("rempli");  
			}
		});

		return ul.appendChild( this.liDock() );
	}
}