// First control the group settings
$("#group").on('change',function(){
    $("#subGrp").removeAttr("disabled")
    if (this.value == 'newgroup'){
    }
})
$("#group").on('change', function(){
    if (this.value === 'newgroup') {
        // Prompt user to create a new group, send POST request and then ask about subgroup
        $("#newGroupModal").modal('show');
    }
})
$("#createGrpSubmit").on('click', function(){
    // Send the POST Request

    //Close the Modal and then add new group option
    $("#newGroupModal").modal('hide');
    
})
$("#createGrpSubmit").on('click', function(){
    // Send an ajax post request on clicking the create new group 
    // TODO: Implement array for subgroups
    data  = {
        groupName : $("#grpName").val(),
        subGrpName : $("#subgrpName").val(),
    }
    $.post("/group/new", data = data, function(data){
        console.log(data)
    })
    // Then add the option in the select options


})