<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "fintech_highchart";

    // Create connection
    $conn = @mysqli_connect($servername, $username, $password, $dbname);
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "DELETE FROM drilldown_data";
    $result = mysqli_query($conn, $sql);

	$fp = fopen("data/data.json","r");
	$json = fread($fp,filesize("data/data.json"));
	$json = json_decode($json);
    $length = sizeof($json->Funded_At);
    for($i = 0; $i < $length; $i++){
        $sql = "INSERT INTO drilldown_data (Company_Name,Category,Object_id,Country,Region,Amount_Raised_USD,Stage,Funded_At) 
                VALUES('".$json->Company_Name[$i]."','".$json->Category[$i]."','".$json->Object_id[$i]."','".$json->Country[$i]."','".$json->Region[$i]."',".$json->Amount_Raised_USD[$i].",'".$json->Stage[$i]."','".$json->Funded_At[$i]."')";
        $result = mysqli_query($conn, $sql);
    }

	fclose($fp);

?>