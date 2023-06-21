var table;

function setRequired() {
    $.each($('form').find('input, select, textarea'), function () {

        if ($(this).prop('required')) {
            var label = $('label[for="' + $(this).attr('id') + '"]');
            if (!$(label).find('span').hasClass('requiredIcon')) {
                $(label).html($(label).html() + '<span class="text-danger font-weight-bold"> *</span>');
            }
        }
    });
}

function clearForm(e) {
    var modal_attr = e.parents('form:first');
    var formVals = modal_attr.find('input:visible, select:visible, textarea:visible');

    formVals.each(function () {
        var elementType = $(this).attr('type');

        if (elementType === 'checkbox' || elementType === 'radio') {
            $(this).prop('checked', false);
        } else {
            $(this).val('');
        }
    });
}

$('#clear_form').click(function () {
    clearForm($(this));
    hideCountryDp.hidden = true;
    hideSiteDp.hidden = true;
    hideClientDp.hidden = true;
    hideCountryAndSiteDp.hidden = true;
});


$('#reset_search').click(function () {
    $('#form_container').slideDown();
    $('#table_container').slideUp();
    
    $('#clear_form').click();
    $('#dataTable tbody').empty();



    // Clean the dropdowns function
    function populateDropdown(id) {
        var content = '<option>.::Select::.</option>';

        $(id).empty().html(content);
    }
    populateDropdown("#sites_id");
    populateDropdown("#clients_id");
    populateDropdown("#projects_id");
});

$('#search_btn').click(function (e) {
    e.preventDefault();

    var modal_attr = $(this).parents('form:first');
    var formVals = modal_attr.find('input[required]:visible, select[required]:visible, textarea[required]:visible');
    
    var url_parameter = modal_attr[0].attributes.action.nodeValue;
    var data_parameter = modal_attr.serialize();

    modal_attr[0].checkValidity();

    if (formVals.length === $(formVals).filter(function () { return $(this).val(); }).length) {

        Swal.fire({
            title: 'Loading Results',
            //html: 'I will close in <b></b> milliseconds.',
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();                
            }
        });

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: url_parameter,
            data: data_parameter,
            cache: false,
            success: function (response) {

                if (response !== null) {
                    if (response.code === 1 && response.content.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'We apologize, but no results were found.'
                        });
                    }
                    else if (response.code === 1 && response.content.length > 0) {

                        table.destroy();
                        $('#dataTable tbody').empty();

                        var tablebody;

                        $.each(response.content, function (index, value) {
                            tablebody += '<tr>' +
                                '<td>' + value.parent_client_name + '</td>' +
                                '<td>' + value.sf_company_description + '</td>' +
                                '<td>' + value.sf_country + '</td>' +
                                '<td>' + value.site_name + '</td>' +
                                '<td>' + value.department_name + '</td>' +
                                '<td>' + value.lob_name + '</td>' +
                                '<td>' + value.sf_project_code + '</td>' +
                                '<td>' + value.blue + '</td>' +
                                '<td>' + value.red + '</td>' +
                                '<td>' + value.oracle_site_id + '</td>' +
                                '</tr > ';
                        });

                        $('#dataTable tbody').html(tablebody);

                        //table = $('#dataTable').DataTable();

                      
                        table = $('#dataTable').DataTable({
                            dom: 'Bfrtip',
                            lengthMenu: [
                                [10, 25, 50, -1],
                                [10, 25, 50, 'All']
                            ],
                            buttons: [
                                {
                                    extend: 'pageLength',
                                    text: 'Show',
                                    className: 'buttons-excel',
                                },

                                {
                                    extend: 'excel',
                                    text: 'Export Excel',
                                    className: 'buttons-excel',
                                },
                            ]
                        });

                        //$('#form_container').slideToggle(); 
                        //$('#table_container').slideToggle(); 

                        //$('#form_container').hide('slide');
                        //$('#table_container').show('slide');  

                        $('#form_container').slideUp();                        
                        $('#table_container').slideDown();


                        //$('#table_container').slideDown();
                        //$('#form_container').hide();                        
                        
                        
                        //$('#form_container').addClass('animate__animated animate__slideOutLeft');  
                        

                        //setTimeout(function () {
                        //    $('#form_container').hide();
                        //    $('#table_container').removeClass('hidden');
                        //    $('#table_container').addClass('animate__animated animate__slideInRight');
                        //}, 500);

                    }
                    else if (response.code === 0) {
                        console.log(e);

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        });
                    }
                }
            },
            error: function (e) {
                console.log(e);

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!'
                });
            }
        });
    }
    else {
        modal_attr[0].reportValidity();
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'All the fields (*) are required'
        });
    }
});


