var DrilldownInput = "";
var hasDrilled = false;
var DrillDefault;
var DrillRenderLocation = 'ChartDivCur';
var hoverState;
var CompanyLevel = false;

$(document).ready(function () {

    setSpinner('ChartDivCur');

    DrilldownInput = DrillDefault;
    $('.DrillOptionExit').hide();
    $('#drillLabel').hide();

    // Drill Down Buttons
    $('.DrillOptionEnter').click(function () {

        if ($(this).attr("id") == "Company")
            CompanyLevel = true;

        drillDownButtonPress(this);
    });


    hoverState = -1;
});

//Make Ajax call after drill down option selection
function makeDrillDownAjaxCall() {
    startSpinner();
    $.getJSON( "data/"+fileName, function(data) {

        var regionName = "";
        var stageName = "";
        var categoryName = "";
        var cnt = 0;

        $('#DrillDivEscape a').each(function(){
            var id = $(this).attr('id');
            if(cnt == 0){
                regionName = $(this).html();
                regionName = regionName.substr(2,regionName.length-1);
                if(id == "xStage"){
                    stageName = "123Full";
                }else if(id =="xCategory"){
                    categoryName = "123Full";
                }
            }
            if(cnt == 1){
                if(id == "xStage"){
                    categoryName = $(this).html();
                    categoryName = categoryName.substr(2,categoryName.length-1);
                }else if(id == "xCategory"){
                    stageName = $(this).html();
                    stageName = stageName.substr(2,stageName.length-1);
                }
            }
            cnt++;
        });

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
        var Stage = data.Stage;
        var Category = data.Category;
        var Amount_Raised_USD = data.Amount_Raised_USD;
        var groupBy = [];
        var groupBy_USD = [];
        var Length = Region.length;

        if(cnt == 1){
            if(stageName == "123Full"){
                for(i = 0; i < Length; i++){
                    if(Region[i] == regionName && Amount_Raised_USD[i] != null){
                        for(j = 0; j < groupBy.length; j++){
                            if(Stage[i] == groupBy[j]) break;
                        }
                        if(j == groupBy.length){
                            groupBy.push(Stage[i]);
                            groupBy_USD.push(parseInt(Amount_Raised_USD[i]));
                        }else{
                            groupBy_USD[j] += parseInt(Amount_Raised_USD[i]);
                        }
                    }
                }
                drilldownData.titleText = "Investment by Stage";
            }else if(categoryName == "123Full"){
                for(i = 0; i < Length; i++){
                    if(Region[i] == regionName && Amount_Raised_USD[i] != null){
                        for(j = 0; j < static_Categories.length; j++){
                            if(Category[i] == static_Categories[j]) break;
                        }
                        if(j < static_Categories.length){
                            for(j = 0; j < groupBy.length; j++){
                                if(Category[i] == groupBy[j]) break;
                            }
                            if(j == groupBy.length){
                                groupBy.push(Category[i]);
                                groupBy_USD.push(parseInt(Amount_Raised_USD[i]));
                            }else{
                                groupBy_USD[j] += parseInt(Amount_Raised_USD[i]);
                            }
                        }
                    }
                }
                drilldownData.titleText = "Investment by Category";
            }
        }else if(cnt == 2){
            if(stageName == ""){
                for(i = 0; i < Length; i++){
                    if(Region[i] == regionName && Category[i] == categoryName && Amount_Raised_USD[i] != null){
                        for(j = 0; j < groupBy.length; j++){
                            if(Stage[i] == groupBy[j]) break;
                        }
                        if(j == groupBy.length){
                            groupBy.push(Stage[i]);
                            groupBy_USD.push(parseInt(Amount_Raised_USD[i]));
                        }else{
                            groupBy_USD[j] += parseInt(Amount_Raised_USD[i]);
                        }
                    }
                }
                drilldownData.titleText = "Investment by Stage";
            }else if(categoryName == ""){
                for(i = 0; i < Length; i++){
                    if(Region[i] == regionName && Stage[i] == stageName && Amount_Raised_USD[i] != null){
                        for(j = 0; j < static_Categories.length; j++){
                            if(Category[i] == static_Categories[j]) break;
                        }
                        if(j < static_Categories.length){
                            for(j = 0; j < groupBy.length; j++){
                                if(Category[i] == groupBy[j]) break;
                            }
                            if(j == groupBy.length){
                                groupBy.push(Category[i]);
                                groupBy_USD.push(parseInt(Amount_Raised_USD[i]));
                            }else{
                                groupBy_USD[j] += parseInt(Amount_Raised_USD[i]);
                            }
                        }
                    }
                }
                drilldownData.titleText = "Investment by Category";
            }
        }
        drilldownData.groupBy = groupBy;
        drilldownData.groupBy_USD = groupBy_USD;
        drilldownData.editorData = null;

        displayDrilledQuarterChart(drilldownData);
    });
};

