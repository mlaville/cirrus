// Création d'un icone doc
function uxDoc( param ){
	
	this.element = document.createElement("div");
	this.element.className = "ux-doc";
	this.element.style.left = param.x;
	this.element.style.top = param.y;
	
	img = this.element.appendChild( document.createElement("img") );
	spanNomFic = this.element.appendChild( document.createElement("span") );
	contenu.appendChild( document.createTextNode(param.contenu) );
	
	spanLibelle = this.element.appendChild( document.createElement("span") );
	
	var contenu = document.createElement("div");
	contenu.className = "editable";
	contenu.setAttribute('contenteditable', true);
	contenu.appendChild( document.createTextNode(param.contenu) );

	this.element.appendChild( contenu );
	$(this.element).draggable({ handle: 'img', containment: "parent" });

	return this;
}

