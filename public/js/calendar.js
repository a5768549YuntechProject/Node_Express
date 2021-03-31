let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
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

function previous() {
    document.getElementById("previous").style.color = "#ca3";
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    console.log([currentMonth, currentYear]);
    showCalendar(currentMonth, currentYear);
}

function next() {
    document.getElementById("next").style.color = "#ca3";
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;

    console.log([currentMonth, currentYear]);
    showCalendar(currentMonth, currentYear);
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function valiNowDate(year, month, date) {
    return (
        date === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
    );
}

function countDate(start, end) {
    var d1 = new Date(start);
    var d2 = new Date(end);
    return (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
}

//2021-03-30T16:00:00.000Z
function formatDate(data) {
    let _date = data.split("T")[0];
    let year = parseInt(_date.split("-")[0]);
    let month = parseInt(_date.split("-")[1]);
    let date = parseInt(_date.split("-")[2]);
    return [year, month, date];
}

//2021-03-30T16:00:00.000Z
function formatStringDate(data) {
    data = data.map(String);
    if (data[1].length === 1) {
        data[1] = "0" + data[1];
    }
    if (data[2].length === 1) {
        data[2] = "0" + data[2];
    }
    return data[0] + "-" + data[1] + "-" + data[2] + "T00:00:00.000Z";
}

function plusDate(data) {
    let _year = data[0];
    let _month = data[1];
    let _day = data[2];
    let maxDateArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((!(_year % 4) && _year % 100) || !(_year % 400)) {
        maxDateArray[1] = 29;
    }
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

    return (
        _year +
        "-" +
        _month +
        "-" +
        _day +
        "T" +
        _hour +
        ":" +
        _min +
        ":" +
        _sec +
        ".000Z"
    );
}

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
//2021-03-30T16:00:00.000Z#test
function putEvent(year, month, date, eventString) {
    month += 1;
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

function showCalendar(month, year) {
    if (globalThis.data === undefined || globalThis.data === null) {
        fetch(apiUrl + "api/schedules")
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                globalThis.data = result;

                listEvent(globalThis.data);

                document.getElementById("previous").style.color = "white";
                document.getElementById("next").style.color = "white";
                let daysInMonth = 32 - new Date(year, month, 32).getDate();
                let firstDayOfWeek = new Date(year, month).getDay();
                let table_body = /**@type {any} */ (document.getElementById(
                    "calendar_body"
                ));
                table_body.innerHTML = "";
                console.log('before:' + header.innerHTML);
                document.getElementById("calendar_header").innerHTML = months[month] + " " + year;
                console.log('alfter:' + header.innerHTML);
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
                                if (
                                    putEvent(year, month, date, element) !== ""
                                ) {
                                    event +=
                                        putEvent(year, month, date, element) +
                                        "<br/>";
                                }
                            });
                            console.log(event);
                            cell.innerHTML = "" + date + "<br/><br/>" + event;
                            cell.id = date;
                            date++;
                        }
                    }
                }
            });
    } else {
        document.getElementById("previous").style.color = "white";
        document.getElementById("next").style.color = "white";
        let daysInMonth = 32 - new Date(year, month, 32).getDate();
        let firstDayOfWeek = new Date(year, month).getDay();
        let table_body = /**@type {any} */ (document.getElementById(
            "calendar_body"
        ));
        table_body.innerHTML = "";
        console.log('before:' + header.innerHTML);
        document.getElementById("calendar_header").innerHTML = months[month] + " " + year;
        console.log('alfter:' + header.innerHTML);
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
                            event +=
                                putEvent(year, month, date, element) + "<br/>";
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