function drillDownButtonPress(buttonID) {
    if ($('#TTDetailsDiv').text() != "") {

        $(buttonID).hide();

        if ($('#DrillDivEnter div.DrillOptionEnter').filter(':hidden').length == $('#DrillDivEnter div.DrillOptionEnter').length) {
            $('#TTHelper').hide();
        }

        $('#drillLabel').show();

        DrilldownInput += $('#TTDetailsDiv').text() + "^" + $(buttonID).text() + ":";


        $('#DrillDivEscape').append('<a id="x' + $(buttonID).text() + '" class="DrillOptionExit">' + "X "  + $('#TTDetailsDiv').text() + '</a>');

        var paramButton = "#x" + $(buttonID).text();

        $(paramButton).click(function () {
            var rewind = $(this).attr('id').substring(1);
            backButton(rewind);
        });

        makeDrillDownAjaxCall();
        clearChartTooltip();
        hoverState = -1;

    }
}

function backButton(rewind) {


    $('#TTHelper').show();
    $('#ChartBackGroundDiv').height(460);


    var tempIndex = DrilldownInput.indexOf(rewind);
    var splitIndex = DrilldownInput.lastIndexOf(":", tempIndex);

    //button restore to DrillDivEnter
    var button = DrilldownInput.substring(splitIndex).replace(/:(.*?)\^/g, " ").split(/[ :]/);
    for (var i = 0; i < button.length; i++) {
        if (button[i] != "") {
            var reversDrillDown = '#' + button[i].substring();
            $(reversDrillDown).show();
            if(reversDrillDown == "#Company"){
                CompanyLevel = false;
            }
            reversDrillDown = '#x' + button[i].substring();
            $(reversDrillDown).remove();
        }
    }
    // make change to drilldowninput

    DrilldownInput = DrilldownInput.substring(0, splitIndex + 1);

    if (DrilldownInput == DrillDefault) {
        makeDefaultAjaxCall();
        $('#drillLabel').hide();
    } else {
        makeDrillDownAjaxCall();
    }
    clearChartTooltip();
    hoverState = -1;

}


function quarterTextToggle(year) {
    if (year != null) {
        var pattern = "Q[1234] \d{4}";
        if (year.match(pattern)) {
            return year.substring(3, 7) + '-' + year.charAt(1);
        } else {
            return 'Q' + year.charAt(5) + " " + year.substring(0, 4);
        }
    }
}




function pullDrillBy(str) {

    var drillArray = new Array();

    var start = str.indexOf(':');
    var end = str.indexOf('^');

    if (start == -1 || end == -1) {
        return drillArray;
    }

    drillArray.push(" in " + str.substring(start + 1, end));
    drillArray = drillArray.concat(pullDrillBy(str.substring(end + 1)));

    return drillArray;
}

//Draw chart given the data
function displayDrilledQuarterChart(curQtrData) {
    saveJson(curQtrData);
    stopSpinner();

    if (curQtrData.XAxisTic == "Loggin Required") {
        var pathName = window.location.pathname;
        var index = pathName.indexOf('/');
        pathName = pathName.substring(index);
        window.location.href = "/Account/Login?ReturnUrl="+escape(pathName);
    } else {

        stickyTTToggle = -1;

        var chart = $.extend({}, drilledBlueprint);

        // if (curQtrData.titleText.indexOf("by Stage") > -1) {
        //     $.extend(true, chart, StageChartCustomizations);
        // } else if (curQtrData.titleText.indexOf("by Sequence") > -1) {
        //     $.extend(true, chart, SequenceChartCustomizations);
        // } else if (curQtrData.titleText.indexOf("by Industry") > -1) {
        //     $.extend(true, chart, IndustryChartCustomizations);
        // }
        // else {
            $.extend(true, chart, NormalChartCustomizations);
        // }

        if (chart.xAxis == null)
            chart.xAxis.push({ categories: curQtrData.groupBy });
        else
            chart.xAxis.categories = curQtrData.groupBy;

        chart.title.text = "Investments" + pullDrillBy(DrilldownInput) + curQtrData.titleText.substring(10); // the word investment has length 10

        chart.series[0].name = quarterTextToggle(curQtrData.quarters[1]);
        chart.series[0].data = curQtrData.groupBy_USD;

        var thisQuarter = curQtrData.groupBy_USD;

        if (curQtrData.groupBy_USD != "No Data") {
            setYLabelFormat(chart, thisQuarter,  CompanyLevel);
        }

        if (curQtrData.titleText.indexOf("by State") > -1) {
            var pixHeight = 20 * curQtrData.groupBy.length;
            var minHeight = 460;
            if (pixHeight < minHeight)
                pixHeight = minHeight;
            chart.chart.height = pixHeight;
            $('#ChartBackGroundDiv').height(pixHeight + 20);
        }

        highchart = new Highcharts.Chart(chart);
        setTotals();
    }
}

