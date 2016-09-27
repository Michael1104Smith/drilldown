// Note that byRegion.js, byIndustry.js ect. can be combined into a single file since all these have very similar functionality. 
// But have kept separate to keep the code simple and clean. And it also helps in case we decide to do different things witht these pages tomorrow.
// The same is true for the View pages.
// The only overhead would be that the server will have to host a few additional javascript files which is ok.
// The Comments will not be send to the browser as long as EnableOptimization property of BundleTable is set to true in BundleConfig class.

var highchart;

$(document).ready(function () {
    makeDefaultAjaxCall();

    DrillDefault = "Region:";
    $('#Region').remove();
});

// To reetreive JSON data and display the chart
function makeDefaultAjaxCall() {
    
    $.getJSON( "data/"+fileName, function(data) {
        var drilldownData = {};
        var Funded_At = data.Funded_At;
        var quarters = [Funded_At[0],Funded_At[0]];
        var i, j;
        for(i = 1; i < Funded_At.length; i++){
            if(quarters[0] > Funded_At[i]) quarters[0] = Funded_At[i];
            if(quarters[1] < Funded_At[i]) quarters[1] = Funded_At[i];
        }
        drilldownData.quarters = quarters;
        drilldownData.graph = null;

        var Region = data.Region;
        var Amount_Raised_USD = data.Amount_Raised_USD;
        var groupBy = [];
        var groupBy_USD = [];

        var RegionLength = Region.length;

        for(i = 0; i < RegionLength; i++){

            if(Amount_Raised_USD[i] != null){
                for(j = 0; j < static_Regions.length; j++){
                    if(Region[i] == static_Regions[j]) break;
                }

                if(j < static_Regions.length){
                    for(j = 0; j < groupBy.length; j++){
                        if(Region[i] == groupBy[j]) break;
                    }
                    if(j == groupBy.length){
                        groupBy.push(Region[i]);
                        groupBy_USD.push(parseInt(Amount_Raised_USD[i]));
                    }else{
                        groupBy_USD[j] += parseInt(Amount_Raised_USD[i]);
                    }
                }
            }
        }
        drilldownData.groupBy = groupBy;
        drilldownData.groupBy_USD = groupBy_USD;
        drilldownData.titleText = "Investment by Region";
        drilldownData.editorData = null;

        onSuccess(drilldownData);
    });
}

//Call the chart redraw function everytime you get the posted JSON data.
function onSuccess(data) {
    displayCurrentQuarterChart(data);
}

function displayCurrentQuarterChart(curQtrData) {

    saveJson(curQtrData);

    var chart = $.extend({}, drilledBlueprint);
    chart.title.text = curQtrData.titleText;

    chart.xAxis.categories = curQtrData.groupBy;


    // chart.series[1].name = quarterTextToggle(curQtrData.quarters[0]);
    // chart.series[1].data = curQtrData.groupBy_USD;

    chart.series[0].name = quarterTextToggle(curQtrData.quarters[1]);
    chart.series[0].data = curQtrData.groupBy_USD;

    var yr = curQtrData.quarters[0].slice(0, 4);
    var qtr = curQtrData.quarters[0].slice(5);

    var thisQuarter = curQtrData.groupBy_USD;
    // var lastQuarter = curQtrData.groupBy_USD;
    setYLabelFormat(chart, thisQuarter, false);

    $('#EditorContentDiv').html(curQtrData.editorData);

    highchart = new Highcharts.Chart(chart);
    setTotals();
}
