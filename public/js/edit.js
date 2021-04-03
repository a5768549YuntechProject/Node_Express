/**
 * 檢查日期
 * @param {String} str 輸入日期
 * @returns 日期格式是否正確
 */
function checkDateTime(str) {
    if (str === "") {
        alert("請輸入日期");
        return false;
    }
    var matches = str.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
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

/**
 * 檢查時間順序是否正確
 * @param {String} startTime 開始日期
 * @param {String} endTime 結束日期
 * @returns 時間順序是否正確
 */
function parseDate(startTime, endTime) {
    if (Date.parse(startTime).valueOf() > Date.parse(endTime).valueOf()) {
        alert("開始時間不能晚於結束時間");
        return false;
    } else {
        return true;
    }
}

/**
 * 檢查事件是否填入
 * @param {String} str 事件
 * @returns 事件是否填入
 */
function checkEmtpy(str) {
    if (str === "" || str === null) {
        alert("請填入事件");
        return false;
    } else {
        return true;
    }
}

/**
 * 將SQL DateTime格式轉為顯示格式
 * @param {String} str YYYY-MM-DDThh:mm:ss.000Z
 * @returns YYYY-MM-DD hh:mm:ss
 */
function formatSQLDateTime(str) {
    let value1 = str.split("T");
    let value2 = value1[1].split(".");

    var d1 = new Date(value1[0] + " " + value2[0]);
    d1.setTime(d1.getTime() + 480 * 60 * 1000);
    let _dateformat = d1.toLocaleString("en-GB");
    let _date = _dateformat.split(", ");
    let date = _date[0].split("/");
    date.reverse();
    console.log(date);

    return date[0] + "-" + date[1] + "-" + date[2] + " " + _date[1];
}

try {
    fetch(apiUrl + "api/schedules/" + localStorage.getItem("id"))
        .then((res) => {
            return res.json();
        })
        .then((result) => {
            let data = result[0];
            formatSQLDateTime(data["start_date"]);
            /** @type {any} */ (document.getElementById("startTime")).value = formatSQLDateTime(
                data["start_date"]
            );
            /** @type {any} */ (document.getElementById("endTime")).value = formatSQLDateTime(
                data["end_date"]
            );
            /** @type {any} */ (document.getElementById("event")).value = data["event"];
            console.log(data);
        });
} catch (error) {
    console.log(error);
}

var submitButton = document.getElementById("submit");

submitButton.onclick = function () {
    let startTimeValue = /** @type {any} */ (document.getElementById("startTime")).value;
    let endTimeValue = /** @type {any} */ (document.getElementById("endTime")).value;
    let event = /** @type {any} */ (document.getElementById("event")).value;

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
            if (
                localStorage.getItem("id") === undefined ||
                localStorage.getItem("id") === null ||
                localStorage.getItem("id") === "0"
            ) {
                return;
            }
            fetch(apiUrl + "api/schedules/" + localStorage.getItem("id"), {
                method: "PUT",
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
            localStorage.setItem("id", "0");
            document.location.href = "../list";
        } catch (error) {
            console.log(error);
        }
    }
};
