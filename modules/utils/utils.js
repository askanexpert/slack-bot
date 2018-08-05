const {Expert} = require('../../models/expert');

const createMockExpert = function(
  name, email, handle, fees, rating, github, linkedin, description) {
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
    github,
    linkedin,
    description
  }).save();
}

const createMockExperts = function() {
  return Expert.remove({})
  .then(() => {
    return createMockExpert(
      "Tejas Nikumbh", "tejasnikumbh@gmail.com",
      "UBVMH1QBS", 100, 4.9,
      "https://github.com/tejasnikumbh",
      "https://www.linkedin.com/in/tejas-nikumbh-19826061/",
      "Working Professional with experience @Microsoft, YCombinator")
  }).then(() => {
    return createMockExpert(
        "Ravi Shankar", "tejnikumbh@gmail.com",
        "UC14E3UCC", 90, 4.3,
        "https://www.github.com/ravi-0841",
        "https://www.linkedin.com/in/ravi-shankar-jhuece/",
        "Phd Candidate at John Hopkins University, USA")
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
