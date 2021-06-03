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
                    // Update review to show new reply without refreshing page and disable submit buttons so user
                    // can't spam click

                    // Only update replies collapse if reply is being edited since total number of replies is unchanged
                    if(checkForm.includes("edit")) {
                        $("#repliesCollapse" + reviewID).load(location.href + " #repliesCollapse" + reviewID + ">*", function() {
                            // Necessary so that tooltips work again after .load()
                            $('[data-toggle="tooltip"]').tooltip()
                        });
                        // After submitting edit reply form, go back to original <p> tag for reply and hide save button
                        editReply($(this).attr('name').substring(17));
                    } else {
                        // Refresh review content and toggle back open the reply collapse
                        $("#replyBtn" + reviewID).prop("disabled", true);
                        $("#review" + reviewID).load(location.href + " #review" + reviewID + ">*", function() {
                            $("#repliesCollapse" + reviewID).toggle();
                            $('[data-toggle="tooltip"]').tooltip();
                        });
                    }
                }
            }
        });
    });
});

// Function that shows save button and makes reply editable when user tries to edit their reply
function showEditReply(reply_id) {
    $("#saveReplyEdit" + reply_id).css("display", "block");

    // Grab original tag
    var original = document.getElementById('editReplyField' + reply_id);
    // Create a replacement tag
    var replacement = document.createElement('textarea');

    // Grab all of the original's attributes, and pass them to the replacement
    for(var i = 0, l = original.attributes.length; i < l; ++i){
        var nodeName = original.attributes.item(i).nodeName;
        var nodeValue = original.attributes.item(i).nodeValue;

        replacement.setAttribute(nodeName, nodeValue);
    }

    // form-control so that user can edit their reply
    replacement.className = "reply-text-full form-control";
    // move text from div to new text area
    replacement.textContent = original.textContent;

    // Swap to textarea form so that user can edit their reply
    original.parentNode.replaceChild(replacement, original);
}

// Function to handle when user clicks save to a reply edit
// Revert back to original reply card
function editReply(reply_id) {
    // Hide save button
    $("#saveReplyEdit" + reply_id).css("display", "none");

    var original = document.getElementById('editReplyField' + reply_id);
    // Create a replacement tag
    var replacement = document.createElement('div');

    // Grab all of the original's attributes, and pass them to the replacement
    for(var i = 0, l = original.attributes.length; i < l; ++i){
        var nodeName = original.attributes.item(i).nodeName;
        var nodeValue = original.attributes.item(i).nodeValue;

        replacement.setAttribute(nodeName, nodeValue);
    }

    // Take off form-control classname
    replacement.className = "reply-text-full";
    replacement.textContent = original.textContent;

    // Swap back to div tag for normal reply card
    original.parentNode.replaceChild(replacement, original);
}
/*
For review upvote/downvote functionality
function handleReplyVote(replyID, isUpvote) {
    const upvoteCountElem = $(`#reply{replyID} .replyUpvoteCount`);
    const downvoteCountElem = $(`#reply{replyID} .replyDownvoteCount`);
    const upvoteCount = parseInt(upvoteCountElem.text());
    const downvoteCount = parseInt(downvoteCountElem.text());

    let elem;
    let otherElem;
    let endpoint;
    let newUpvoteCount;
    let newDownvoteCount;

    if (isUpvote) {
        elem = $(`#reply{replyID} .replyUpvote`);
        otherElem = $(`#reply{replyID} .replyDownvote`);
        endpoint = `/reviews/reply/${replyID}/upvote`;

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
        elem = $(`#reply{replyID} .replyDownvote`);
        otherElem = $(`#reply{replyID} .replyUpvote`);
        endpoint = `/reviews/reply/${replyID}/downvote`;

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
*/

// On browser window resize, refresh collapser threshold for each reply card
$(".reply").each(function(i, reply) {
    var visibleReplyBody = $(this).find("div.reply-text-body");
    var fullReplyText = $(this).find(".reply-text-full");
    var replyCollapseLink = $(this).find("a.reply-collapse-link");

    // Long reply
    if (visibleReplyBody.height() < fullReplyText.height()) {
        // Show "See More" expander only for long replies
        replyCollapseLink.show();
    } else { // Short reply
        replyCollapseLink.hide();
        visibleReplyBody.css("height", "auto"); // Remove static blurb height
    }
});
