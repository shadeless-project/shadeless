function escapeBash(param) {
  return param.replace(/'/g, "'\\''")
}
function addHeaderToCmd(requestHeaders) {
  const headerCmd = requestHeaders.reduce((prev, cur) => `${prev} -H '${escapeBash(cur)}'`, '');
  return headerCmd.trim();
}


x = addHeaderToCmd(['Content-Type: duma', "X-Test: w\\t'f"])
console.log(x)
