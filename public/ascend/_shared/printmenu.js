function writePulldownFirstLevel() {
    var pulldown = "<ul class='menu'>"
	    + "<li><a href='index.html'>Home</a></li>"
	    + "<li><a href='prerequisites.html'>Prerequisites</a></li>"
	    + "<li><a href='installation.html'>Installation</a></li>"
	    + "<li><a href='howtouse.html'>How to Use</a></li>"
	    + "<li><a href='report.html'>Report Bugs</a></li>"
	    + "<li class='menu2'>Ascend</li>"
    	+ "</ul>";
    document.write(pulldown);
} 
function writeFooter() {
    var backToTop = "<p id='back-top'><a href='#top'><span class='iconic arrow_up'></span></a>Back to top</p>";
    var footer = backToTop;
	    /*
	    + "<p class=validator>"
	    + "<a class='tbutton' href='http://validator.w3.org/check?uri=referer'>HTML5</a>&nbsp;"
	    + "<a class='tbutton' href='http://jigsaw.w3.org/css-validator/check/referer?profile=css3'>CSS3</a>"
	    + "</p>";
	    */
    document.write(footer);
}