function setYLabelFormat(chart, thisQuarter, companyLevel) {
    var largest = thisQuarter[0];
    var i = 0;
    while (i < thisQuarter.length) {
        if (largest < thisQuarter[i]) {
            largest = thisQuarter[i];
        }
        i++;
    }

    var chartCap = largest * 4 / 3
    var divider = 1000000000;
    var units = "bil";
    if (chartCap < divider * 2) {
        divider = divider / 1000;
        units = "mil";
        if (chartCap < divider * 2) {
            units = "K";
            divider = divider / 1000;
        }
    }
    if (CompanyLevel) {
        chart.xAxis.labels.formatter = function () {
            return '<a class="companyLevel" onclick="OpenCompanyInNewWindow(\'' + this.value + '\')">' + this.value + '</a>';
        }
        var pixHeight = 20 * chart.xAxis.categories.length;
        var minHeight = 460;
        if (pixHeight < minHeight)
            pixHeight = minHeight;
        chart.chart.height = pixHeight;
        $('#ChartBackGroundDiv').height(pixHeight + 20);
    }
    else {
        chart.chart.height = 460;
        $('#ChartBackGroundDiv').height(460);
    }

    chart.yAxis.labels.formatter = function () {
        return '$' + (this.value / divider) + units;
    }
}

function quarterDrillDownMouseOver(event, sender) {
    if (hoverState != sender.x / 2 || stickyTTToggle < 0) {
        hoverState = sender.x / 2;
        if (drillDownMouseover(event, sender)) {
            $('#TTPreviousQuarterAmount').text($('#TTPreviousQuarterAmount').text());
        }
    }
}

function drillDownMouseover(event, sender) {
    if (stickyTTToggle < 0) {

        $('#ToolTipContainer').show();

        $('#TTDetailsDiv').text(sender.category);

        var xAxisMarker = sender.x;

        var PreviousValue = highchart.series[0].data[xAxisMarker].y;

        $('#TTPreviousQuarterAmount').text(TTFormat(highchart.series[0].name) + commaSeparateNumber(PreviousValue));

        var finalHeight;
        var finalLeft;
        if (event.type == 'click') {
            finalHeight = $(event.target).attr('y')
            finalLeft = $(event.target).attr('x')
        } else {
            var container_offset = $(event.target.series.chart.container).offset();
            var container_width = $(event.target.series.chart.container).width();
            var container_height = $(event.target.series.chart.container).height();

            var topFinal = (container_height - event.target.plotX) - 80;
            var leftFinal = container_offset.left / 2 + (container_width - event.target.plotY);

            if (topFinal > container_height - $('#ToolTipContainer').height() - 150) {
                topFinal = container_height - $('#ToolTipContainer').height() - 155;
            }
            if (leftFinal > container_width - $('#ToolTipContainer').width() - 30) {
                leftFinal = container_width - $('#ToolTipContainer').width() - 30;
            }
        }

        $('#ToolTipContainer').css({
            top: topFinal,//- $('#ToolTipContainer').height() + 35,// - $('#chart_tooltip').height() -d_to_mouse,
            left: leftFinal// + 65 + (e.target.plotX - 15 >= container_width / 2 ? -$('#ToolTipContainer').width() : 10),
        });
        return true;
    }
    return false;
}

function getChart() {
    return highchart;
}

var drilledBlueprint = {
    chart: {
        zoomType: 'xy',
        type: 'bar',
        height: 460,
        renderTo: "ChartDivCur"
    },
    exporting: {
        enabled: false
    },
    legend: {
        reversed: true
    },
    credits: {
        enabled: false
    },
    title: {
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        title: {
            text: null
        },
        labels: {
            useHTML: true,
            formatter: function () {
                return '<a>' + this.value + '</a>';
            },
            style: { fontSize: "9px" }
        }
    },
    yAxis: {
        title: {
            text: 'Total Investment Amount',
        },
        labels: {
            formatter: function () {
            },
        }
    },
    tooltip: false,
    plotOptions: {
        series: {
            groupPadding: 0.1,
            pointWidth: 9,
            borderWidth: 0,
            cursor: 'pointer',
            point: {
                events: {
                    mouseOver: function (e) {
                        quarterDrillDownMouseOver(e, this);
                    },
                    click: function(e){
                        stickyAdjuster(e, this);
                    }
                }
            }
        }
    },
    series: [{
        color: '#dc6900'

    }]
};

var StageChartCustomizations = {
    plotOptions: {
        series: { pointWidth: 23 }
    },
    xAxis: {
        labels: {
            style: { fontSize: "12px" }
        }
    }
};

var SequenceChartCustomizations = {
    plotOptions: {
        series: { pointWidth: 56 }
    },
    xAxis: {
        labels: {
            style: { fontSize: "12px" }
        }
    }
};

var IndustryChartCustomizations = {
    xAxis: {
        labels: {
            style: { fontSize: "10px" }
        }
    }
};

var NormalChartCustomizations = {
    plotOptions: {
        series: { pointWidth: 9 }
    },
    xAxis: {
        labels: {
            style: { fontSize: "9px" }
        }
    }
};
