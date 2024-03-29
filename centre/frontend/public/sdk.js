// Simple sdk
// =================================== sdk.js ===================================
window.copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
if (location.pathname === '/') location = '/projects';
window.formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  let month = (1 + dateObj.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  let day = dateObj.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return day + '/' + month + '/' + year;
}
window.getUser = () => {
  const user = JSON.parse(localStorage.getItem('account') || '{}');
  return user;
}
window.getUserRole = () => {
  const user = window.getUser();
  return user?.role;
}
window.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
window.escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.isString = (v) => {
  return (typeof v === 'string');
}
window.isArray = (v) => {
  return v.constructor === Array;
}
window.isObject = (v) => {
  if (typeof v === 'object' && v !== null) return true;
  return false;
}
window.isNumber = (v) => {
  return typeof v === 'number';
}
window.isArrayString = (arr) => {
  if (!window.isArray(arr)) return false;
  return !arr.find(s => !window.isString(s));
}
window.isArrayObject = (arr) => {
  if (!window.isArray(arr)) return false;
  return !arr.find(s => !window.isObject(s));
}
window.isBool = (v) => {
  if (v === true || v === false) return true;
  return false;
}

// =================================== FFUF.js ===================================
// reflect
// time-based
// error-based
// weird
window.isSetupFfufCorrect = (ffufSetting) => {
  // ffuf_setting: {
  //   "wordlists": {
  //     "DIR": "/path/to/dir/wordlist",
  //     "TIME": "/path/to/time-based/wordlist",
  //     "ERROR": "/path/to/error-based/wordlist",
  //   },
  //   "thread": 8,
  //   "proxy": "http://proxy:8080",
  //   "fuzzers": [
  //     {"name":"fuzzer_1","wordlist":"wordlist_name1","detect":"time or reflect or keyword or none","detectValue":"value", "overwriteHeader": true or false},
  //     {"name":"fuzzer_2","wordlist":"wordlist_name2","detect":"time","detectValue":"<10000", "overwriteHeader": true or false},
  //   ]
  // }
  if (!ffufSetting) return false;
  if (window.isString(ffufSetting)) ffufSetting = JSON.parse(ffufSetting);

  const thread = ffufSetting['thread'];
  const delay = ffufSetting['delay'];
  const proxy = ffufSetting['proxy'];
  const fuzzers = ffufSetting['fuzzers'];
  const wordlists = ffufSetting['wordlists'];

  if (!window.isNumber(delay)) return false;
  if (!window.isNumber(thread)) return false;
  if (!window.isString(proxy)) return false;
  if (!window.isArrayObject(wordlists)) return false;
  if (!window.isArrayObject(fuzzers)) return false;

  const wordlistNames = wordlists.map(v => v.name);

  const isCorrectFuzzerObject = (obj) => {
    if (!window.isString(obj.name)) return false;
    if (!window.isString(obj.detect)) return false;
    if (!window.isString(obj.wordlist)) return false;
    if (!window.isString(obj.fuzzMode)) return false;
    if (!window.isBool(obj.overwriteHeader)) return false;

    if (!wordlistNames.includes(obj.wordlist)) return false;
    return true;
  }
  const isCorrectWordlistObject = (obj) => {
    if (!window.isString(obj['name'])) return false;
    if (!window.isString(obj['path'])) return false;
    return true;
  }
  if (fuzzers.find(fuzzer => !isCorrectFuzzerObject(fuzzer))) return false;
  if (wordlists.find(wl => !isCorrectWordlistObject(wl))) return false;
  return true;
}
window.onload = function () {
  const hasSetupFfuf = !!window.localStorage.getItem('has_setup_ffuf');
  if (!hasSetupFfuf || !window.isSetupFfufCorrect(window.localStorage.getItem('ffuf_setting'))) {
    window.localStorage.setItem('has_setup_ffuf', "1");
    const ffufSetting = {
      "proxy": "",
      "delay": 0.1,
      "thread": 30,
      "wordlists": [
        { "name": "TIME", "path": "/path/to/time-based/wordlist.txt" },
        { "name": "REFLECT", "path": "/path/to/reflect-based/wordlist.txt" },
        { "name": "ERROR", "path": "/path/to/error-based/wordlist.txt" },
      ],
      "fuzzers": [
        { "name": "Reflected", "wordlist": "REFLECT", "detect": "reflect", "overwriteHeader": false, "fuzzMode": "sniper" },
        { "name": "Time-based header", "wordlist": "TIME", "detect": "time", "detectValue": ">6000", "overwriteHeader": true, "fuzzMode": "clusterbomb" },
        { "name": "Time-based payload", "wordlist": "TIME", "detect": "time", "detectValue": ">6000", "overwriteHeader": false, "fuzzMode": "sniper" },
        { "name": "Error-based header", "wordlist": "ERROR", "detect": "keyword", "detectValue": "60481729|(Usage:)|(uid=)|(id: command not found)|(id: not found)|('id' not found)|('id' is not recognized as)|(mysql_fetch_)|(not a valid MySQL)|(not a legal PLSQL identifer)|(mysql_connect)|(SELECT\s+[^:>]+\sFROM\s+[^:>]+\sWHERE\s+)|(at\s[[:alnum:]\/\._]+\sline\s\d+)|ociparse\(\)|(must be a syntactically valid variable)|(CFSQLTYPE)|(Unknown column)|(Microsoft OLE DB Provider for SQL)|(SQL QUERY FAILURE)|(Syntax error.{1,50}in query)|(You have an error in your SQL syntax)|(Unclosed quotation mark)", "overwriteHeader": true, "fuzzMode": "clusterbomb" },
        { "name": "Error-based payload", "wordlist": "ERROR", "detect": "keyword", "detectValue": "60481729|(Usage:)|(uid=)|(id: command not found)|(id: not found)|('id' not found)|('id' is not recognized as)|(mysql_fetch_)|(not a valid MySQL)|(not a legal PLSQL identifer)|(mysql_connect)|(SELECT\s+[^:>]+\sFROM\s+[^:>]+\sWHERE\s+)|(at\s[[:alnum:]\/\._]+\sline\s\d+)|ociparse\(\)|(must be a syntactically valid variable)|(CFSQLTYPE)|(Unknown column)|(Microsoft OLE DB Provider for SQL)|(SQL QUERY FAILURE)|(Syntax error.{1,50}in query)|(You have an error in your SQL syntax)|(Unclosed quotation mark)", "overwriteHeader": false, "fuzzMode": "sniper" },
      ],
    }
    window.localStorage.setItem('ffuf_setting', JSON.stringify(ffufSetting));
  }
}
