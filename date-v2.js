//Refactores version of date-v1.js 


exports.getDate = function () {

    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    }

    return today.toLocaleDateString("en-US", options);

}

exports.getDay = function () {

    let today = new Date();

    let options = {
        weekday: "long"
    }

    return today.toLocaleDateString("en-US", options);

}

// console.log(exports);    //logs the "export" object containing both of the above passed functions.