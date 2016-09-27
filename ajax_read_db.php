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

    $output = array();
    $Company_Name = array();
    $Category = array();
    $Object_id = array();
    $Country = array();
    $Region = array();
    $Amount_Raised_USD = array();
    $Stage = array();
    $Funded_At = array();

    set_time_limit(0);

    if (ob_get_level() == 0) ob_start();

    $sql = "SELECT COUNT(co.id) cnt FROM cb_objects co,cb_funding_rounds cfr WHERE co.id=cfr.object_id AND co.country_code='GBR'";
    $result = mysqli_query($conn, $sql);
    $cnt = 0;
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $cnt = $row['cnt'];
        }
    }
    ob_flush();
    flush();

    $clip_cnt = 100;

    $length = intval($cnt/$clip_cnt);
    $length = 20;
    if($length*$clip_cnt>=$cnt) $length--;

    for($i = 11; $i <= $length; $i++){

        $fromLimit = $i*$clip_cnt+1;
        if($i < $length){
            $toLimit = $clip_cnt;
        }else{
            $toLimit = $cnt - $length*$clip_cnt;
        }

        $sql = "SELECT co.name Company_Name, co.category_code Category, co.id Object_id, co.country_code Country, co.region Region, 
                        cfr.raised_amount_usd Amount_Raised_USD, cfr.funding_round_type Stage, co.founded_at Funded_At
                FROM cb_objects co,cb_funding_rounds cfr
                WHERE co.id=cfr.object_id AND co.country_code='GBR' LIMIT ".$fromLimit." , ".$toLimit;

        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                $Company_Name[] = $row['Company_Name'];
                $Category[] = $row['Category'];
                $Object_id[] = $row['Object_id'];
                $Country[] = $row['Country'];
                $Region[] = $row['Region'];
                $Amount_Raised_USD[] = $row['Amount_Raised_USD'];
                $Stage[] = $row['Stage'];
                $Funded_At[] = $row['Funded_At'];
            }
        }
        var_dump($Company_Name);
        echo "<br/><br/>";
        ob_flush();
        flush();
    }

    $output['Company_Name'] = $Company_Name;
    $output['Category'] = $Category;
    $output['Object_id'] = $Object_id;
    $output['Country'] = $Country;
    $output['Region'] = $Region;
    $output['Amount_Raised_USD'] = $Amount_Raised_USD;
    $output['Stage'] = $Stage;
    $output['Funded_At'] = $Funded_At;

    $json_file_output = str_replace("\\","",json_encode($output, JSON_UNESCAPED_SLASHES));
    echo $json_file_output;
    $required_data_file = fopen("mysql_data2.json","w");
    fwrite($required_data_file , $json_file_output);
    fclose($required_data_file);
    ob_end_flush();
?>