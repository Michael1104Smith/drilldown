<?php

    $fileName = 'uk.json';
    if(isset($_REQUEST['fileName'])){
        $fileName = $_REQUEST['fileName'];
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Current Quarter Data</title>
    <link rel="shortcut icon" href="Content/Images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="Content/Images/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width" />
    <script src="Scripts/jquery-2.0.3.js"></script>

    <script src="Scripts/jquery-ba-outside-events.js"></script>

    <link href="Content/site.css" rel="stylesheet"/>

    <script src="Scripts/modernizr-2.6.2.js"></script>

    <script src="Scripts/highcharts.src.js"></script>
    <script src="Scripts/highcharts-more.src.js"></script>
    <script src="Scripts/highcharts-3d.src.js"></script>
    <script src="Scripts/exporting.src.js"></script>

    <script src="Scripts/site.js"></script>

    <link href="Content/jquery-ui-1.10.4.custom.css" rel="stylesheet"/>

    <script src="Scripts/jquery-ui-1.10.4.custom.js"></script>

    <script src="Scripts/jquery.tinymce.js"></script>


    <script type="text/javascript">    
        var usa_Regions = ["SF Bay", "New York", "Boston", "Los Angeles", "Seattle", "Washington DC", "San Diego", "Denver", "Austin", "Chicago", "Atlanta", "Philadelphia", "Dallas", "Raleigh-Durham", "Salt Lake City", "Portland", "Minneapolis", "Pittsburg"];
        var uk_Regions = ["London","United Kingdom - Other","Manchester","Edinburgh","Bristol","Birmingham","Glasgow","Leeds","Newcastle","Sheffield","Nottingham","Liverpool","Cardiff"];
        var fileName;
        var static_Regions;
        var static_Categories = ["software", "biotech", "web", "enterprise", "mobile", "advertising", "cleantech", "ecommerce", "medical", "hardware", "games_video", "analytics", "health", "semiconductor", "network_hosting", "finance", "social", "real_estate"];
        $(document).ready(function(){
            fileName = '<?php echo $fileName; ?>';  
            console.log(fileName);
            $('#Selelct_Country option').each(function(){
                if($(this).val() == fileName){
                    $(this).attr('selected','selected');
                }
            })
            static_Regions = [];
            var i;
            if(fileName.search('usa') > -1){
                static_Regions = usa_Regions;
            }else if(fileName.search('uk') > -1){
                static_Regions = uk_Regions;
            }
            $('#Selelct_Country').change(function(){
                var cur_href = window.location.href.split('?')[0];
                window.location.href = cur_href+"?fileName="+$(this).val();
            })
        })
    </script>

    
    <script src="Scripts/byRegion.js"></script>
    <script src="Scripts/byQrtChartButtons.js"></script>
    <script src="Scripts/DrillDownTT.js"></script>
    <script src="Scripts/byQuarterDrillDown.js"></script>
    <script src="Scripts/draggable.js"></script>

    <link href="Content/Quarter.css" rel="stylesheet"/>

    <script src="Scripts/Spin.js"></script>
    <script src="Scripts/SpinItem.js"></script>


</head>
<body>
    <div id="FullPage">
        <div id="container">
            <div id="topNav">
                <img id="logo" src="Images/logo.png" />

                <div id="LoginControlDiv">
                <select id="Selelct_Country" style="position:absolute;right:0;top:0;">
                    <option value='usa.json'>United States</option>
                    <option value='uk.json'>United Kindom</option>
                </select>
<!--                     <img id="loginArrowIcon" onclick="javascript:document.getElementById('logoutForm').submit()" src="Images/Login-caret.gif" />
                    <section id="login">
                        <div class="LoginSection">
                            <div class="LinkBeforeLogin"><a href="/Account/Login">Log in</a></div>
                        </div>
                    </section>
                    <div id="credStamp">
                        <a>PricewaterhouseCoopers</a>
                        <a>National Venture Capital Association</a>
                    </div> -->
                </div>
<!--                 <div id="navlinks">
                    <ul id="navigation">
                        <li class="root_links"><a class="root_links_anchor" href="/">Home</a></li>
                        <li class="root_links">
                            <a class="root_links_anchor">Current quarter data</a>
                            <div class="navDropdown">
                                <ul>
                                    <li class="level2_links"><a href="/CurrentQuarter/ByRegion">By region</a></li>
                                    <li class="level2_links"><a href="/CurrentQuarter/ByState">By state</a></li>
                                    <li class="level2_links"><a href="/CurrentQuarter/ByIndustry">By industry</a></li>
                                    <li class="level2_links"><a href="/CurrentQuarter/BySoD">By stage of development</a></li>
                                    <li class="level2_links"><a href="/CurrentQuarter/BySequence">By financing sequence</a></li>
                                    <li class="level2_links"><a href="/CurrentQuarter/QualifyingInvestments">By investee company</a></li>
                                    <li class="level2_links"><a href="/CurrentQuarter/VCFirm">VC firm</a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="root_links"><a class="root_links_anchor" href="/HistoricTrends/CustomQueryHistoricTrend">Historical trend data</a></li>
                        <li class="root_links"><a class="root_links_anchor" href="/Definitions/Definitions">Definitions</a></li>
                        <li class="root_links"><a class="root_links_anchor" href="/NewsFeed">News</a></li>

                        <li class="root_links">
                            <a class="root_links_anchor">Help/FAQ</a>
                            <div class="navDropdown">
                                <ul> 
                                    <li class="level2_links"><a href="/HelpFAQ/HelpFAQ">Help/FAQ</a></li>
                                    <li class="level2_links"><a href="/ContactUs/ContactUs">Contact MoneyTree™</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div> -->

            </div>

            <div id="content">
                <div id="MainDiv">
                    <a class="orangePageHeader">Investment by region</a>
                    <div id="ChartBackGroundDiv">
                        <div id="cartDivMasterContainer">
                            <div id="ChartDivCur"></div>
                            <div id="ToolTipContainer">
                                <img id="TTpin" src="Images/Pin.png"/>
                                <div id="TTHeader">
                                    <div id="TTDetailsDiv"></div>
                                    <div id="percentTextDiv">
                                        <div id="TTPercentChangeDiv"></div>
                                        <a id="percentText">($)Qtr/Qtr</a>
                                    </div>
                                </div>
                                <div id="dataSlot1" class="TTRow">
                                    <div id="TTCurrentQuarterAmount"></div>
                                    <div id="TTCurrentQuarterDeals"></div>
                                    <div id="TTCurrentAmountPercent" class="percentTotal"></div>
                                </div>
                                <div id="dataSlot2" class="TTRow">
                                    <div id="TTPreviousQuarterAmount"></div>
                                    <div id="TTPreviousQuarterDeals"></div>
                                    <div id="TTPreviousAmountPercent" class="percentTotal"></div>
                                </div>

                                <p id="TTHelper">Click for drill-down options.</p>
                                <div id="DrillDivEnter">
                                    <div id="Stage" class="DrillOptionEnter">Stage</div>
                                    <div id="Category" class="DrillOptionEnter">Category</div>
                                </div>
                            </div>
                        </div>

                        <div id="chartSideBar">
                            <div id="DrillDownDiv">
                                <a id="drillLabel">Drill-down</a>
                                <div id="DrillDivEscape">
                                </div>
                            </div>
                            <div id="QtrTableOpts">
                                <div id="DLOpt" class="QtrOption">
                                    <img src="Images/Icon-Download-pdf.png" class="optionImg" /><a>Download</a>
                                </div>
                                <div id="PrintOpt" class="QtrOption">
                                    <img src="Images/Icon-Printer.png" class="optionImg" /><a>Print</a>
                                </div>
                                <div id="ViewOpt" class="QtrOption">
                                    <img src="Images/Icon-XLS-small.png" class="optionImg" /><a>View table</a>
                                </div>
                                <form action="/CurrentQuarter/toXlsFile" id="highchartsData" method="post">
                                    <input name="__RequestVerificationToken" type="hidden" value="AzGmd6ft9-i7a8Ri-aTCxp43M-acSFIC2IGvd9cSBnGaTUnN_XvN8y6sIyjXjtmPnEFyAz9etCXPuR-GtQib8zPsbeN7ZXEMzxaspDqO-3I1" />           
                                    <input type="hidden" id="q1Data" name="data1" value=""/>
                                    <input type="hidden" id="q2Data" name="data2" value=""/>
                                    <input type="hidden" id="xAxis" name="xAxis" value=""/>
                                    <input type="hidden" id="graphNames" name="graphNames" value=""/>
                                    <input type="hidden" id="title" name="title" value=""/>
                                </form>
                            </div>
                        </div>
                        <div class="arrow-down-cq"></div>
                    </div>
                    <div id="EditorBackGroundDiv">
                        <div id="EditorContentDiv">
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer">

<!--                 <div id="footernav">
                    <a href="http://www.PWC.com/gx/en/site-information/legal-disclaimer.jhtml" class="footerNav">Legal Disclaimer</a>
                    <a href="/Home/Privacy" class="footerNav">Privacy Statement</a>
                    <a href="http://www.PWC.com/gx/en/site-information/about-site-provider.jhtml" class="footerNav">About site provider</a>
                </div> -->
                <p>
                </p>
            </div>

        </div>
    </div>

</body>
</html>
