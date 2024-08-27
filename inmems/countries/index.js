const countriesByCode = {};
module.exports.save = (v) => (countriesByCode[v.code] = v);
