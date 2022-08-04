<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<?php include 'common/head.html'; ?>
	<link rel="stylesheet" href="css/pubs.css">
</head>
<body>
<?php include 'common/nav.html'; ?>


		<div id="pub_head">
			<h1 id="pub_h1">publications</h1>
			<span id="pub_sort">
				<a href="?">by year</a> 
				| <a href="?academic">by type</a>
			</span>
		</div>
		
				
<?php

include('common/find.php');

define('BIBTEXBROWSER_URL',"pub.php"); 

include('pubs/bibtexbrowser-LearnDialogueStyle.php');
define('BIBLIOGRAPHYSTYLE','LearnDialogueStyle');

$_GET['bib']='pubs/LearnDialogue.bib';
$_GET['all'] = 1;
$_GET['author'] = bibtexAuthorString("keboyer");

include('pubs/bibtexbrowser.php');
?>

<div style="text-align:right;font-size: xx-small;opacity: 0.6;" class="poweredby"><!-- If you like bibtexbrowser, thanks to keep the link :-) -->powered by <a href="http://www.monperrus.net/martin/bibtexbrowser/">bibtexbrowser</a><!--v20130328--></div>

<?php include 'common/footer.html'; ?>
</body>
</html>
