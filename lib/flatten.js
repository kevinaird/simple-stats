module.exports = function flattenJSON(json){
    const flattened = {};

    walk(json, function(path, item) {
      flattened[path.join('_')] = item;
    });
  
    return flattened;
  
    function walk(obj, visitor, path) {
      let item;
      path = path || [];
      for (const key in obj) {
        item = obj[key];
        if (typeof item === 'object') {
          walk(item, visitor, path.concat(key));
        } else {
          visitor(path.concat(key), item);
        }
      }
    }
}