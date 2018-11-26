/**
 * Get all unique values from a column.
 *
 * @param  {Array} data Dataset
 * @param  {String} col  Column name
 * @return {Array}      Array of unique values
 */
const uniques = function (data, col) {
  return Object.keys(valueCounter(data, col));
}

/**
 * Groups all unique values in a column with count as value.
 * A scaler can be added to scale the values.
 *
 * @param  {Array} data    Dataset
 * @param  {String} col     Column name
 * @param  {Function} _scaler Function to scale values
 * @return {Array}         Array of key value pairs ([{key, value}, {key, value}])
 */
const groupBy = function(data, col, _scaler) {
  const counter = valueCounter(data, col);
  return Object.keys(counter).reduce((groups, key) => {
    const value = _scaler ? _scaler(counter[key]) : counter[key];
    groups.push({ key, value });
    return groups;
  }, []);
}

const values = function(data, col, _scaler) {
  return data.reduce((values, row) => {
    if (col in row) {
      const value = _scaler ? _scaler(row[col]) : row[col];
      values.push(value);
      return values;
    }
  }, []);
}

/**
 * Sort groups on their value on ascending or descending order.
 *
 * @param  {Array}  data       Dataset
 * @param  {Boolean} [asc=true] Defines the ordering: ascending or descending
 * @return {Array}             Array of key value pairs sorted on value
 */
const sortGroups = function(data, asc=true) {
  return data.sort((a, b) => {
    return asc ? a.value - b.value : b.value - a.value;
  });
}

/**
 * Creates a object with group as key
 * and frequency of the group as value.
 *
 * @param  {Array} data Dataset
 * @param  {String} col  Column name
 * @return {Object}      Object with group as key and frequency
 *                       of the group as value.
 */
const valueCounter = function(data, col) {
  return data.reduce((counter, row) => {
    const value = row[col];
    if (value instanceof Array) {
        value.forEach(v => {
          if (v in counter) counter[v] += 1;
          else counter[v] = 1;
        });
    } else {
      if (value in counter) counter[value] += 1;
      else counter[value] = 1;
    }
    return counter;
  }, {});
}
