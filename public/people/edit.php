<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>LearnDialogue at NCSU</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<?php
	$userid  = getenv('WRAP_USERID');
	if(!$userid) { $userid = 'null'; }
	
	include '../common/find.php';
	$pic = findPicture($userid);
	$names = findNames($userid);
	$author = bibtexAuthorString($userid);
?>
<p>Your id: <?php echo $userid; ?></p>

<p>
Your current picture: 
<img src=<?php echo '"'.$pic.'"' ?> />
</p>

<p>
Your display name: 
<?php 
	if(count($names) < 1){
		echo 'none found';
	} else {
		echo $names[0]; 
		$author = trim($names[0]);
	}

?>
</p>

<p>
Other names (for publications):
<?php
	if(count($names) <= 1){
		echo 'none found';
	}
	$i = 1;
	while($i < count($names)){
		echo '<br />- '.$names[$i];
		$author .= '|'.trim($names[$i]);
		$i++;
	}
?>
</p>

<p>
Your publications:
<?php
	define('BIBTEXBROWSER_URL',""); 
	$_GET['bib'] = '../pubs/LearnDialogue.bib';
	$_GET['author'] = $author;

	include '../pubs/bibtexbrowser.php';
?>

</p>

</body>
</html>
