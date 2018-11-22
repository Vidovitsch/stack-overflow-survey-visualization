/**
 * Loads dataset from CSV file.
 *
 * @param  {Object} d3                          D3.js instance
 * @param  {String} filePath                    Location of the CSV file
 * @param  {Function} [data_mapper=defaultMapper] Function that maps raw data
 *                                                to other data (e.g. string -> numeric)
 * @return {Array}                             Array of dataset rows
 */
const loadData = (d3, filePath, data_mapper=defaultMapper) => {
  return new Promise((resolve, reject) => {
    d3.csv(filePath).then((data) => {
      resolve(data_mapper(data));
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Maps raw data to other data (e.g. string -> numeric).
 *
 * @param  {Object} rows Key value pairs (key=column, value=row value)
 * @return {Object}      Rows with updated values
 */
const defaultMapper = rows => {
  return rows.map((row) => {
    return {
      LanguageWorkedWith: to_array(row.LanguageWorkedWith),
      DevType: to_array(row.DevType),
      ConvertedSalary: +row.ConvertedSalary,
      Exercise: exercise_to_number(row.Exercise),
      HoursComputer: computer_to_number(row.HoursComputer),
      HoursOutside: outside_to_number(row.HoursOutside),
      JobSatisfaction: row.JobSatisfaction,
      Employment: row.Employment,
      CompanySize: row.CompanySize,
      Country: row.Country,
      Gender: to_array(row.Gender)
    };
  });
}

/**
 * Converts character seperated values to actual arrays.
 *
 * @param  {String} value     Character seperated values
 * @param  {String} [sep=';'] Character (seperator)
 * @return {Array}           Array of seperated values
 */
const to_array = (value, sep=';') => {
  if (value.length == 0) return [];
  return value.split(sep);
}

/**
 * Converts the different categories of exercises to numbers.
 *
 * @param  {String} value String value
 * @return {Float}       Numeric value
 */
const exercise_to_number = (value) => {
  switch(value) {
    case '1 - 2 times per week':
      return 1.5;
    case '3 - 4 times per week':
      return 3.5;
    case 'Daily or almost every day':
      return 7;
    default:
      return 0;
  }
}

/**
 * Converts the different categories of computer time to numbers.
 * @param  {String} value String value
 * @return {Float}       Numeric value
 */
const computer_to_number = (value) => {
  switch(value) {
    case '1 - 4 hours':
      return 2.5;
    case '5 - 8 hours':
      return 6.5;
    case '9 - 12 hours':
      return 10.5;
    default:
      return 14;
  }
}

/**
 * Converts the different categories of outside time to numbers.
 *
 * @param  {String} value String value
 * @return {Float}       Numeric value
 */
const outside_to_number = (value) => {
  switch(value) {
    case '1 - 2 hours':
      return 1.5;
    case '3 - 4 hours':
      return 3.5;
    case '30 - 59 minutes':
      return 0.75;
    case 'Less than 30 minutes':
      return 0.25;
    default:
      return 5;
  }
}
