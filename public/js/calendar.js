let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
/** 月份字串 */
let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let table = document.getElementById("tabapay_calendar");
let header = document.getElementById("calendar_header");
let modal = document.getElementById("calendar_modal");
let span = document.getElementsByClassName("close")[0];
let modal_body = document.getElementsByClassName("modal-body")[0];

/**
 * render上個月份的資料
 */
function previous() {
    document.getElementById("previous").style.color = "#ca3";
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    document.getElementById("calendar_header").innerHTML = months[currentMonth] + " " + currentYear;
    console.log([currentMonth, currentYear]);
    showCalendar(currentMonth, currentYear);
}

/**
 * render下個月份的資料
 */
function next() {
    document.getElementById("next").style.color = "#ca3";
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;

    document.getElementById("calendar_header").innerHTML = months[currentMonth] + " " + currentYear;
    console.log([currentMonth, currentYear]);
    showCalendar(currentMonth, currentYear);
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

/**
 * 檢查傳入日期是否為今日
 * @param {number} year 年
 * @param {number} month 月
 * @param {number} date 日
 * @returns 傳入日期是否為今日
 */
function valiNowDate(year, month, date) {
    return date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
}

/**
 * 計算兩個日期相差的天數
 * @param {string} start 開始日期
 * @param {string} end 結束日期
 * @returns 兩個日期相差的天數
 */
function countDate(start, end) {
    var d1 = new Date(start);
    var d2 = new Date(end);
    return (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
}

/**
 * 將日期字串轉為日期數字陣列
 * @param {string} data YYYY-MM-DDThh:mm:ss.000Z
 * @returns {number[]} 日期數字陣列[年,月,日]
 */
function formatDate(data) {
    let _date = data.split("T")[0];
    let year = parseInt(_date.split("-")[0]);
    let month = parseInt(_date.split("-")[1]);
    let date = parseInt(_date.split("-")[2]);
    return [year, month, date];
}

/**
 * 將日期數字陣列轉為日期字串
 * @param {number[]} data
 * @returns YYYY-MM-DDThh:mm:ss.000Z
 */
function formatStringDate(data) {
    let _data = data.map(String);
    if (_data[1].length === 1) _data[1] = "0" + _data[1];
    if (_data[2].length === 1) _data[2] = "0" + _data[2];

    return _data[0] + "-" + _data[1] + "-" + _data[2] + "T00:00:00.000Z";
}

/**
 * 將輸入日期加一天
 * @param {number[]} data 數字陣列[年,月,日]
 * @returns {number[]} 數字陣列[年,月,日]
 */
function plusDate(data) {
    let _year = data[0];
    let _month = data[1];
    let _day = data[2];
    //計算閏年
    let maxDateArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((!(_year % 4) && _year % 100) || !(_year % 400)) maxDateArray[1] = 29;

    let maxDay = maxDateArray[_month - 1];

    if (_day === maxDay && _month === 12) {
        _year += 1;
        _month = 1;
        _day = 1;
    } else if (_day === maxDay && _month !== 12) {
        _month += 1;
        _day = 1;
    } else {
        _day += 1;
    }

    return [_year, _month, _day];
}

/**
 * 取得資料庫的資料更改格式為YYYY-MM-DDThh:mm:ss.000Z和更改時區
 * @param {String} date
 * @returns YYYY-MM-DDThh:mm:ss.000Z
 */
function formatDateToString(date) {
    var d1 = new Date(date);
    d1.setTime(d1.getTime() + 480 * 60 * 1000);
    let _year = d1.getFullYear().toString();
    let _month = (d1.getMonth() + 1).toString();
    let _day = d1.getDate().toString();
    let _hour = d1.getHours().toString();
    let _min = d1.getMinutes().toString();
    let _sec = d1.getSeconds().toString();
    if (_month.length === 1) _month = "0" + _month;
    if (_day.length === 1) _day = "0" + _day;
    if (_hour.length === 1) _hour = "0" + _hour;
    if (_min.length === 1) _min = "0" + _min;
    if (_sec.length === 1) _sec = "0" + _sec;

    return _year + "-" + _month + "-" + _day + "T" + _hour + ":" + _min + ":" + _sec + ".000Z";
}

/**
 * 列出時間事件清單並儲存於全域變數內
 * @param {String[]} data
 */
function listEvent(data) {
    data.forEach((element) => {
        element["start_date"] = formatDateToString(element["start_date"]);
        element["end_date"] = formatDateToString(element["end_date"]);

        let _countDate = countDate(element["start_date"], element["end_date"]);
        if (_countDate === 0) {
            list.push(element["start_date"] + "#" + element["event"]);
        } else {
            let startDate = formatDate(element["start_date"]);
            let endDate = formatDate(element["end_date"]);
            list.push(formatStringDate(startDate) + "#" + element["event"]);
            while (startDate.toString() !== endDate.toString()) {
                startDate = plusDate(startDate);
                list.push(formatStringDate(startDate) + "#" + element["event"]);
            }
        }
    });
    console.log(list);
}

/**
 * 將資料庫內的event格式化成YYYY-MM-DDThh:mm:ss.000Z#{event}
 * @param {string | number} year
 * @param {string | number} month
 * @param {string | number} date
 * @param {string} eventString
 * @returns YYYY-MM-DDThh:mm:ss.000Z#{event}
 */
function putEvent(year, month, date, eventString) {
    /** @type {any} */ (month) += 1;
    let event = eventString.split("#")[1];
    let dateString = eventString.split("T")[0];
    let _year = dateString.split("-")[0];
    let _month = dateString.split("-")[1];
    let _date = dateString.split("-")[2];
    year = year.toString();
    month = month.toString();
    date = date.toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    if (date.length === 1) {
        date = "0" + date;
    }
    if (year === _year && month === _month && date === _date) {
        return event;
    } else {
        return "";
    }
}

/**
 * 畫出當週資料表格
 * @param {String} date 日期資料
 * @param {String} event 事件資料
 */
function renderWeekTable(date, event) {
    let eventTable = document.getElementById("weekEventTable");
    let mainTr = document.createElement("tr");
    let dateTd = document.createElement("td");
    let eventTd = document.createElement("td");

    dateTd.innerHTML = date;
    eventTd.innerHTML = event;

    mainTr.append(dateTd);
    mainTr.append(eventTd);

    eventTable.append(mainTr);
}

/**
 * 畫出當日資料表格
 * @param {String} date 日期資料
 * @param {String} event 事件資料
 */
function renderTodayTable(date, event) {
    let eventTable = document.getElementById("todayEventTable");
    let mainTr = document.createElement("tr");
    let dateTd = document.createElement("td");
    let eventTd = document.createElement("td");

    dateTd.innerHTML = date;
    eventTd.innerHTML = event;

    mainTr.append(dateTd);
    mainTr.append(eventTd);

    eventTable.append(mainTr);
}

/**
 * fetch後端並且render出日曆
 * @param {number} month
 * @param {number} year
 */
function showCalendar(month, year) {
    document.getElementById("previous").style.color = "white";
    document.getElementById("next").style.color = "white";

    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let firstDayOfWeek = new Date(year, month).getDay();
    let table_body = /**@type {any} */ (document.getElementById("calendar_body"));
    table_body.innerHTML = "";

    if (globalThis.data === undefined || globalThis.data === null) {
        fetch(apiUrl + "api/schedules")
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                globalThis.data = result;

                listEvent(globalThis.data);

                document.getElementById("calendar_header").innerHTML = months[month] + " " + year;
                let date = 1;
                let week = [];
                let weekEvent = [];
                for (let i = 0; i < 6; i++) {
                    let row = table_body.insertRow(i);
                    if (week.length !== 0) {
                        console.log(week);
                        console.log(weekEvent);
                        if (week.indexOf(today.getDate()) !== -1) {
                            thisWeekList = week;
                            thisWeekListEvent = weekEvent;
                            todayList = thisWeekList[week.indexOf(today.getDate())];
                            todayListEvent = thisWeekListEvent[week.indexOf(today.getDate())];

                            for (let i in thisWeekList) {
                                console.log(i);
                                renderWeekTable(
                                    month + 1 + "/" + thisWeekList[i],
                                    thisWeekListEvent[i]
                                );
                            }
                            renderTodayTable(month + 1 + "/" + todayList, todayListEvent);
                        }

                        week = [];
                        weekEvent = [];
                    }
                    for (let j = 0; j < 7; j++) {
                        let cell = row.insertCell(j);
                        if (i === 0 && j < firstDayOfWeek) {
                            cell.innerHTML = "";
                        } else if (date > daysInMonth) {
                            break;
                        } else {
                            if (valiNowDate(year, month, date)) {
                                cell.classList.add("current_date");
                            }

                            let event = "";

                            list.forEach((element) => {
                                if (putEvent(year, month, date, element) !== "") {
                                    event += putEvent(year, month, date, element) + "<br/>";
                                }
                            });

                            week.push(date);
                            weekEvent.push(event);
                            console.log(event);
                            cell.innerHTML = "" + date + "<br/><br/>" + event;
                            cell.id = date;
                            date++;
                        }
                    }
                }
            });
    } else {
        document.getElementById("calendar_header").innerHTML = months[month] + " " + year;
        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = table_body.insertRow(i);
            for (let j = 0; j < 7; j++) {
                let cell = row.insertCell(j);
                if (i === 0 && j < firstDayOfWeek) {
                    cell.innerHTML = "";
                } else if (date > daysInMonth) {
                    break;
                } else {
                    if (valiNowDate(year, month, date)) {
                        cell.classList.add("current_date");
                    }

                    let event = "";

                    list.forEach((element) => {
                        if (putEvent(year, month, date, element) !== "") {
                            event += putEvent(year, month, date, element) + "<br/>";
                        }
                    });

                    console.log(event);
                    cell.innerHTML = "" + date + "<br/><br/>" + event;
                    cell.id = date;
                    date++;
                }
            }
        }
    }
}

showCalendar(currentMonth, currentYear);
if (todayList !== 0) {
    for (let i in thisWeekList) {
        console.log(i);
        renderWeekTable(currentMonth + 1 + "/" + thisWeekList[i], thisWeekListEvent[i]);
    }
    renderTodayTable(currentMonth + 1 + "/" + todayList, todayListEvent);
}
