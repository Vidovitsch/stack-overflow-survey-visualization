const Filter = function(data) {
  this.data = data;
  this.filter = {};
  this.filteredData = {};

  Filter.prototype.merge = function(newFilter) {
    Object.keys(newFilter).forEach((key) => {
      this.filter[key] = newFilter[key];
    });
    return this.filter;
  }

  Filter.prototype.apply = function() {
    const filter = this.filter;
    this.filteredData = Object.values(this.data).reduce(function(filtered, row) {
      const complies = Object.keys(filter).every(function(key) {
        const value = row[key];
        if (value instanceof Array) return filter[key].indexOf(value) != -1;
        return value == filter[key];
      });
      if (complies) filtered.push(row);
      return filtered;
    }, []);
    return this.filteredData;
  }
}
