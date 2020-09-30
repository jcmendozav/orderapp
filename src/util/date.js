const convertUTCDateToLocalDate = date => {
    var currentDate = new Date(date);
    var newDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000);

    var offset = currentDate.getTimezoneOffset() / 60;
    var hours = currentDate.getHours();

    newDate.setHours(hours - offset);

    return newDate;
};

const convertStrDateToLocalDateString = dateStr => {
    // dateStr must be in ISO format. For example: 2020-08-26T22:42:00.000Z
    return (new Date(dateStr)).toLocaleString()
}

const convertUTCDateToLocalDateString = date => {
    // dateStr must be in ISO format. For example: 2020-08-26T22:42:00.000Z
    return convertUTCDateToLocalDate(date).toLocaleString()
}

export default {
    convertUTCDateToLocalDate,
    convertUTCDateToLocalDateString,
    convertStrDateToLocalDateString
};