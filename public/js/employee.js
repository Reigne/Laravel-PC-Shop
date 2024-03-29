$(document).ready(function () {
    $('#emtable').DataTable({
        ajax:{
            url:"/api/employee",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: ""
        },
        dom:'Bfrtip',
        buttons:[
            'pdf',
            'excel',
            // {
            //     text:'Add New Employee',
            //     className: 'btn btn-primary',
            //     action: function(e, dt, node, config){
            //         $("#emform").trigger("reset");
            //         $('#employeeModal').modal('show');
            //     }
            // }
        ],
        columns:[
            {data: 'employee_id'},
            {data: 'title'},
            {data: 'lname'},
            {data: 'fname'},
            {data: 'addressline'},
            {data: 'town'},
            {data: 'zipcode'},
            {data: 'phone'},
            {data: null,
                render: function (data, type, row) {
                    return "<span class='badge bg-primary'>" + data.role +"</span>";
                },
            },
            {data: null,
                render: function (data,type,JsonResultRow,row) {
                    return '<img src="/storage/' + JsonResultRow.imagePath + '" width="100px" height="100px">';
                },
            },
            {data: null,
                render: function (data, type, row) {
                    if(data.deleted_at)
                    return "<span class='badge rounded-pill bg-secondary'>Deactivated</span>";
                    else
                    return "<span class='badge rounded-pill bg-success'>Active</span>";
                }, orderable: false, searchable: false
            },
            {data: null,
                render: function (data, type, row) {
                    if(data.deleted_at)
                    return "<i class='fa-solid fa-pen-to-square' aria-hidden='true' style='font-size:30px; color:gray'></i>";
                    else
                    return "<a href='#' class='editBtn id='editbtn' data-id=" + data.employee_id + "><i class='fa-solid fa-pen-to-square' aria-hidden='true' style='font-size:30px' ></i></a>";
                },
            },
            {data: null,
                render: function (data, type, row) {
                    if(data.deleted_at)
                    return "<a href='#' class='restorebtn' data-id=" + data.employee_id + "><i class='fa-solid fa-rotate-right' style='font-size:30px; color:primary'></a></i>";
                    else 
                    return "<a href='#' class='deletebtn' data-id=" + data.employee_id + "><i class='fa-sharp fa-solid fa-trash' style='font-size:30px; color:red'></a></i>";
                },  orderable: false, searchable: false
            },
            
        ]
        
    })//end datatables

$("#employeeSubmit").on("click", function (e) {
    e.preventDefault();
    var data = $('#emform')[0];
    console.log(data);
    let formData = new FormData(data);

    console.log(formData);
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    $.ajax({
        type: "POST",
        url: "/api/employee",
        data: formData,
        contentType: false,
        processData: false,
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        dataType:"json", 

        success:function(data){
            if (data.errors) {
                bootbox.alert({
                    message: "Error please complete the form first!",
                    className: 'rubberBand animated'});
            } else {
                console.log(data);
                $("#employeeModal").modal("hide");
                
                var $emtable = $('#emtable').DataTable();
                $emtable.row.add(data.employee).draw(false); 
            }
        },
        error:function (error){
            console.log(error);
        }
    })
});


$("#createEmployeeBtn").on("click", function (e) {
    $('#employeeModal').modal('show');
});  


// $("#emtable tbody").on("click", "a.editBtn", function (e) {
$("#editEmployeeBtn").on("click", function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    $('#editEmployeeModal').modal('show');

    $.ajax({
        type: "GET",
        url: "api/employee/" + id + "/edit",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        dataType: "json",
        success: function(data){
               console.log(data);
               $("#eeemployee_id").val(data.employee_id);
               $("#eetitle").val(data.title);
               $("#eelname").val(data.lname);
               $("#eefname").val(data.fname);
               $("#eeaddressline").val(data.addressline);
               $("#eetown").val(data.town);
               $("#eezipcode").val(data.zipcode);
               $("#eephone").val(data.phone);
               $("#eeemail").val(data.email);
            },
            error: function(){
                console.log('AJAX load did not work');
                alert("error");
            }
        });
    });//end edit fetch
    
    $("#updatebtnEmployee").on('click', function(e) {
        e.preventDefault();
        var id = $('#eeemployee_id').val();
        var data = $('#empform')[0];
        var formData = new FormData(data);
        var table = $('#emtable').DataTable();
        console.log(data);

        $.ajax({
            type: "POST",
            url: "api/employee/update/"+ id,
            data: formData,
            contentType: false,
            processData: false,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            dataType: "json",
            success: function(data) {
                console.log(data);
                $('#editEmployeeModal').modal("hide");
                window.location.reload();
                bootbox.alert(data.success)
                
            },
            error: function(error) {
                console.log(error);
            }
        });
    });//end update



    ////////////// admin
    $("#emtable tbody").on("click", "a.editBtn", function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('#adminModal').modal('show');
    
        $.ajax({
            type: "GET",
            url: "api/employee/role/" + id + "/edit",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            dataType: "json",
            success: function(data){
                   console.log(data);
                   $("#eeemployee_id").val(data.employee_id);
                   $("#eerole").val(data.role);
                },
                error: function(){
                    console.log('AJAX load did not work');
                    alert("error");
                }
            });
        });//end edit fetch
        
        $("#updatebtnAdmin").on('click', function(e) {
            e.preventDefault();
            var id = $('#eeemployee_id').val();
            var data = $('#adform')[0];
            var formData = new FormData(data);
            var table = $('#emtable').DataTable();
            console.log(data);
    
            $.ajax({
                type: "POST",
                url: "api/employee/update/role/"+ id,
                data: formData,
                contentType: false,
                processData: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    $('#adminModal').modal("hide");

                    if (data.error) {
                        bootbox.alert(data.error)
                    } else {
                        window.location.reload();
                        bootbox.alert(data.success)
                    }
                },
                error: function(error) {
                    console.log(error);
                    bootbox.alert(data.error)
                }
            });
        });

    $("#emtable tbody").on("click", "a.deletebtn", function (e) {
        var table = $('#emtable').DataTable();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        console.log(id);

        e.preventDefault();
        bootbox.confirm({
            message: "Do you want to delete this employee?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn-success",
                },
                cancel: {
                    label: "No",
                    className: "btn-danger",
                },
            },
            callback: function (result) {
                if (result)
                    $.ajax({
                        type: "DELETE",
                        url: "/api/employee/" + id,
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            
                            if (data.error) {
                                bootbox.alert(data.error)
                            } else {
                            // $row.fadeOut(4000, function(){
                            //     table.row($row).remove().draw(false)
                            // });
                            setTimeout(function(){
                                window.location.reload();
                             }, 1000);
                            
                            bootbox.alert(data.success)
                            }
                        },

                        error: function (error) {
                            console.log(error);
                        },
                    });
            },
        });
    });//DELETE

    $("#emtable tbody").on("click", "a.restorebtn", function (e) {
        var table = $('#emtable').DataTable();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        console.log(id);

        e.preventDefault();
        bootbox.confirm({
            message: "Do you want to restore this employee?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn-success",
                },
                cancel: {
                    label: "No",
                    className: "btn-danger",
                },
            },
            callback: function (result) {
                if (result)
                    $.ajax({
                        type: "GET",
                        url: "/api/employee/restore/" + id,
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);

                            if (data.error) {
                                bootbox.alert(data.error)
                            } else {
                            window.location.reload();
                            bootbox.alert(data.success)
                            }
                        },

                        error: function (error) {
                            console.log(error);
                        },
                    });
            },
        });
    });//RESTORE

}); // end of document
