function displayFields(form,customHTML){ 
	
	
	var state =  getValue("WKNumState");
	customHTML.append("<script>function getWKNumState(){ return " + state + "; }</script>");
}