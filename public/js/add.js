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
            // @ts-ignore
            route = "/list";
        } catch (error) {
            console.log(error);
        }
    }
};