$(document).ready(function () {
    setRequired();
    table = $('#dataTable').DataTable();
    Form_.hidden = true;
    checkboxBlue.checked = true;
    btnHideForm.hidden = true;
    ttAdvSearch.hidden = true;
    hideCountryDp.hidden = true;
    hideSiteDp.hidden = true;
    hideClientDp.hidden = true;
    hideCountryAndSiteDp.hidden = true;
    clear_form.hidden = true;
});


// Dont allow use the back back buttom function
function DisableBackButton() {
    window.history.forward()
}
DisableBackButton();
window.onload = DisableBackButton;
window.onpageshow = function (evt) { if (evt.persisted) DisableBackButton() }
window.onunload = function () { void (0) }


// Dropdown functions

//function populateDropdown(element, data) {
//    var content = '<option>.::Select::.</option>';
//    $.each(data, function (index, val) {
//        content += `<option>${val}</option>`;
//    });
//    element.empty().html(content);
//}

//$("#country_id").change(function () {
//    var dropdown = $(this);
//    var selectVal = dropdown.val();
//    var sitesDropdown = $("#sites_id");
//    var clientsDropdown = $("#clients_id");
//    var projectsDropdown = $("#projects_id");
//    populateDropdown(sitesDropdown, []);
//    populateDropdown(clientsDropdown, []);
//    populateDropdown(projectsDropdown, []);


//    if (selectVal) {
//        $.ajax({
//            url: 'GetSites',
//            type: 'GET',
//            dataType: 'Json',
//            success: function (data) {
//                console.log(data);
//                var sitesDropdown = $("#sites_id");
//                populateDropdown(sitesDropdown, data);
//            },
//            error: function (xhr, status, error) {
//                console.log(xhr);
//                console.log(status);
//                console.log(error);
//            }
//        });
//    } else {
//        var sitesDropdown = $("#sites_id");
//        var clientsDropdown = $("#clients_id");
//        var projectsDropdown = $("#projects_id");
//        populateDropdown(sitesDropdown, []);
//        populateDropdown(clientsDropdown, []);
//        populateDropdown(projectsDropdown, []);
//    }
//});

//$("#sites_id").change(function () {
//    var sitesDropdown = $(this).val();
//    var countryDropdown = $("#country_id").val();
//    var clientsDropdown = $("#clients_id");
//    var projectsDropdown = $("#projects_id");
//    populateDropdown(clientsDropdown, []);
//    populateDropdown(projectsDropdown, []);

//    if (sitesDropdown) {
//        $.ajax({
//            url: 'GetClients?country=' + countryDropdown + "&sites=" + sitesDropdown,
//            type: 'GET',
//            dataType: 'Json',
//            success: function (data) {
//                console.log(data);
//                var clientsDropdown = $("#clients_id");
//                populateDropdown(clientsDropdown, data);
//            },
//            error: function (xhr, status, error) {
//                console.log(xhr);
//                console.log(status);
//                console.log(error);
//            }
//        });
//    } else {
//        var clientsDropdown = $("#clients_id");
//        var projectsDropdown = $("#projects_id");
//        populateDropdown(clientsDropdown, []);
//        populateDropdown(projectsDropdown, []);
//    }
//});

//$("#clients_id").change(function () {
//    var clientsDropdown = $(this).val();
//    var sitesDropdown = $("#sites_id").val();
//    var countryDropdown = $("#country_id").val();

