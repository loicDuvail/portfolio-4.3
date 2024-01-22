function deepMerge(obj_1, obj_2) {
  for (const key in obj_2) {
    if (obj_1[key] && Object.getPrototypeOf(obj_1[key]) == Object.prototype) deepMerge(obj_1[key], obj_2[key]);
    else obj_1[key] = obj_2[key];
  }
  return obj_1;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const deep = { merge: deepMerge, copy: deepCopy };

module.exports = deep;
