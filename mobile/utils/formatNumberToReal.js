const formatNumberToReal = (number) => {
  let numberParts = String(number).split(".");
  let start = numberParts[0];
  let end = numberParts.length > 1 ? "," + numberParts[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(start)) {
    start = start.replace(rgx, "$1" + "," + "$2");
  }
  return "R$ " + start + end;
};

export default formatNumberToReal;
