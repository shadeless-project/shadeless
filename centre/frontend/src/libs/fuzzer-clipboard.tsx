import { Packet } from "./apis/packets";
import { API_URL, FfufDetectType, FfufFuzzMode, FfufFuzzer, FfufSettingType } from "./apis/types";
import Qs from 'qs';

const nonFuzzHeaders = ['host', 'content-type', 'content-length', 'content-encoding', 'origin', 'authorization']
const removeForDefaultHeaders = ['host', 'content-length'];

function escapeBash(param: string) {
  return param.replace(/'/g, "'\\''")
}
function addHeaderToCmd(fuzzer: FfufFuzzer, requestHeaders: string[]) {
  const { overwriteHeader, fuzzMode } = fuzzer;
  const additionalHeader = fuzzMode === FfufFuzzMode.CLUSTERBOMB ? " -H 'X-Add-Header: FUZZ'" : " ";
  const additionalCookie = fuzzMode === FfufFuzzMode.CLUSTERBOMB ? "; additional_cookie=FUZZ'" : "";

  if (!overwriteHeader) return requestHeaders.reduce((prev, cur) => {
    const [key, value] = cur.split(': ');
    if (removeForDefaultHeaders.includes(key.toLowerCase())) return prev;
    return `${prev} -H '${escapeBash(cur)}'`;
  }, additionalHeader);

  return requestHeaders.reduce((prev, cur) => {
    const [key, value] = cur.split(': ');
    if (key.toLowerCase().includes('cookie')) {
      return `${prev} -H '${escapeBash(key)}: ${escapeBash(value)}${additionalCookie}'`
    }
    if (removeForDefaultHeaders.includes(key.toLowerCase())) return prev;
    if (nonFuzzHeaders.includes(key.toLowerCase())) return `${prev} -H '${escapeBash(cur)}'`;
    return fuzzMode === FfufFuzzMode.CLUSTERBOMB ?
      `${prev} -H '${escapeBash(key)}: ${escapeBash(value)}, FUZZ'` :
      `${prev} -H '${escapeBash(key)}: §${escapeBash(value)}§'`;
  }, additionalHeader);
}

function addProxyToCmd(proxy: string) {
  if (!proxy) return '';
  return ` -x '${escapeBash(proxy)}'`;
}

function addDetectionType(chosenFuzzer: FfufFuzzer): string {
  switch (chosenFuzzer.detect) {
    case FfufDetectType.TIME:
      return ` -mt '${chosenFuzzer.detectValue}'`
    case FfufDetectType.KEYWORD:
      return ` -mr '${escapeBash(chosenFuzzer.detectValue || '')}'`
    case FfufDetectType.REFLECT:
      return ` -mr 'FUZZ'`
    default:
      return '';
  }
}

// function isSupportedType(packet: Packet) {
//   if (['GET', 'HEAD', 'OPTIONS'].includes(packet.method)) return true;
//   const contentTypeHeader = packet.requestHeaders.slice(1).find(h => h.toLowerCase().includes('content-type'));
//   if (!contentTypeHeader) return true;

//   const supported = ['json', 'x-www-form-urlencoded'];
//   return !!packet.requestHeaders.slice(1).find(v => v.toLowerCase().includes('content-type') && !!supported.find(type => v.includes(type)));
// }

function addFuzzQueryString(querystring: string, mode: FfufFuzzMode) {
  if (!querystring) return '';
  try {
    const parsedForm = Qs.parse(querystring)
    const addedFuzz = recursiveAddFuzz(parsedForm, mode);
    return '?' + Qs.stringify(addedFuzz).replaceAll(repSnipChar, '§');
  } catch (err) {
    return '';
  }
}

var repSnipChar = 'weird_char_rep'

async function getRequestBody(project: string, hash: string) {
  const data = await fetch(`${API_URL}/files/${project}/${hash}`);
  const header = data.status;
  if (header === 404) throw new Error('Request body not found');

  const response = await data.text();
  return response;
}

function recursiveAddFuzz(obj: any, mode: FfufFuzzMode): any {
  if (!window.isObject(obj) && !window.isArray(obj))
    throw new Error('Could not parse request body as json');

  if (window.isArray(obj)) {
    return obj.map((v: any) => {
      if (window.isString(v)) return mode === FfufFuzzMode.CLUSTERBOMB ? 'FUZZ' : `${repSnipChar}${v}${repSnipChar}`;
      if (window.isObject(v) || window.isArray(v)) return recursiveAddFuzz(v, mode);
      return v;
    })
  }

  let addFuzzObj: Record<string, any> = {};
  for (const key in obj) {
    if (window.isString(obj[key])) {
      addFuzzObj[key] = mode === FfufFuzzMode.CLUSTERBOMB ? 'FUZZ' : `${repSnipChar}${obj[key]}${repSnipChar}`;;
    } else if (window.isObject(obj[key]) || window.isArray(obj[key])) {
      addFuzzObj[key] = recursiveAddFuzz(obj[key], mode);
    } else {
      addFuzzObj[key] = obj[key];
    }
  }
  if (mode === FfufFuzzMode.CLUSTERBOMB) addFuzzObj['FUZZ'] = 'FUZZ';
  return addFuzzObj;
}

function tryFuzzJson(body: string, mode: FfufFuzzMode): string {
  try {
    const json = JSON.parse(body);
    const addedFuzzJson = recursiveAddFuzz(json, mode);
    return JSON.stringify(addedFuzzJson).replaceAll(repSnipChar, '§');
  } catch (err) {
    return '';
  }
}

function tryFuzzForm(body: string, mode: FfufFuzzMode): string {
  try {
    const parsedForm = Qs.parse(body)
    const addedFuzz = recursiveAddFuzz(parsedForm, mode);
    return Qs.stringify(addedFuzz).replaceAll(repSnipChar, '§');
  } catch (err) {
    return '';
  }
}

async function addFuzzBody(packet: Packet, mode: FfufFuzzMode) {
  if (packet.method !== 'POST' && packet.method !== 'PUT' && packet.method !== 'DELETE' && packet.method !== 'PATCH') return '';

  const requestBody = await getRequestBody(packet.project, packet.requestBodyHash);

  const js = tryFuzzJson(requestBody, mode);
  if (js) return ` -d '${escapeBash(js)}'`;

  const form = tryFuzzForm(requestBody, mode);
  if (form) return ` -d '${escapeBash(form)}'`;

  return '';
}

function addFuzzMode(chosenFuzzer: FfufFuzzer): string {
  return ` -mode ${chosenFuzzer.fuzzMode}`;
}

async function parseFfufToCmd(ffuf: FfufSettingType, chosenFuzzer: FfufFuzzer, packet: Packet): Promise<string> {
  const url = `${packet.origin}${packet.path}` + addFuzzQueryString(packet.querystring, chosenFuzzer.fuzzMode);
  const wordlist = ffuf.wordlists.find(v => v.name === chosenFuzzer.wordlist);
  if (!wordlist) throw new Error('Something is wrong with FfufSetting');
  // if (!isSupportedType(packet)) throw new Error('Currently only support [json, x-www-form-urlencoded]');

  const cmd = `ffuf -c -mmode 'and' -v -mc 'all' -t ${ffuf.thread} -p ${ffuf.delay} -w '${escapeBash(wordlist.path)}' -X ${packet.method}${addHeaderToCmd(chosenFuzzer, packet.requestHeaders.slice(1))}${addProxyToCmd(ffuf.proxy)}${addDetectionType(chosenFuzzer)}${await addFuzzBody(packet, chosenFuzzer.fuzzMode)}${addFuzzMode(chosenFuzzer)} -u '${escapeBash(url)}'`;
  return cmd;
}

// function parseFfufFuzzPathToCmd(ffuf: FfufSettingType, packet: Packet): string {
//   const u = `${packet.origin}${packet.path}`;
//   const url = u + (u[u.length - 1] === '/' ? '' : '/') + 'FUZZ';
//   const cmd = `ffuf -v -t ${ffuf.thread} -p ${ffuf.delay} -w $W_DIR${addHeaderToCmd(false, packet.requestHeaders.slice(1))}${addProxyToCmd(ffuf.proxy)} -u ${url}`;
//   return cmd;
// }

export async function copyClipboardFuzzer(fuzzer: FfufSettingType, chosenFuzzer: FfufFuzzer, packet: Packet) {
  const cmd = await parseFfufToCmd(fuzzer, chosenFuzzer, packet);
  window.copyToClipboard(cmd);
}

// export function copyClipboardFuzzPath(fuzzer: FfufSettingType, packet: Packet) {
//   const cmd = parseFfufFuzzPathToCmd(fuzzer, packet);
//   window.copyToClipboard(cmd);
// }
