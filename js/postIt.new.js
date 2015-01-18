
function postit( ){
	
	
	return;
}

var app_postit = {
	liste : new Array(),
	
	nouveauPostIt : function(){
		var element = document.createElement("div");
		element.className = "postick";
		
		var contenu = document.createElement("div");
		contenu.className = "editable";
		contenu.setAttribute('contenteditable', true);

		element.appendChild( contenu );
		$(element).draggable({
			cancel: '.editable',
			containment: "parent"
		});

		this.descriptPostIt = function(){
			var style = window.getComputedStyle(this.parentElement, null);
			alert(style.getPropertyValue("top") + ' / ' + style.getPropertyValue("left"));

			return;
		}
		
//		contenu.addEventListener('blur', this.descriptPostIt, false);
		
		return element;
	}

	ajoutPostIt : function(){
//		var p = new postit();
		var p = new postit();
		
		this.liste.push( p );
		document.getElementById("workSpace").appendChild( p.element );
		return;
	}

}
