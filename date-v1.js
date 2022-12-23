//things written in "module.exports" can be used in other files by "require" the module/package file first.

module.exports.getDate = getDate;   //function "getDate" is passed here to "module.export" object.


function getDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    }

    return today.toLocaleDateString("en-US", options);
    
}

module.exports.getDay = getDay;  //function "getDay" is passed here to "module.export" object.

function getDay() {
    let today = new Date();

    let options = {
        weekday: "long"
    }

    return today.toLocaleDateString("en-US", options);
    
}

// console.log(module.exports);    //logs the "module.export" object containing both of the above passed functions.