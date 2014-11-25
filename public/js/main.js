// The initialize function is required for all apps.
Office.initialize = function (reason) {
    
    $(document).ready(function() {
        //var MyArray = [['Berlin'],['Munich'],['Duisburg']];
        //Office.context.document.setSelectedDataAsync(MyArray, { coercionType: 'matrix' });   


        function writeTable(tableData, range, tableId){

            var myTable = new Office.TableData();
            myTable.rows = tableData;

            Office.context.document.bindings.addFromNamedItemAsync(range, Office.BindingType.Table, { id: tableId }, function (asyncResult) {  
                if (asyncResult.status == "failed") {  
                    write('Error: ' + asyncResult.error.message);  
                }  
                else {  
                    // Write data to the new binding.  
                    Office.select("bindings#" + tableId).setDataAsync(myTable, { coercionType: "table" }, function (asyncResult) {  
                        //Office.select("bindings#" + tableId).getDataAsync(function (asyncResult) {showMessage(asyncResult.value[0][0])});
                        if (asyncResult.status == "failed") {  
                               write('Error: ' + asyncResult.error.message);  
                        }
                    });
                }
            });
        }

           
        function writeMatrix(matrixData, range, matrixId){
            
            Office.context.document.bindings.addFromNamedItemAsync(range, "matrix", { id: matrixId }, function (asyncResult) {  
                if (asyncResult.status == "failed") {  
                    write('Error: ' + asyncResult.error.message);  
                }  
                else {  
                    // Write data to the new binding.  
                    Office.select("bindings#" + matrixId).setDataAsync(matrixData, { coercionType: "matrix" }, function (asyncResult) {  
                        //Office.select("bindings#" + matrixId).getDataAsync(function (asyncResult) {showMessage(asyncResult.value[0][0])});
                        if (asyncResult.status == "failed") {  
                               write('Error: ' + asyncResult.error.message);  
                        }
                    });
                }
            });
            
        }

        function clearBinding(id, type) {
            var _col, _row;
            var _dummy = [];
            var myTable2 = new Office.TableData();

            Office.context.document.bindings.getByIdAsync(id, function (asyncResult) {
                _col = asyncResult.value.columnCount;
                _row = asyncResult.value.rowCount;
                for (i=0; i<_row; i++){
                        _dummy[i]=[];
                    for (x=0; x<_col; x++){
                        _dummy[i].push('');
                    }
                }
                myTable2.rows=_dummy;
                Office.select("bindings#" + id).setDataAsync((type=="table")?myTable2:_dummy, { coercionType: type }, function (asyncResult) {  
                    if (asyncResult.status == "failed") {  
                        write('Error: ' + asyncResult.error.message);  
                    }
                });
            });
        }
        
        function getHeaders(headerObj, key){
            var h = [];
            for (i = 0; i < headerObj.length; i++) {
                h.push(headerObj[i][key]);
            }
            return h;
        }

        //http://jsfiddle.net/d41vt1h5/4/
        function getColumnReference(number){
            var letter = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            var ref = (number < 27)?letter[number-1]:letter[((number-(number % 26 || 26))/26)-1]+letter[((number % 26 || 26)-1)];
            return ref;
        }


//"query":{"start-date":"2014-10-26","end-date":"2014-11-08","ids":"ga:64744393","dimensions":"ga:date","metrics":["ga:sessions"],"start-index":1,"max-results":1000},"itemsPerPage":1000,"totalResults":14,"selfLink":"https://www.googleapis.com/analytics/v3/data/ga?ids=ga:64744393&dimensions=ga:date&metrics=ga:sessions&start-date=2014-10-26&end-date=2014-11-08","profileInfo":{"profileId":"64744393","accountId":"35344866","webPropertyId":"UA-35344866-1","internalWebPropertyId":"63131279","profileName":"CartridgeWebwinkel","tableId":"ga:64744393"}

        if (result.rows){

            var offset = 15;
            var columnRef = getColumnReference(result.columnHeaders.length);
            var rowLength = result.rows.length;
            var headers = getHeaders(result.columnHeaders, 'name');

            clearBinding("query","matrix");
            clearBinding("columnNames","table");
            clearBinding("resultRows","table");

            setTimeout(function(){
                writeMatrix([
                    ['ids', result.query['ids']],
                    ['start-date', result.query['start-date']],
                    ['end-date', result.query['end-date']],
                    ['metrics', result.query['metrics'].toString()],
                    ['dimensions', result.query['dimensions']],
                    ['sort', (result.query['sort'] || 'not set')],
                    ['filters', (result.query['filters'] || 'not set')],
                    ['max-results', result.query['max-results']],
                    ['samplingLevel', (result.query['samplingLevel'] || 'not set')],
                    ['start-index', result.query['start-index']],
                    ['',''],
                    ['totalResults', result.totalResults]
                ], "Blad1!A1:B12", "query");       
                writeTable([headers], "Blad1!A14:"+columnRef+"14", "columnNames"); 
                writeTable(result.rows, "Blad1!A15:"+columnRef+(offset + rowLength), "resultRows");
            },1500);
        }       

    });
}

$(document).ready(function() {


//////////////////////////////////////////////////////////////////////////////////////////
// Variables

$accounts = $('#accountSummaries_accounts');

$properties = $('#accountSummaries_properties');

$profiles = $('#accountSummaries_profiles');

var account_index = 0, property_index = 0;

////////////////////////////////
// Events

$accounts.change(function () {

	account_index = $('option:selected', this).index();

	updatePropertiesCheckbox();

	updateProfilesCheckbox();
	
});

$properties.change(function () {

	property_index = $('option:selected', this).index();

	updateProfilesCheckbox();
	
});

///////////////////////////////
// Functions

function updatePropertiesCheckbox() {
 
    var _properties = data.items[account_index].webProperties;
    
    $properties.html('');
    
    for (var i = 0; i < _properties.length; i++) {

    	$properties

    		.append('<option value=\'' + _properties[i].id + '\'>' + _properties[i].name + '</option>');

    		//.find('option:first').attr('selected', 'selected');
    
    };
	
	$properties.trigger("change"); // select2 update function
}

function updateProfilesCheckbox() {
 
    var _profiles = data.items[account_index].webProperties[property_index].profiles;
    
    $profiles.html('');
    
    for (var i = 0; i < _profiles.length; i++) {

    	$profiles

    		.append('<option value=\'ga:' + _profiles[i].id + '\'>' + _profiles[i].name + '</option>');

    		//.find('option:last').attr('selected', 'selected');
    
    };
	
	$profiles.trigger("change"); // select2 update function
}

// Init

//$profiles.find('option:last').attr('selected', 'selected');

$('.select2').select2({width: '100%'});
if (metrics.length > 0) {
    $('#accountSummaries_metrics').select2("val", metrics);
    
    if (dimensions.length > 0) {
        $('#accountSummaries_dimensions').select2("val", dimensions);
    }

    $('#accountSummaries_accounts').val(account);
    $accounts.change();
    $('#accountSummaries_properties').val(property);
    $properties.change();
    $('#accountSummaries_profiles').val(profile);
}

$('.datepicker').datepicker({
    format: "yyyy-mm-dd",
    endDate: "+",
    autoclose: true
});


// editable XX:
//http://jsfiddle.net/r2g96p5q/2/, http://jsfiddle.net/r2g96p5q/13/
//option values ook veranderen, na remove, en insert option
// new fork
// http://jsfiddle.net/955hwpep/8/

/////////////////////////////////////////////////////////////////////////////////////////
});
