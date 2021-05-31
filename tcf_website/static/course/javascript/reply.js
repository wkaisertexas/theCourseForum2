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

/* For reply upvote/downvote functionality */
function handleReplyVote(replyID, isUpvote) {
    const upvoteCountElem = $(`#reply{replyID} .upvoteCount`);
    const downvoteCountElem = $(`#reply{replyID} .downvoteCount`);
    const upvoteCount = parseInt(upvoteCountElem.text());
    const downvoteCount = parseInt(downvoteCountElem.text());

    let elem;
    let otherElem;
    let endpoint;
    let newUpvoteCount;
    let newDownvoteCount;

    if (isUpvote) {
        elem = $(`#reply{replyID} .upvote`);
        otherElem = $(`#reply{replyID} .downvote`);
        endpoint = `/reviews/${replyID}/upvote`;

        // If already upvoted, subtract 1.
        if (elem.hasClass("active")) {
            newUpvoteCount = upvoteCount - 1;
        // If already downvoted, add 1 to upvote and subtract 1 from downvote.
        } else if (otherElem.hasClass("active")) {
            newUpvoteCount = upvoteCount + 1;
            newDownvoteCount = downvoteCount - 1;
        // Otherwise add 1.
        } else {
            newUpvoteCount = upvoteCount + 1;
        }
    } else {
        elem = $(`#reply{replyID} .downvote`);
        otherElem = $(`#reply{replyID} .upvote`);
        endpoint = `/reviews/${replyID}/downvote`;

        // If already downvoted, add 1.
        if (elem.hasClass("active")) {
            newDownvoteCount = downvoteCount - 1;
        // If already upvoted, add 1 to downvote and subtract 1 from upvote.
        } else if (otherElem.hasClass("active")) {
            newDownvoteCount = downvoteCount + 1;
            newUpvoteCount = upvoteCount - 1;
        // Otherwise subtract 1.
        } else {
            newDownvoteCount = downvoteCount + 1;
        }
    }

    // POST to upvote or downvote endpoint.
    fetch(endpoint, {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });

    // Update vote text.
    upvoteCountElem.text(newUpvoteCount);
    downvoteCountElem.text(newDownvoteCount);

    if (elem.hasClass("active")) {
        elem.removeClass("active");
    } else {
        elem.addClass("active");
        otherElem.removeClass("active");
    }
}

export { handleReplyVote };