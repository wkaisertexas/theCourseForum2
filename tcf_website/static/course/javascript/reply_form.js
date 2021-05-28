/*
    To handle reply form submission and add new reply without refreshing
*/

$(function () {
    // don't cache so that content actually updates
    $.ajaxSetup ({
        cache: false
    });

    // Handle reply form submission
    $(document).on('submit', 'form', function(e) {
        e.preventDefault();

        // get review ID based on ID of reply form
        reviewID = $(this).attr('id').substring(9);

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