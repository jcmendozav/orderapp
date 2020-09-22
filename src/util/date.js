const convertUTCDateToLocalDate = date => {
    var currentDate = new Date(date);
    var newDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000);

    var offset = currentDate.getTimezoneOffset() / 60;
    var hours = currentDate.getHours();

    newDate.setHours(hours - offset);

    return newDate;
};

export default {
    convertUTCDateToLocalDate
};