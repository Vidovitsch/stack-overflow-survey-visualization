const Filter = function(data) {
  this.data = data;
  this.filter = {};
  this.appliedFilter = {};
  this.filteredData = {};
  this.listeners = [];

  Filter.prototype.merge = function(newFilter) {
    Object.keys(newFilter).forEach(key => {
      this.filter[key] = newFilter[key];
    });
    return this.filter;
  }

  Filter.prototype.remove = function(key) {
    delete this.filter[key];
  }

  Filter.prototype.apply = function() {
    // Optimization
    // If new filter is almost the same as old one (extension of):
    // use already filtered dataset instead of entire dataset.
    const keys = Object.keys(this.appliedFilter);
    let isExtension = false;
    if (keys.length > 0) {
      isExtension = Object.keys(this.appliedFilter).every(key => {
        return this.appliedFilter[key] == this.filter[key];
      });
    }
    // Apply filter to dataset
    const filter = this.filter;
    const data = isExtension ? this.filteredData : this.data;
    this.filteredData = Object.values(data).reduce(function(filtered, row) {
      const complies = Object.keys(filter).every(function(key) {
        const value = row[key];
        if (value instanceof Array) return filter[key].indexOf(value) != -1;
        return value == filter[key];
      });
      if (complies) filtered.push(row);
      return filtered;
    }, []);
    // Copy filter to applied filter
    this.appliedFilter = Object.keys(filter).reduce((acc, key) => {
      acc[key] = filter[key];
      return acc;
    }, {});
    // Invoke listeners
    this.listeners.forEach(listener => {
      listener(this.filteredData);
    });

    return this.filteredData;
  }

  Filter.prototype.onFilterApplied = function(_cb) {
    this.listeners.push(_cb);
  }
}
