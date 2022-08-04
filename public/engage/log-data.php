#!/usr/local/bin/php

<?php
/*
 * NOTE: How to convert BLOB to text:
 * SELECT CONVERT(scripts USING utf8 ) FROM snap_logs
 */
  //include_once('ChromePHP.php');
  //require_once "ChromePHP.php";

  require_once "simplexml.class.php";

echo "<script>console.log('In logdata.php!');</script>";

	echo "Hello from log-data.php";	
  //ChromePhp::log('Hello console!');

  $con = mysql_connect("mysql.osg.ufl.edu", "learndialogue", "6Ph0btEzh2siszazsqSK", "learndialogue");
  //$con = mysqli_connect("127.0.0.1", "my_user", "my_password", "my_db");

  if (!$con){
    die('Could not connect: ' . mysql_error());
    echo "Could not connet from inside  log-data.php";
	//ChromePhp::log( "Could not connect: " , mysql_connect_error(), "<br>");
    exit; 
  }

  //ChromePhp::log ("Success: A proper connection to MySQL was made!" . PHP_EOL);
 // ChromePhp::log( "Host information: " . mysqli_get_host_info($link) . PHP_EOL);

  //ChromePhp::log("Connection successful") ;
  //ChromePhp::log("Host information: " . mysqli_get_host_info($con) . PHP_EOL);
/*
$result = mysqli_query($con, "Select * FROM snap_logs");
echo "Retrieved:<br>";
while ($row = mysqli_fetch_array($result))
  {
  echo
          $row[event_time_db], "; ",
          $row[event_time_local], "; ",
          $row[computer_id], "; ",
          $row[user_id], "; ",
          $row[event_type], "; ",
          $row[block], "; ",
          $row[parameters], "; ",
          $row[scripts], "<br>";
  }

echo "Test:<br>",
        $_POST["event_time_local"], "; ",
        $_POST["computer_id"], "; ",
        $_POST["user_id"], "; ",
        $_POST["event_type"], "; ",
        $_POST["block"], "; ",
        $_POST["parameters"], "; ",
        $_POST["scripts"], "<br>";
*/

/*$result = mysqli_query($con,
          "INSERT INTO `engageBlocklyTrace` (`time_stamp`, `session_id`, `event_type`,`event_element`, `block_name`, `block_field`, `oldField`, `newField`,`student_code`, `rawJSON`)
           VALUES ($_POST['session'], )");

ChromePhp::log('Hello console! again2!');


mysqli_close($con);*/

$result = mysql_query($con,
            "INSERT INTO `engageBlocklyTrace` (`time_stamp`, `session_id`, `event_type`,`event_element`, `block_name`, `block_field`, `oldField`, `newField`,`student_code`, `rawJSON`)
            VALUES (\"".filter_input(INPUT_POST, "event_time_local")."\", \"". 
                        filter_input(INPUT_POST, "session")."\", \"".
                        filter_input(INPUT_POST, "event_type")."\", \"".
                        filter_input(INPUT_POST, "element")."\", \"".
                        filter_input(INPUT_POST, "block")."\", \"".
                        filter_input(INPUT_POST, "blockField")."\", \"".
                        filter_input(INPUT_POST, "newVal")."\", \"".
                        filter_input(INPUT_POST, "oldVal")."\", \"".
                        filter_input(INPUT_POST, "code")."\", \"".
                        filter_input(INPUT_POST, "rawJSON")."\"
                    )"
          );

/*$result = mysqli_query($con,
          "INSERT INTO `engageBlocklyTrace` (`time_stamp`, `session_id`, `event_type`,`event_element`, `block_name`, `block_field`, `oldField`, `newField`,`student_code`, `rawJSON`)
          VALUES ('".$_POST['time_stamp']."',
                  '".$_POST['session']."',
                  '".$_POST['event_type']."',
                  '".$_POST['element']."',
                  '".$_POST['block']."', 
                  '".$_POST['blockField']."',
                  '".$_POST['newVal']."',
                  '".$_POST['oldVal']."',
                  '".$_POST['code']."',
                  '".$_POST['raswJSON']."',
                  )
          ");*/
//ChromePhp::log($result);
//ChromePhp::log(mysql_errno($con) . ": " . mysql_error($con) . "\n");

mysql_close($con);
?>
