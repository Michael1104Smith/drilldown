<?php

	$fp = fopen("data/data.json","r");
	$json = fread($fp,filesize("data/data.json"));
	$json = json_decode($json);
	$Funded_At = $json->Funded_At;
	$quaters = array($Funded_At[0],$Funded_At[0]);
	for($i = 1; $i < sizeof($Funded_At); $i++){
	    if($quaters[0] > $Funded_At[$i]) $quaters[0] = $Funded_At[$i];
	    if($quaters[1] < $Funded_At[$i]) $quaters[1] = $Funded_At[$i];
	}
	$drilldownData["quaters"] = $quaters;
	$drilldownData["graph"] = null;

    $Region = $json->Region;
    $Amount_Raised_USD = $json->Amount_Raised_USD;
    $groupBy = array();
    $groupBy_USD = array();
    for($i = 0; $i < sizeof($Region); $i++){
        for($j = 0; $j < sizeof($groupBy); $j++){
            if($Region[$i] == $groupBy[$j]) break;
        }
        if($j == sizeof($groupBy)){
        	array_push($groupBy,$Region[$i]);
        	array_push($groupBy_USD,$Amount_Raised_USD[$i]);
        }else{
            $groupBy_USD[$j] += $Amount_Raised_USD[$i];
        }
    }
    $drilldownData["groupBy"] = $groupBy;
    $drilldownData["groupBy_USD"] = $groupBy_USD;

	$drilldownData = json_encode($drilldownData, JSON_UNESCAPED_SLASHES);
	print_r($drilldownData);
	fclose($fp);

?>