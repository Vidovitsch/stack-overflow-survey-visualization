const DataLoader = function (d3) {

  DataLoader.prototype.loadData = function (filePath, data_mapper) {
    return new Promise((resolve, reject) => {
      d3.csv(filePath).then((data) => {
        resolve(data_mapper(data));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  DataLoader.prototype.defaultMapper = function (rows) {
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

  DataLoader.prototype.listValuesToFrequencyPairs = function (data, property) {
    // Create dictionary of frequency per value
    const frequencyCounter = data.reduce((frequencyCounter, row) => {
      row[property].forEach((value) => {
        if (value in frequencyCounter) frequencyCounter[value] += 1;
        else frequencyCounter[value] = 1;
      });
      return frequencyCounter;
    }, {});

    let value_counts = [];
    // Dictionary to list of key value pairs.
    // Value is in percentage / 100.
    Object.keys(frequencyCounter).forEach((key) => {
      value_counts.push({ key, value: frequencyCounter[key] / data.length });
    });
    // Sort list of key value pairs
    value_counts = value_counts.sort((a, b) => {
      return a.value - b.value;
    });
    return value_counts;
  }

  DataLoader.prototype.getUniques = function (data, property) {
    const uniques = Object.keys(data.reduce((uniques, row) => {
      const value = row[property];
      if (value instanceof Array) value.forEach((value) => { uniques[value] = 0; });
      else uniques[value] = 0;
      return uniques;
    }, {}));
    return uniques.filter(value => value != '').sort((a, b) => {
      return a - b
    });
  }

  const to_array = (value, sep=';') => {
    if (value.length == 0) return null;
    return value.split(sep);
  }

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
}
