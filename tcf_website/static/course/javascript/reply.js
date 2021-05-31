/*
    To handle reply form submission - add new reply, delete reply, or edit reply without refreshign page
*/

$(function () {
    // Don't cache so that content actually updates
    $.ajaxSetup ({
        cache: false
    });

    // Handle reply form submission
    $(document).on('submit', 'form', function(e) {
        e.preventDefault();

        // Review ID location in ID varies based on which form is used
        // Have delete form in delete_reply_modal.html, new reply form in review.html, and edit reply form in reply.html
        var checkForm = $(this).attr('id');
        var reviewID = "";

        // Get review ID based on ID of reply form
        // Review ID used to update page
        if(checkForm.includes("delete") || checkForm.includes("edit")) {
            // Review ID location in delete or edit reply form
            reviewID = $(this).attr('id').substring(13);
        } else {
            // Review ID location in new reply form
            reviewID = $(this).attr('id').substring(9);
        }

        // Submit form and update page without refreshing using AJAX
        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: $(this).serialize(),
            async: false,
            success: function (check) {
                if(check.reply) {
                    // Update review to show new reply without refreshing page

                    // Only update replies collapse if reply is being edited since total number of replies is unchanged
                    if(checkForm.includes("edit")) {
                        $("#repliesCollapse" + reviewID).load(location.href + " #repliesCollapse" + reviewID + ">*", "");
                    } else {
                        $("#review" + reviewID).load(location.href + " #review" + reviewID + ">*", "");
                    }
                }
            }
        });
    });
});

// Function that shows save button and makes reply editable when user tries to edit their reply
function showEditReply(reply_id) {
    $("#saveReplyEdit" + reply_id).css("display", "block");
    document.getElementById("editReplyField" + reply_id).readOnly = false;
    document.getElementById("editReplyField" + reply_id).className = "form-control";
}

// Function to handle when user clicks save to a reply edit
function editReply(reply_id) {
    $("#saveReplyEdit" + reply_id).css("display", "none");
    document.getElementById("editReplyField" + reply_id).readOnly = true;
    document.getElementById("editReplyField" + reply_id).className = "form-control-plaintext";
}