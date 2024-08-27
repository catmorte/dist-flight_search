const locations = require("../../inmems/locations");
const countries = require("../../inmems/countries");
module.exports.locationsByCode = {};
module.exports.countriesByCode = {};
module.exports.handle = function(rq, rs) {
  if (!rs.Result || !rs.Result.Suggestions) {
    return [];
  }
  for (const suggestion of rs.Result.Suggestions) {
    if (!suggestion.Code) continue;
    if (!suggestion.Name) continue;
    const constructedSuggestion = {
      code: suggestion.Code,
      name: suggestion.Name,
      type: suggestion.Type,
    };
    locations.save(constructedSuggestion);
    if (suggestion.Type === "Airport" && suggestion.City) {
      locations.save({
        code: suggestion.City.Code,
        name: suggestion.City.Name,
        type: "City",
      });
    }
    if (suggestion.Country) {
      countries.save({
        code: suggestion.Country.Code,
        name: suggestion.Country.Name,
      });
    }
  }
};
