function combineArrays(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2))
    throw new Error("Both arguments must be of type array.");

  if (arr1.length !== arr2.length) {
    throw new Error("Both arr1 and arr2 must be of the same length.");
  }

  let res = [];
  for (let i = 0; i < arr1.length; i++) {
    res.push([arr1[i], arr2[i]]);
  }

  return res;
}

module.exports = combineArrays;
