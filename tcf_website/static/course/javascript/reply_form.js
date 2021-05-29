/*
    To handle reply form submission - add new reply, delete reply, or edit reply without refreshign page
*/

$(function () {
    // don't cache so that content actually updates
    $.ajaxSetup ({
        cache: false
    });

    // Handle reply form submission
    $(document).on('submit', 'form', function(e) {
        e.preventDefault();

        // Review ID location in ID varies based on which form is used
        // Have delete form in delete_reply_modal.html, new reply form in review.html, and edit repl in
        var checkForm = $(this).attr('id').substring(0);
        var reviewID = "";

        // Get review ID based on ID of reply form
        // Review ID used to update page
        if(checkForm.includes("delete")) {
            // Review ID location in delete form
            reviewID = $(this).attr('id').substring(13);
        } else {
            // Review ID location in new and edit form
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
                    // Update page content to show new reply without refreshing page
                    $("#repliesCollapse" + reviewID).load(location.href + " #repliesCollapse" + reviewID + ">*", "");
                }
            }
        });
    });
});