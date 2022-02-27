import { sortHTML } from "../common/sorting.js";

function makeActive(htmlTag, label) {
    $(".dropdown-item").removeClass("active");
    $(htmlTag).addClass("active");
    $("#review-sort-select").html(label);
}

function sortReviews(btnID) {
    const htmlTag = "#".concat(btnID);
    let label = "";
    let prop = "";
    let asc = -1;
    switch (btnID) {
    case "votes-sort-btn":
        label = "Most Helpful";
        prop = "vote-count";
        break;
    case "recent-sort-btn":
        label = "Most Recent";
        prop = "date";
        break;
    case "highrating-sort-btn":
        label = "Highest Rating";
        prop = "review-average";
        break;
    case "lowrating-sort-btn":
        label = "Lowest Rating";
        prop = "review-average";
        asc = 1;
        break;
    default:
        console.log("error");
        return;
    }
    if (!$(htmlTag).hasClass("active")) {
        makeActive(htmlTag, label);
        sortHTML(".reviews", ".review", prop, asc);
    }
}

const buttons = [
    "votes-sort-btn",
    "recent-sort-btn",
    "highrating-sort-btn",
    "lowrating-sort-btn"
];
sortReviews(buttons[0]);
for (const button of buttons) {
    const btn = document.getElementById(button);
    if (btn !== null) {
        btn.addEventListener("click", () => sortReviews(button), false);
    }
}
