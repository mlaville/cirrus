/**
 * postIt.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       14/02/1012
 * @version    0.2
 * @revision   $1$
 *
 * @date   revision   marc laville  27/02/2012 : gestion de retours à la line
 *
 * A faire
 * - Positionnement à la création
 * - gerer la mise à la corbeilleTester si le post-it est vide ; 
 *
 * Gestion des posti-it
 */
// Création d'un post-it
function postit( param ){
	
	this.element = document.createElement("div");
	this.element.className = "postick";
	this.element.style.left = param.x;
	this.element.style.top = param.y;
	
//	var divTxt = document.createElement("div");
//	this.element.appendChild( divTxt );
	var divTxt = this.element.appendChild( document.createElement("div") );
	divTxt.className = "editable";
	divTxt.setAttribute('contenteditable', true);
	if( param.contenu != undefined ) {
		param.contenu.forEach(function(item) {
			divTxt.appendChild( document.createTextNode(item) );
			divTxt.appendChild( document.createElement("br") );
		});
	}
//	this.element.appendChild( divTxt );
	$(this.element).draggable({
		cancel: '.editable'
		, containment: "parent"
	});

	return this;
}

var app_postit = {
	ajoutPostIt : function( param ){
		param
		if( param == undefined )
			param = {};
		if( param.x == undefined )
			param.x = '20px';
		if( param.y == undefined )
			param.y = '20px';
		
		var p = new postit( param );
		
		return document.getElementById("workSpace").appendChild( p.element );
	},
	// Passage d'un div dans la corbeille
	dropPostIt : function( unDiv ){
			ul = document.getElementById("list_recycleur").querySelector("ul");
			li = ul.appendChild( document.createElement("li") );
			// Récupère le text du post-it pour le placer dans la corbeille
			li.appendChild( unDiv.querySelector(".editable").firstChild );
			
			unDiv.parentNode.removeChild(unDiv);
	},
	// Representation json de l'ensemble des post-it
	listPostIt : function(){
		var postIts = document.getElementById("workSpace").querySelectorAll("div.postick");
		var list = new Array();
		
		for(i = 0 ; i < postIts.length ; i++) {
			var p = postIts.item(i);
			var style = window.getComputedStyle(p);
			var nd = p.querySelector(".editable").firstChild;
			var listNode = new Array();
			
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
		strJson = app_postit.listPostIt();

		var oXHR = new XMLHttpRequest();

		oXHR.open("POST", "./php/postIt.php");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send( "str=" + strJson );
	}
}