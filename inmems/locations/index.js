const locationsByCode = {
  IST: {
    code: "IST",
    name: "Стамбул",
    type: "City",
  },
  MOW: {
    code: "MOW",
    name: "Москва",
    type: "City",
  },
  LED: {
    code: "LED",
    name: "Санкт-Петербург",
    type: "City",
  },
  AER: {
    code: "AER",
    name: "Сочи",
    type: "City",
  },
};

module.exports.save = (v) => {
  locationsByCode[v.code] = v;
};

module.exports.getByCode = (code) => locationsByCode[code];
