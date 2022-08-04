<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html> <!--<![endif]-->
<head>
	<?php include 'common/head.html'; ?>
	<link rel="stylesheet" href="css/pubs.css">
	<script>
		function select(el){
			var range = document.createRange();
		    range.selectNodeContents(document.getElementById(el));
		    var sel = window.getSelection();
		    sel.removeAllRanges();
		    sel.addRange(range);
		}
	</script>
</head>
<body>
<?php include 'common/nav.html'; ?>

<?php
	define('BIBTEXBROWSER_URL',"pub.php"); 
	
	include 'pubs/bibtexbrowser-LearnDialogueStyle.php';
	define('BIBLIOGRAPHYSTYLE','LearnDialogueStyle');

	$_GET['bib'] = 'pubs/LearnDialogue.bib';
	include 'pubs/bibtexbrowser.php';
?>

<?php include 'common/footer.html'; ?>
</body>
</html>
