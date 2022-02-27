/* eslint-disable no-unused-vars */
function getNotifs() {
    $.ajax({
        type: "GET",
        url: "/api/notifications/?page_size=10",
        dataType: "json",
        success: function(data, status, xhr) {
            console.log(data.results);
            let notifs;
            data.results.forEach((n) => {
                notifs = `
                <div class="card mb-2" id="notifications">
                    <div style="padding-top: 2rem;" class="card-body text-left">
                        <div style="display: inline-block; float: left">
                            <p>${n.content}</p>
                            <p style="font-size: 12px">${n.created}</p>
                        </div>
                        <div style="height = 100%">
                            <button onClick="${n.is_read ? "unread" : "oneread"}(${n.id})"
                                    class="readButton ${ n.is_read ? "read" : "unread"}"></button>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </div>
                `;
            });
            console.log(notifs);
            $("#notifications").html(notifs);
        }
    });
}

function readAll() {
    $.ajax({
        type: "POST",
        url: "/mark_all_as_read",
        dataType: "html",
        success: function(data, status, xhr) {
            getNotifs();
        }
    });
}
function unread(notifID) {
    $.ajax({
        type: "POST",
        url: "/mark_one_as_unread/" + notifID,
        dataType: "html",
        success: function(data, status, xhr) {
            getNotifs();
        }
    });
}

function oneread(notifID) {
    $.ajax({
        type: "POST",
        url: "/mark_one_as_read/" + notifID,
        dataType: "html",
        success: function(data, status, xhr) {
            getNotifs();
        }
    });
}
