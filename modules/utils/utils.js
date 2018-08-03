const {Expert} = require('../../models/expert');



const createMockExpert = function() {
  return new Expert({
    name: "Tejas Nikumbh",
    email: "tejnikumbh@gmail.com",
    handle: "@tejnikumbh",
    domain: "Blockchain Expert",
    availabilities: [
      "(22-07-2018 08:30 Hours) - Half Hour Session",
      "(22-07-2018 10:30 Hours) - Half Hour Session",
      "(25-07-2018 08:30 Hours) -  Half Hour Session"
    ],
    fees: 100,
    linkedin: "https://www.linkedin.com/in/tejas-nikumbh-19826061/"
  }).save();
}

const getFormattedTimeStamp = function(timeSince1970) {
  var date = new Date(timeSince1970);
  const dateString = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
  const timeString = `${date.getHours()}:${date.getMinutes()}`;
  return `${dateString} ${timeString}`;
}

module.exports = {
  createMockExpert,
  getFormattedTimeStamp
}
