const getIndexOfUnfilledFields = (arrayOfObjects: Object[]) => {
  return arrayOfObjects
    .map(
      (object, objectIndex) =>
        Object.values(object)
          .map((value) => (value === "" ? objectIndex : null))
          .filter((item) => item !== null)[0]
    )
    .filter((index) => index !== undefined);
};

export default getIndexOfUnfilledFields;
