function checkDateTime(str) {
    if (str === "") {
        alert("請輸入日期");
        return false;
    }
    var matches = str.match(
        /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    );
    if (matches === null) {
        // invalid
        alert("請輸入正確的日期");
        return false;
    } else {
        var year = parseInt(matches[1], 10);
        var month = parseInt(matches[2], 10) - 1; // months are 0-11
        var day = parseInt(matches[3], 10);
        var hour = parseInt(matches[4], 10);
        var minute = parseInt(matches[5], 10);
        var second = parseInt(matches[6], 10);
        var date = new Date(year, month, day, hour, minute, second);
        if (
            date.getFullYear() !== year ||
            date.getMonth() != month ||
            date.getDate() !== day ||
            date.getHours() !== hour ||
            date.getMinutes() !== minute ||
            date.getSeconds() !== second
        ) {
            // invalid
            alert("請輸入正確的日期");
            return false;
        } else {
            // valid
            return true;
        }
    }
}

function parseDate(startTime, endTime) {
    if (Date.parse(startTime).valueOf() > Date.parse(endTime).valueOf()) {
        alert("開始時間不能晚於結束時間");
        return false;
    } else {
        return true;
    }
}

function checkEmtpy(str) {
    if (str === "" || str === null) {
        alert("請填入事件");
        return false;
    } else {
        return true;
    }
}

var submitButton = document.getElementById("submit");

submitButton.onclick = function () {
    let startTimeValue = /** @type any */ (document.getElementById("startTime"))
        .value;
    let endTimeValue = /** @type any */ (document.getElementById("endTime"))
        .value;
    let event = /** @type any */ (document.getElementById("event")).value;

    if (
        checkDateTime(startTimeValue) &&
        checkDateTime(endTimeValue) &&
        parseDate(startTimeValue, endTimeValue) &&
        checkEmtpy(event)
    ) {
        let data = {
            start_date: startTimeValue,
            end_date: endTimeValue,
            event: event,
        };

        try {
            fetch(apiUrl + "api/schedules", {
                method: "POST",
                body: JSON.stringify(data),
                headers: new Headers({
                    "Content-Type": "application/json; charset=utf-8",
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((result) => {
                    alert(result.message);
                });
            route = "/list";
        } catch (error) {
            console.log(error);
        }
    }
};
