const {Expert} = require('../../models/expert');

const createMockExpert = function(name, email, handle, fees, rating, linkedin) {
  return new Expert({
    name,
    email,
    handle,
    domain: "Blockchain Expert",
    availabilities: [
      "(22-07-2018 08:30 Hours) - Half Hour Session",
      "(22-07-2018 10:30 Hours) - Half Hour Session",
      "(25-07-2018 08:30 Hours) -  Half Hour Session"
    ],
    fees,
    rating,
    linkedin
  }).save();
}

const createMockExperts = function() {
  return Expert.remove({})
  .then(() => {
    return createMockExpert(
      "Tejas Nikumbh", "tejasnikumbh@gmail.com",
      "UBVMH1QBS", 100, 4.9,
      "https://www.linkedin.com/in/tejas-nikumbh-19826061/")
  }).then(() => {
    return createMockExpert(
          "Ravi Shankar", "tejnikumbh@gmail.com",
          "UC14E3UCC", 90, 4.3,
          "https://www.linkedin.com/in/ravi-shankar-jhuece/")
  }).then(() => {
    return Promise.resolve();
  });
}

const getFormattedTimeStamp = function(timeSince1970) {
  var date = new Date(timeSince1970);
  const dateString = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
  const timeString = `${date.getHours()}:${date.getMinutes()}`;
  return `${dateString} ${timeString}`;
}

module.exports = {
  createMockExpert,
  createMockExperts,
  getFormattedTimeStamp
}
