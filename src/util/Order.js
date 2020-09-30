import DateHelper from "../util/date";

const parseDetails = (detailsDict) => {
    detailsDict['scheduleDate']=DateHelper.convertStrDateToLocalDateString(detailsDict['scheduleDate']);
    return Object.getOwnPropertyNames(detailsDict)
        .map((e) => { return { "name": e, "value": detailsDict[e] }; })
        .reduce((acc, cur) => {
            acc +=  `${cur.name}: ${cur.value}`+ '\n';
            return acc;
        }, "");
}

export default {
    parseDetails
}