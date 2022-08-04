<?php

require_once "simplexml.class.php";

if(!function_exists("simplexml_load_file")){
 function simplexml_load_file($file){
  $sx = new simplexml;
  return $sx->xml_load_file($file);
 }
}


//finds the picture for a given unity ID
function findPicture($userID) {
	$imglocation = 'people/' . $userID;
	$formats = array(".png", ".jpg", ".jpeg", ".JPG", ".PNG");

	foreach($formats as $format){
		$file = $imglocation . $format;
		if(file_exists($file)){
			return $file;
		}
	}

	return 'img/people/person.png';
}

function getXML($userID){
	$file = 'people/' . $userID . '.xml';

	if(file_exists($file)){
		return simplexml_load_file($file);
	}
}

//finds aliases for a given unity ID
function findNames($userID) {
	$xml = getXML($userID);
	return $xml->names->name;
}


//finds the directory in which the calling file resides
function findDirectory() {
	$path = $_SERVER[REQUEST_URI];
	$path = substr($path, 0, strrpos($path, '/'));
	$path = substr($path, strrpos($path, '/') + 1);
	return $path;
}


//generates search string for finding this person's papers
function bibtexAuthorString($userID) {
	$names = findNames($userID);
	$authors = trim($names[0]);
	$i = 1;
	while($i < count($names)){
		$authors .= '|'.trim($names[$i]);
		$i++;
	}
	return $authors;
}

//finds information relevant for sorting on people page
function findSortInfo($userID) {
	$xml = getXML($userID);
	return array($xml->sort_name, $xml->position);
}

function getProjectXML($projectID){
	$file = 'projects/' . $projectID . '.xml';

	if(file_exists($file)){
		return simplexml_load_file($file);
	}
}

function findProjectPicture($projectID) {
	$imglocation = 'projects/' . $projectID;
	$formats = array(".png", ".jpg", ".jpeg");

	foreach($formats as $format){
		$file = $imglocation . $format;
		if(file_exists($file)){
			return $file;
		}
	}

	return 'people/person.png';
}

function hasPublication($userID) {
	//names of people who have publications
	$pubNames = array(
		"fjrodri3",
		"jbwiggi3",
		"keboyer",
		"kprice",
		"mcelepk",
		"aisha",
		"alexia",
	        "xiaoyi",
		"gloria",
		"yingbo",
		"amanda",
		"amannekote",
		"alex",
		"timothy",
		"jule"
	);

	foreach($pubNames as $pubName){
		if($userID == $pubName){
			return true;
		}
	}
	return false;
}

?>