//    var selectVal = clientsDropdown;
//    if (selectVal) {
//        $.ajax({
//            url: 'GetProjects?country=' + countryDropdown + "&sites=" + sitesDropdown + "&clients=" + clientsDropdown,//Esto se debe hacer con el helper                                        
//            type: 'GET',//se especifica el metodo (Post o get) por defecto queda en get
//            dataType: 'Json', // el tipo de datos que espera recibir
//            success: function (data) {//esta funcion se ejecuta si el ajax es exitoso (si se espera recibir informacion se debe agregar 'data' en los parametros de function)
//                console.log(data);
//                var content = '<option> .::Select::. </option>';
//                $.each(data, function (index, val) {
//                    content += `<option> ${val.sf_project_name} - ${val.sf_project_code}  </option>`;
//                });
//                $("#projects_id").empty();
//                $("#projects_id").html(content);
//            },
//            error: function (xhr, status, error) {//esta funcion se ejecta cuando hay un error se pueden pedir 3 parametros para averiguar el error 
//                console.log(xhr);
//                console.log(status);
//                console.log(error);
//            }
//        });
//    } else {
//        var content = '<option> .::Select::. </option>';
//        $("#projects_id").empty();
//        $("#projects_id").html(content);
//    }
//});



// Show and Hide forms Func


var checkboxBlue = document.getElementById('checkbox-team-blue');
var form_ = document.getElementById('Form_');
var show_btn = document.getElementById('show_form');
var keyInfo = document.getElementById('keyInfo');
var btnShowForm = document.getElementById('btnShowForm');
var btnHideForm = document.getElementById('btnHideForm');

var checkForSite = document.getElementById('checkForSite');



var site_id = document.getElementById('sites_id');
var client_id = document.getElementById('clients_id');
var project_id = document.getElementById('projects_id');
var ttAdvSearch = document.getElementById('ttAdvSearch');
var Form_ = document.getElementById('Form_');

var sitesDropdown = $("#sites_id");
var clientsDropdown = $("#clients_id");
var projectsDropdown = $("#projects_id");




document.getElementById('btnShowForm').addEventListener('click', function (e) {

    ttAdvSearch.hidden = false;
    Form_.hidden = false;
    checkboxBlue.checked = false;
    btnShowForm.hidden = true;
    btnHideForm.hidden = false;

    clear_form.hidden = false;
    $("#keyInfo").slideUp("slow")
});

document.getElementById('btnHideForm').addEventListener('click', function (e) {
    ttAdvSearch.hidden = true;
    keyInfo.hidden = false;
    Form_.hidden = true;
    checkboxBlue.checked = true;
    btnHideForm.hidden = true;
    btnShowForm.hidden = false;

    clear_form.hidden = true;
    $("#keyInfo").slideDown("slow");
});



var hideCountryDp = document.querySelector(".hide-country-dps");
var hideSiteDp = document.querySelector(".hide-site-dps");
var hideClientDp = document.querySelector(".hide-client-dps");
var hideCountryAndSiteDp = document.querySelector(".hide-countryAndsites-dps")

document.getElementById("show-country-dp").addEventListener('click', function (e) {
    hideCountryDp.hidden = false;
    hideSiteDp.hidden = true;
    hideClientDp.hidden = true;
    hideCountryAndSiteDp.hidden = true;
});



document.getElementById("show-site-dp").addEventListener('click', function (e) {
    hideCountryDp.hidden = true;
    hideSiteDp.hidden = false;
    hideClientDp.hidden = true;
    hideCountryAndSiteDp.hidden = true;
});
document.getElementById("show-client-dp").addEventListener('click', function (e) {
    hideCountryDp.hidden = true;
    hideSiteDp.hidden = true;
    hideClientDp.hidden = false;
    hideCountryAndSiteDp.hidden = true;


});

document.getElementById("show-countryAndSite-dp").addEventListener('click', function (e) {
    hideCountryDp.hidden = true;
    hideSiteDp.hidden = true;
    hideClientDp.hidden = true;
    hideCountryAndSiteDp.hidden = false;


});
