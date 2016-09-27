var jData;

$(document).ready(function () {
	$("#DLOpt").click(function () {
	    downloadPDFButton();
	});
	$("#PrintOpt").click(function () {
		window.print();
	});
	$("#ViewOpt").click(function () {
	    downloadXLSButton();
	});
});

function saveJson(json) {
    jData = json;
    jData.editorData = null;
}

function downloadPDFButton() {
    var str = $('#CurQtrTextHeading').text();
    highchart.exportChart({ type: 'application/pdf', filename: str });
};

function downloadXLSButton() {

    $("#q1Data").val(jData.dollarvalue_data1);
    $("#q2Data").val(jData.dollarvalue_data2);

    var graphNamesString = "";
    $(jData.groupBy).each(function () {
        graphNamesString += this + '~';
    });

    $("#xAxis").val(graphNamesString);
    $("#graphNames").val(jData.quarters);
    var tempStr = highchart.title.textStr;
    $("#title").val(tempStr);
    $('#highchartsData').submit();


    //var ops = {
    //    url: "/CurrentQuarter/toXlsFile",
    //    type: "POST",
    //    data: JSON.stringify(jData),
    //    dataType: "json",
    //    contentType: "application/json; charset=utf-8",
    //    async: true,
    //    success: downloadToBrowser
    //}

    //$.ajax(ops);
};

function downloadToBrowser(excelFile) {
    console.log(excelFile)
}
