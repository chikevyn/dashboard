 

 function numberWithCommas(number) {

            if (number == '' || number == undefined) {

                return '';

            }

            var parts = number.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return parts.join(".");
}


 // Payment Stream
    $(document).ready(function () {

            $('#company').val(['AMNI','CHEVRON (CNL)']).trigger('change');

            $('#year').val(['2013']).trigger('change');

            initPaymentStreamDefaults();



            // Change handler on Checkbox
            $('input[type=checkbox].selection, #company, #year').change(function () {

                var series = [];
                var companies = [];
                var years = [];

                $('input[type=checkbox].selection:checked').each(function (ix, el) {
                    series.push($(this).val());

                });

                $('#company option:selected').each(function (ix, el) {
                    companies.push($(this).val());
                });

                $('#year option:selected').each(function (ix, el) {
                    years.push($(this).val());
                });


                getPaymentStreamAjaxData(series.join(), companies, years);
            });


            var options = {
                chart: {
                    renderTo: 'pcontainer',
                    type: 'column'
                },

                title: {
                    text: 'Payment Streams by Company',
                    x: -20 //center
                },

                xAxis: {
                    categories: [],
                    title: {
                        text: 'Year'
                    }
                },

                yAxis: {
                    title: {
                        text: 'Value in USD'
                    },

                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },

                // plotOptions: {
                //     column: {
                //         stacking: 'normal',
                //         dataLabels: {
                //             enabled: true,
                //             color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                //         }
                //     }
                // },

                tooltip: {
                    valuePrefix: '$'
                },

                legend: {


                    layout: 'horizontal',

                    align: 'right',

                    verticalAlign: 'top',

                    x: 20,

                    y: 80,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },
                credits: {
                    enabled: false
                  },


                series: []

            };

            function getPaymentStreamAjaxData(series, companies, years) {
                var qry = "series=" + series + "&companies=" + companies + "&years=" + years;

                // console.log(qry);

                $.getJSON("data/data-basic-multi-line.php?" + qry, function (json) {

                    // Clear series
                    options.series = [];
                    options.title.text = "Payment Streams for <b>" + companies + "</b>";

                    var rows = [];

                    // Store the series data
                    $.each(json["series"], function (ix, data) {
                        // console.log(data);
                        options.series[ix] = data;

                        if(data.data === undefined || data.data.length < 1){
                            return;
                        }

                        $.each(data.data, function (i, d) {

                            var row = {
                                "stream": data.name,
                                "year": d[0],
                                "value": d[1],
                                "company": d[2]
                            }

                            rows.push(row);
                        });
                    });

                    chart = new Highcharts.Chart(options);

                    var sum = $.pivotUtilities.aggregatorTemplates.sum;
                    var numberFormat = $.pivotUtilities.numberFormat;
                    var intFormat = numberFormat({digitsAfterDecimal: 0});

                    $("#paymentstream-output").pivot(
                        rows,
                        {
                            rows: ["stream"],
                            cols: ["company", "year"],
                            aggregator: sum(intFormat)(["value"])
                        }
                    );

                });
            }

            function initPaymentStreamDefaults() {
                document.getElementById("petroleum_profit_tax_us_dollar").checked = true;

                var pre_selected_company = ['AMNI', 'CHEVRON (CNL)'];
                var pre_selected_years = ['2013'];
                var pre_selected_series = $('.selection:checked').val();

                // Pre-select
                getPaymentStreamAjaxData(pre_selected_series, pre_selected_company, pre_selected_years);
            }

            
	});


  // Liftings Quick Facts
    $(document).ready(function () {
            initDefaults();

            // Change handler on Checkbox
            $('#year_crude').change(function () {
                var series = ['total_lifting', 'nnpc_lifting', 'others_lifting'];
                var year_crude = $("#year_crude").val();
                getAjaxData(series.join(), year_crude);
            });


            var options = {
                chart: {
                    renderTo: 'sccontainer',
                    type: 'column'
                },
                title: {
                    text: 'Lifting Data',
                    x: -20 //center
                },

                xAxis: {
                    categories: [],
                    title: {
                        text: 'Year'
                    }
                },

                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value in Bbl'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ' Bbl'
                },
                credits: {
                    enabled: false
                  },

                legend: {


                    layout: 'horizontal',

                    align: 'right',

                    verticalAlign: 'top',

                    x: 15,

                    y: 50,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },


                series: []
            };


            function getAjaxData(series, year_crude) {
                var qry = "series=" + series + "&year_crude=" + year_crude;

                $.getJSON("data/data-crude2.php?" + qry, function (json) {

                    // Clear series
                    options.series = [];

                    // Store the series data
                    $.each(json["series"], function (ix, data) {
                        options.series[ix] = data;

                        var $label = $("#sp_" + data.name);
                        var val = json[data.name];

                        // Populate HTML boxes
                        $label.html("$" + numberWithCommas(val));
                    });

                    chart = new Highcharts.Chart(options);
                });
            }


            function initDefaults() {


                var $first_selected = $("#year_crude option:last").attr('selected', 'selected');


                var pre_selected_series1 = ['total_lifting', 'nnpc_lifting', 'others_lifting'];


                getAjaxData(pre_selected_series1, 2014);


            }

    });


    //Liftings

    $(document).ready(function () {


            initDefaults();


            // Change handler on Checkbox


            $('input[type=checkbox].select,#to_year_crude, #from_year_crude').change(function () {


                var series = [];


                $('input[type=checkbox].select:checked').each(function (ix, el) {

                    series.push($(this).val());

                });


                //var company = $("#company").val();

                var from_year_crude = $("#from_year_crude").val();

                var to_year_crude = $("#to_year_crude").val();


                getAjaxData(series.join(), from_year_crude, to_year_crude);

            });


            var options = {

                chart: {

                    renderTo: 'ccontainer',

                    type: 'column'

                },

                title: {

                    text: 'Lifting Data',

                    x: -20 //center

                },
                credits: {
                    enabled: false
                  },

                xAxis: {

                    categories: [],

                    title: {

                        text: 'Year'

                    }

                },

                yAxis: {

                    min: 0,

                    title: {

                        text: 'Value in Bbl'

                    },

                    plotLines: [{

                        value: 0,

                        width: 1,

                        color: '#808080'

                    }]

                },

               


                tooltip: {


                    valueSuffix: ' Bbl'

                },


                legend: {


                    layout: 'horizontal',

                    align: 'right',

                    verticalAlign: 'top',

                    x: 10,

                    y: 80,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },


                series: []

            };


            function getAjaxData(series, from_year_crude, to_year_crude) {


                var qry = "series=" + series + "&from_year_crude=" + from_year_crude + "&to_year_crude=" + to_year_crude;


                $.getJSON("data/data-crude.php?" + qry, function (json) {



                    // Clear series

                    options.series = [];


                   
                    // Store the series data

                    $.each(json["series"], function (ix, data) {

                        options.series[ix] = data;

                    });


                    //chart = new Highcharts.Chart(options);

                    chart = new Highcharts.Chart(options);


                });

            }


            function initDefaults() {


                var $first_checkbo = document.getElementById("nnpc_lifting").checked = true;


                var $checkedbox = $('.select:checked').val();


                var pre_selected_series1 = $checkedbox;


                //alert(pre_selected_series1);


                var pre_selected_from = $('#from_year_crude option:first').val();

                var pre_selected_to = $('#to_year_crude option:first').val();


                // Pre-select

                getAjaxData(pre_selected_series1, 1999, 2007);


            }

    });


    // Revenue Quick Facts

    $(document).ready(function () {


            initDefaults();


            // Change handler on Checkbox


            $('#year_revenue').change(function () {


                var series = ['total_revenue_from_crude_and_gas_sales', 'total_flows_to_federation_account', 'total_financial_flows_from_oil_and_gas_sector'];


                //var company = $("#company").val();

                var year_revenue = $("#year_revenue").val();


                getAjaxData(series.join(), year_revenue);

            });


            var options = {

                chart: {

                    renderTo: 'rscontainer',

                    type: 'column'

                },

                title: {

                    text: 'Revenue Data',

                    x: -20 //center

                },
                credits: {
                    enabled: false
                },

                xAxis: {

                    categories: [],

                    title: {

                        text: 'Year'

                    }

                },

                yAxis: {

                    min: 0,

                    title: {

                        text: 'Value (US $)'

                    },

                    plotLines: [{

                        value: 0,

                        width: 1,

                        color: '#808080'

                    }]

                },

                // tooltip: {

                //     valuePrefix: '$'

                // },


                tooltip: {

                    valuePrefix: '$'

                },


                legend: {


                    layout: 'horizontal',

                    align: 'right',

                    verticalAlign: 'top',

                    x: 20,

                    y: 80,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },

                series: []

            };


            function getAjaxData(series, year_revenue) {


                var qry = "series=" + series + "&year_revenue=" + year_revenue;


                $.getJSON("data/data-revenue2.php?" + qry, function (json) {



                    // Clear series

                    options.series = [];


                    //options.title.text = "Payment Streams for <b>" + company + "</b>";


                    // Store the series data

                    $.each(json["series"], function (ix, data) {

                        options.series[ix] = data;


                        var $label = $("#sp_" + data.name);

                        var val = json[data.name];


                        // Populate HTML boxes

                        $label.html("$" + numberWithCommas(val));

                    });


                    chart = new Highcharts.Chart(options);

                });

            }


            function initDefaults() {


                var $first_selected = $("#year_revenue option:last").attr('selected', 'selected');


                var pre_selected_series1 = ['total_revenue_from_crude_and_gas_sales', 'total_flows_to_federation_account', 'total_financial_flows_from_oil_and_gas_sector'];


                getAjaxData(pre_selected_series1, 2014);

            }

    });

     //Revenues

    $(document).ready(function () {


            initDefaults();


            // Change handler on Checkbox


            $('input[type=checkbox].selec,#to_year_revenue, #from_year_revenue').change(function () {


                var series = [];


                $('input[type=checkbox].selec:checked').each(function (ix, el) {

                    series.push($(this).val());

                });


                //var company = $("#company").val();

                var from_year_revenue = $("#from_year_revenue").val();

                var to_year_revenue = $("#to_year_revenue").val();


                getAjaxData(series.join(), from_year_revenue, to_year_revenue);

            });


            var options = {

                chart: {

                    renderTo: 'rcontainer',

                    type: 'column'

                },

                title: {

                    text: 'Revenue Data',

                    x: -20 //center

                },

                xAxis: {

                    categories: [],

                    title: {

                        text: 'Year'

                    }

                },

                yAxis: {

                    min: 0,

                    title: {

                        text: 'Value (US $)'

                    },

                    plotLines: [{

                        value: 0,

                        width: 1,

                        color: '#808080'

                    }]

                },
                credits: {
                    enabled: false
                },

                // tooltip: {

                //     valuePrefix: '$'

                // },


                tooltip: {

                    valuePrefix: '$'

                },


                legend: {


                    layout: 'horizontal',

                    align: 'right',

                    verticalAlign: 'top',

                    x: 20,

                    y: 80,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },

                series: []

            };


            function getAjaxData(series, from_year_revenue, to_year_revenue) {


                var qry = "series=" + series + "&from_year_revenue=" + from_year_revenue + "&to_year_revenue=" + to_year_revenue;


                $.getJSON("data/data-revenue.php?" + qry, function (json) {



                    // Clear series

                    options.series = [];


                    //options.title.text = "Payment Streams for <b>" + company + "</b>";


                    // Store the series data

                    $.each(json["series"], function (ix, data) {

                        options.series[ix] = data;

                        //console.log(options.series[ix]);

                    });


                    chart = new Highcharts.Chart(options);

                });

            }


            function initDefaults() {


                var $first_checkbo = document.getElementById("total_flows_to_federation_account").checked = true;


                var $checkedbox = $('.selec:checked').val();


                var pre_selected_series1 = $checkedbox;


                //alert(pre_selected_series1);


                var pre_selected_from = $('#from_year_revenue option:first').val();

                var pre_selected_to = $('#to_year_revenue option:first').val();


                // Pre-select

                getAjaxData(pre_selected_series1, 1999, 2007);


            }

    });


    //Productions Quick Facts

    $(document).ready(function () {


            initDefaults();


            // Change handler on Checkbox


            $('#year_pro').change(function () {


                var series = ['total_oil_production', 'total_federation_entitlement', 'federal_export', 'domestic_crude_supply'];


                //var company = $("#company").val();

                var year_pro = $("#year_pro").val();


                getAjaxData(series.join(), year_pro);

            });


            var options = {

                chart: {

                    renderTo: 'sprocontainer',

                    type: 'column'

                },

                title: {

                    text: 'Production Data',

                    x: -20 //center

                },

                xAxis: {

                    categories: [],

                    title: {

                        text: 'Year'

                    }

                },

                yAxis: {

                    min: 0,

                    title: {

                        text: 'Value in Bbl'

                    },

                    plotLines: [{

                        value: 0,

                        width: 1,

                        color: '#808080'

                    }]

                },

                credits: {
                    enabled: false
                  },

                tooltip: {

                    //valuePrefix: 'Bbl'

                    valueSuffix: ' Bbl'

                },


               legend: {


                    layout: 'horizontal',

                    align: 'right',

                    verticalAlign: 'top',

                    x:20,

                    y: 30,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },

                series: []

            };


            function getAjaxData(series, year_pro) {


                var qry = "series=" + series + "&year_pro=" + year_pro;


                $.getJSON("data/data-pro2.php?" + qry, function (json) {



                    // Clear series

                    options.series = [];


                    //options.title.text = "Payment Streams for <b>" + company + "</b>";


                    // Store the series data

                    $.each(json["series"], function (ix, data) {

                        options.series[ix] = data;


                        var $label = $("#sp_" + data.name);

                        var val = json[data.name];


                        // Populate HTML boxes

                        $label.html(numberWithCommas(val));

                    });


                    chart = new Highcharts.Chart(options);

                });

            }


            function initDefaults() {


                var $first_selected = $("#year_pro option:last").attr('selected', 'selected');


                var pre_selected_series1 = ['total_oil_production', 'total_federation_entitlement', 'federal_export', 'domestic_crude_supply'];


                // Pre-select

                getAjaxData(pre_selected_series1, 2014);


            }

    });


    //Productions

    $(document).ready(function () {


            initDefaults();


            // Change handler on Checkbox


            $('input[type=checkbox].sele,#to_year_pro, #from_year_pro').change(function () {


                var series = [];


                $('input[type=checkbox].sele:checked').each(function (ix, el) {

                    series.push($(this).val());

                });


                //var company = $("#company").val();

                var from_year_pro = $("#from_year_pro").val();

                var to_year_pro = $("#to_year_pro").val();


                getAjaxData(series.join(), from_year_pro, to_year_pro);

            });


            var options = {

                chart: {

                    renderTo: 'procontainer',

                    type: 'column'

                },

                title: {

                    text: 'Production Data',

                    x: -20 //center

                },

                xAxis: {

                    categories: [],

                    title: {

                        text: 'Year'

                    }

                },

                yAxis: {

                    min: 0,

                    title: {

                        text: 'Value in Bbl'

                    },

                    plotLines: [{

                        value: 0,

                        width: 1,

                        color: '#808080'

                    }]

                },

                credits: {
                    enabled: false
                },

                tooltip: {

                    //valuePrefix: 'Bbl'

                    valueSuffix: ' Bbl'

                },


                legend: {


                    layout: 'vertical',

                    align: 'right',

                    verticalAlign: 'top',

                    x: -40,

                    y: 80,

                    floating: true,

                    borderWidth: 1,

                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

                    shadow: true

                },


                series: []

            };


            function getAjaxData(series, from_year_pro, to_year_pro) {


                var qry = "series=" + series + "&from_year_pro=" + from_year_pro + "&to_year_pro=" + to_year_pro;


                $.getJSON("data/data-pro.php?" + qry, function (json) {



                    // Clear series

                    options.series = [];


                    //options.title.text = "Payment Streams for <b>" + company + "</b>";


                    // Store the series data

                    $.each(json["series"], function (ix, data) {

                        options.series[ix] = data;

                    });


                    chart = new Highcharts.Chart(options);

                });

            }


            function initDefaults() {


                var $first_checkbo = document.getElementById("total_oil_production").checked = true;


                var $checkedbox = $('.sele:checked').val();


                var pre_selected_series1 = $checkedbox;


                //alert(pre_selected_series1);


                var pre_selected_from = $('#from_year_pro option:first').val();

                var pre_selected_to = $('#to_year_pro option:first').val();


                // Pre-select

                getAjaxData(pre_selected_series1, 1999, 2007);


            }

    });

