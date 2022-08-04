<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<?php include 'common/head.html'; ?>
	<link rel="stylesheet" href="css/people.css">
	<link rel="stylesheet" href="css/pubs.css">
	<link rel="stylesheet" href="css/person.css">
</head>
<body>
<?php include 'common/nav.html'; ?>


<?php 

	include 'common/find.php';
//	$userID = findDirectory();
	$userID = $_GET['id'];
	$pic = findPicture($userID);
	$xml = getXML($userID);
	$names = findNames($userID); 
	$name = $names[0];
	$author = bibtexAuthorString($userID);
	$user = $_SERVER['WRAP_USERID'];
?>

	<img class="people_img" src="<?php echo $pic; ?>" />
	<div class="top">
		<h2><?php echo $name; ?></h2>
		<!--<h2><?php echo $userID . " " . $user; ?></h2>-->
		<p><?php echo $xml->position; ?>, 
		<?php echo $xml->program; ?>, <?php echo $xml->school; ?><br />
		<a id="email" href="mailto:<?php echo $xml->email; ?>"><?php echo $xml->email; ?></a>
		</p>
		<?php
			if($userID == "keboyer"){
				echo "<table>";
				echo "<tr><td>Office:
				CISE Building Room 430</a></td>";
				echo "<tr><td>Phone:+1.352.505.1902</td>";
				echo "</table>";
			}
		?>
	</div>
	<div class="about">
		<p><?php echo $xml->bio; ?></p>
	</div>

	<h2 class="clear">education</h2>
	<?php
	$numberOfDegrees = 2;
		$degrees = $xml->degrees->degree;
foreach($degrees as $degree){
                        if(empty($degree->abbrev)) {
				$numberOfDegrees = 1;
				break;	
			}
                }
	if($numberOfDegrees>1){	
		foreach($degrees as $degree){
			echo "<p>" . $degree->abbrev . ", " . $degree->subject . " (" .
				$degree->graduation . ")";
				
			$details = $degree->details->detail;
			foreach($details as $detail){
				echo "<br />&nbsp;&nbsp;&nbsp;<i>" . $detail . "</i>";
			}
			echo "<br />&nbsp;&nbsp;&nbsp;" . $degree->school . "</p>";
		}
	}

	else {

		$degrees1 = $xml->degrees;
/*
foreach($degrees as $degree){
                        if(empty($degree->abbrev)) {
                                echo "<p>Multi degree!</p>";
                        }
                }
*/
                foreach($degrees1 as $degree){
                        echo "<p>" . $degree->abbrev . ", " . $degree->subject . " (" .
                                $degree->graduation . ")";

                        $details = $degree->details->detail;
                        foreach($details as $detail){
                                echo "<br />&nbsp;&nbsp;&nbsp;<i>" . $detail . "</i>";
                        }
                        echo "<br />&nbsp;&nbsp;&nbsp;" . $degree->school . "</p>";
                }
		}
		
	?>
	
	<?php
		$research = $xml->research;
		if(strlen($research) > 0){
			echo "<h2>research</h2>";
			echo "<p>" . $research . "</p>";
		}
	
	
	
		if($userID == "keboyer"){
			echo "<h2>teaching</h2>";
			echo "<table class=\"teaching\">";
			echo "<tr><td class=\"first\">Spring 2022:</td><td> Research Methods for Human-Centered Computing (CAP 5108)</td></tr>";
			echo "<tr><td class=\"first\">Fall 2021:</td><td> Dialogue Systems and Natural Language Interfaces (CIS 4930/6930)</td></tr>";			
			echo "<tr><td class=\"first\">Fall 2019:</td><td><a href=\"https://cise.ufl.edu/research/learndialogue/pdf/COP6930-Fall2019-syllabus.pdf\">Spoken Dialogue Systems (CIS 4930/6930)</td></tr>";
			echo "<tr><td class=\"first\">Fall 2017:</td><td><a href=\"https://cise.ufl.edu/research/learndialogue/pdf/COP6930-Fall2017-syllabus.pdf\">Dialogue Systems and Natural Language Interfaces (CIS 4930/6930)</td></tr>";
			echo "<tr><td class=\"first\">Spring 2017:</td><td>Programming Fundamentals I (COP 3502)</td></tr>";
			echo "<tr><td class=\"first\">Fall 2016:</td><td>Dialogue Systems and Natural Language Interfaces (COP 4930/6930)</td></tr>";
			echo "<tr><td class=\"first\">Spring 2016:</td><td>Programming Fundamentals I (COP 3502)</td></tr>";
			echo "<tr><td class=\"first\">Spring 2015:</td><td>Programming Concepts -- Java (CSC 216)</td></tr>";
			echo "<tr><td class=\"first\">Fall 2014:</td><td>Spoken Dialogue Systems (CSC 495/591) </td></tr>";
			echo "<tr><td class=\"first\">Spring 2014:</td><td>Programming Concepts -- Java (CSC 216; Sections 001 and 002)</td></tr>";
			echo "<tr><td class=\"first\">Fall 2013:</td><td>Spoken Dialogue Systems (CSC 495/591)</td></tr>";
			echo "<tr><td class=\"first\">Spring 2013:</td><td>Programming Concepts -- Java (CSC 216)</td></tr>";
			echo "<tr><td class=\"first\">Fall 2012:</td><td>Natural Language Dialogue Systems (CSC 591/791)</td></tr>";
			echo "<tr><td class=\"first\">Spring 2012:</td><td>Automated Learning and Data Analysis (CSC 522)</td></tr>";
			echo "</table>";
		}
	?>
	

<?php
if(hasPublication($userID)){
	echo "<h2>publications</h2>";
	define('BIBTEXBROWSER_URL',"pub.php"); 
	
	include 'pubs/bibtexbrowser-LearnDialogueStyle.php';
	define('BIBLIOGRAPHYSTYLE','LearnDialogueStyle');
	$_GET['bib'] = 'pubs/LearnDialogue.bib;pubs/OtherLabPubs.bib';
	$_GET['author'] = $author;
	$_GET['academic'] = 1;
	include 'pubs/bibtexbrowser.php';
}
?>

<p class="clear">&nbsp;</p>

		
<?php include 'common/footer.html'; ?>
</body>
</html>
