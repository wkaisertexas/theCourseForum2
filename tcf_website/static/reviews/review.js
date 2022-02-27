/* For review upvote/downvote functionality */
function handleVote(reviewID, isUpvote) {
    const upvoteCountElem = $(`#review${reviewID} .upvoteCount`);
    const downvoteCountElem = $(`#review${reviewID} .downvoteCount`);

    // Index 0 is for upvote, index 1 is for downvote
    const selected = isUpvote ? 0 : 1;
    const voteCount = [parseInt(upvoteCountElem.text()), parseInt(downvoteCountElem.text())];
    const voteElem = [$(`#review${reviewID} .upvote`), $(`#review${reviewID} .downvote`)];
    const endpoint = isUpvote ? `/reviews/${reviewID}/upvote/` : `/reviews/${reviewID}/downvote/`;

    // If clicked elem already selected, decrement count and remove vote
    if (voteElem[selected].hasClass("active")) {
        voteCount[selected]--;
        voteElem[selected].removeClass("active");
    } else {
        // If clicked elem not already selected, increment count
        voteCount[selected]++;
        voteElem[selected].addClass("active");
        // If other elem was selected, decrement count
        if (voteElem[selected ^ 1].hasClass("active")) {
            voteCount[selected ^ 1]--;
            voteElem[selected ^ 1].removeClass("active");
        }
    }

    // POST to upvote or downvote endpoint.
    fetch(endpoint, {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });

    // Update vote text.
    upvoteCountElem.text(voteCount[0]);
    downvoteCountElem.text(voteCount[1]);
}

export { handleVote };

/* For review text collapse/expand functionality */
$(function() {
    // On browser window resize, refresh collapser threshold for each review card
    $(".review").each(function(i, review) {
        var visibleReviewBody = $(this).find("div.review-text-body");
        var fullReviewText = $(this).find("p.review-text-full");
        var reviewCollapseLink = $(this).find("a.review-collapse-link");

        // Long review
        if (visibleReviewBody.height() < fullReviewText.height()) {
            // Show "See More" expander only for long reviews
            reviewCollapseLink.show();
        } else { // Short review
            reviewCollapseLink.hide();
            visibleReviewBody.css("height", "auto"); // Remove static blurb height
        }
    });
});
