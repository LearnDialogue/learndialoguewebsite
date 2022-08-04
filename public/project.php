<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<?php include 'common/head.html'; ?>
	<link rel="stylesheet" href="css/pubs.css">
	<link rel="stylesheet" href="css/person.css">
</head>
<body>
<?php include 'common/nav.html'; ?>

<?php 
	include 'common/find.php';

	$projectID = $_GET['id'];
	$xml = getProjectXML($projectID);
	$pic = findProjectPicture($projectID);
?>


	<a href = "<?php echo $pic; ?>"> <img class="project_img" src="<?php echo $pic; ?>" /> </a>
	<div class="top">
		<h2><?php echo $xml->name; ?></h2>
		<p><?php echo $xml->tagline; ?></p>
	</div>
	<p><?php echo $xml->description; ?></p>

	<h2 class="clear">publications</h2>
<?php
	define('BIBTEXBROWSER_URL',"pub.php"); 
	
	include 'pubs/bibtexbrowser-LearnDialogueStyle.php';
	define('BIBLIOGRAPHYSTYLE','LearnDialogueStyle');

	$_GET['bib'] = 'pubs/LearnDialogue.bib';
	$_GET['all'] = 1;
	$_GET['keywords'] = $projectID;
	include 'pubs/bibtexbrowser.php';
?>
		
<?php include 'common/footer.html'; ?>
</body>
</html>
