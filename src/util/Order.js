import DateHelper from "../util/date";


const isObject = objectParam => {
    return typeof objectParam === 'object' && objectParam !== null;
}
const parseDetails = (detailsDict) => {
    detailsDict['scheduleDate']=DateHelper.convertStrDateToLocalDateString(detailsDict['scheduleDate']);
    return Object.getOwnPropertyNames(detailsDict)
        .map((e) => { return { "name": e, "value": isObject(detailsDict[e])? JSON.stringify(detailsDict[e]):detailsDict[e] }; })
        .reduce((acc, cur) => {
            acc +=  `${cur.name}: ${cur.value}`+ '\n';
            return acc;
        }, "");
}

export default {
    parseDetails
}