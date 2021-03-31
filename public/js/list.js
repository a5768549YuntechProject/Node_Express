function timeFormat(str) {
    let value1 = str.split("T");
    let value2 = value1[1].split(".");
    var d1 = new Date(value1[0] + " " + value2[0]);
    console.log('offset' + d1.getTimezoneOffset())
    d1.setTime( d1.getTime() + 480*60*1000 );
    return d1.toLocaleString();
}

function renderTable(data) {
    let eventTable = document.getElementById("eventTable");
    let mainTr = document.createElement("tr");
    let startTd = document.createElement("td");
    let endTd = document.createElement("td");
    let eventTd = document.createElement("td");

    let actionTd = document.createElement("td");
    let actionEdit = document.createElement("a");
    actionEdit.append("Edit");
    actionEdit.setAttribute("edit-id", data["id"]);
    actionEdit.href = "javascript:;";

    let actionButton = document.createElement("button");
    actionButton.append("Delete");
    actionButton.setAttribute("del-id", data["id"]);

    actionTd.append(actionEdit);
    actionTd.append(actionButton);

    startTd.append(timeFormat(data["start_date"]));
    endTd.append(timeFormat(data["end_date"]));
    eventTd.append(data["event"]);

    mainTr.append(startTd);
    mainTr.append(endTd);
    mainTr.append(eventTd);
    mainTr.append(actionTd);

    eventTable.append(mainTr);
}

try {
    fetch(apiUrl + "api/schedules")
        .then((res) => {
            return res.json();
        })
        .then((result) => {
            result.forEach((element) => {
                renderTable(element);
            });
        });
} catch (error) {
    console.log(error);
}

document.getElementById("eventTable").addEventListener("click", (e) => {
    let editId = /** @type any */ (e.target).getAttribute("edit-id");
    let delId = /** @type any */ (e.target).getAttribute("del-id");
    if (editId === null && delId !== null) {
        //del button
        let data = {
            id: delId,
        };

        if (confirm("確定要刪除嗎？")) {
            try {
                fetch(apiUrl + "api/schedules", {
                    method: "DELETE",
                    body: JSON.stringify(data),
                    headers: new Headers({
                        "Content-Type": "application/json; charset=utf-8",
                    }),
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((result) => {});
                // @ts-ignore
                route = "/list";
            } catch (error) {
                console.log(error);
            }
        }
    } else if (editId !== null && delId === null) {
        //edit button
        localStorage.setItem("id", editId);
        // @ts-ignore
        route = "/edit";
        console.log(editId);
    } else {
        return;
    }
});
