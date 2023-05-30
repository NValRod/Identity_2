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
});


$('#reset_search').click(function () {
    $('#form_container').slideDown();
    $('#table_container').slideUp();
    
    $('#view_title').addClass('bg-primary');
    $('#view_title h2').addClass('text-white');

    $('#clear_form').click();
    $('#dataTable tbody').empty();
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
            timer: 3000,
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

                        $('#view_title').removeClass('bg-primary');
                        $('#view_title h2').removeClass('text-white');
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
});