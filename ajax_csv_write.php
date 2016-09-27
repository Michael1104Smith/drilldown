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

    set_time_limit(0);

    if (ob_get_level() == 0) ob_start();

    $sql = "SELECT COUNT(co.id) cnt FROM cb_objects co,cb_funding_rounds cfr 
            WHERE co.id=cfr.object_id AND co.country_code='GBR' AND co.category_code IS NOT NULL AND cfr.funding_round_type IS NOT NULL 
                AND co.region IS NOT NULL AND cfr.raised_amount_usd IS NOT NULL AND cfr.funded_at IS NOT NULL";
    $result = mysqli_query($conn, $sql);
    $cnt = 0;
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $cnt = $row['cnt'];
        }
    }
    ob_flush();
    flush();

    $clip_cnt = 300;

    $length = intval($cnt/$clip_cnt);
    if($length*$clip_cnt>=$cnt) $length--;
    echo $cnt."<br/>".$length."<br/><br/>";

    for($i = 0; $i <= $length; $i++){

        $output = '';

        $fromLimit = $i*$clip_cnt;
        if($i < $length){
            $toLimit = $clip_cnt;
        }else{
            $toLimit = $cnt - $length*$clip_cnt - 1;
        }

        $sql = "SELECT co.name Company_Name, co.category_code Category, co.id Object_id, co.country_code Country, 
                    co.region Region, cfr.raised_amount_usd Amount_Raised_USD,cfr.funding_round_type Stage, cfr.funded_at Funded_At 
                FROM cb_objects co,cb_funding_rounds cfr 
                WHERE co.id=cfr.object_id AND co.country_code='GBR' AND co.category_code IS NOT NULL 
                    AND cfr.funding_round_type IS NOT NULL AND co.region IS NOT NULL AND cfr.raised_amount_usd IS NOT NULL 
                    AND cfr.funded_at IS NOT NULL LIMIT ".$fromLimit." , ".$toLimit;

        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                $output .= $row['Company_Name'];
                $output .=  ",".$row['Category'];
                $output .=  ",".$row['Object_id'];
                $output .=  ",".$row['Country'];
                $output .=  ",".$row['Region'];
                $output .=  ",".$row['Amount_Raised_USD'];
                $output .=  ",". $row['Stage'];
                $output .=  ",".$row['Funded_At'];
                $output .= "\n";
            }
        }

        $required_data_file = fopen("gbr.csv","a");
        fwrite($required_data_file , $output);
        fclose($required_data_file);
        echo $sql."<br/>";
        echo $output;
        echo "<br/><br/>";
        ob_flush();
        flush();
    }
    ob_end_flush();
?>