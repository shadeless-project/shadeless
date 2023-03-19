import { Td, Th } from "@chakra-ui/react";
import MyTooltip from "src/pages/common/tooltip";
import { Packet } from "./apis/packets";

export enum QueryParserErr {
  PARSE_NODE = "ERR_PARSE_NODE",
  SPECIAL_FILTER = "ERR_SPECIAL_FILTER",
  NOT_FOUND_LOGIC_OPS = "ERR_NOT_FOUND_LOGIC_OPS",
  PARENTHESES = "ERR_PARENTHESES",
  BODIES = "ERR_BODIES",
  TOKENS = "ERR_TOKENS",
}

export class ParserError extends Error {
  type: QueryParserErr;
  errorMsgLocation: string;

  constructor (type: QueryParserErr, message: string, errorMsgLocation: string = "") {
    super(message);
    this.type = type;
    this.message = message;
    this.errorMsgLocation = errorMsgLocation;
  }
}

function get1stGroupParenthese(query: string, prefixIndex: number): string {
  if (query[0] === '(') {
    let cnt = 1, end = -1;
    for (let i = 1; i < query.length; ++i) {
      cnt += +(query[i] === '(');
      cnt -= +(query[i] === ')');
      if (cnt === 0) {
        end = i;
        break;
      }
    }
    if (end === -1) throw new ParserError(QueryParserErr.PARENTHESES, `Found '(' at ql[${prefixIndex}] but no ")" was found`);
    return query.slice(1, end);
  } else throw new ParserError(QueryParserErr.PARENTHESES, `At ql[${prefixIndex}] must be an open parenthese "(" but found ${query[0]}`);
}

export type PacketColumnProperty = {
  name: string;
  type: string;
  showBody: (p: Packet) => JSX.Element;
  showCol: () => JSX.Element;
}
export const ParserPacketProperties: PacketColumnProperty[] = [
  {
    name: 'requestPacketId',
    type: 'String',
    showBody: (p: Packet) => <Td>{p.requestPacketId.slice(0, 5) + '...' + p.requestPacketId.slice(-5)}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="The ID correspond with Burpsuite Shadeless log">ID</MyTooltip>
      </Th>
  },
  {
    name: 'requestPacketPrefix',
    type: 'String',
    showBody: (p: Packet) => <Td>{p.requestPacketPrefix.slice(0, 5) + '...' + p.requestPacketPrefix.slice(-5)}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="The ID prefix correspond with Burpsuite Shadeless log">Prefix</MyTooltip>
      </Th>
  },
  {
    name: 'requestPacketIndex',
    type: 'Number',
    showBody: (p: Packet) => <Td>{p.requestPacketIndex}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="The ID index correspond with Burpsuite Shadeless log">Index</MyTooltip>
      </Th>
  },
  {
    name: 'count',
    type: 'Number',
    showBody: (p: Packet) => <Td>{p.count}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Count number of look-alike request">CNT</MyTooltip>
      </Th>
  },
  {
    name: 'toolName',
    type: 'String',
    showBody: (p: Packet) => <Td>{p.toolName}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="The request is captured by">Tool</MyTooltip>
      </Th>
  },
  {
    name: 'method',
    type: 'String',
    showBody: (p: Packet) => <Td>{p.method}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's method">Method</MyTooltip>
      </Th>
  },
  {
    name: 'referer',
    type: 'String',
    showBody: (p: Packet) => <Td maxW="200px">{p.referer}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's referer">Referer</MyTooltip>
      </Th>
  },
  {
    name: 'protocol',
    type: 'String',
    showBody: (p: Packet) => <Td>{p.protocol}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's protocol">Protocol</MyTooltip>
      </Th>
  },
  {
    name: 'origin',
    type: 'String',
    showBody: (p: Packet) => <Td maxW="300px">{p.origin}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's origin">Origin</MyTooltip>
      </Th>
  },
  {
    name: 'port',
    type: 'Number',
    showBody: (p: Packet) => <Td>{p.port.toString()}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's port">Port</MyTooltip>
      </Th>
  },
  {
    name: 'path',
    type: 'String',
    showBody: (p: Packet) => <Td maxW="320px">{p.path}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's path">Path</MyTooltip>
      </Th>
  },
  {
    name: 'querystring',
    type: 'String',
    showBody: (p: Packet) => <Td maxW="320px">{p.querystring || ''}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Request's querystring">Qs</MyTooltip>
      </Th>
  },
  {
    name: 'parameters',
    type: 'String[]',
    showBody: (p: Packet) => <Td maxW="280px">[{p.parameters.join(', ')}]</Td>,
    showCol: () => <Th><MyTooltip label="parameters">Params</MyTooltip></Th>
  },
  {
    name: 'requestHeaders',
    type: 'String[]',
    showBody: (p: Packet) => <Td maxW="500px">[{p.requestHeaders.join(',')}]</Td>,
    showCol: () => <Th><MyTooltip label="Request headers">ReqHeader</MyTooltip></Th>
  },
  {
    name: 'responseStatus',
    type: 'Number',
    showBody: (p: Packet) => <Td>{p.responseStatus.toString()}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Response status">Status</MyTooltip>
      </Th>
  },
  {
    name: 'responseHeaders',
    type: 'String[]',
    showBody: (p: Packet) => <Td maxW="500px">[{p.responseHeaders.join(',')}]</Td>,
    showCol: () => <Th><MyTooltip label="Response headers">ResHeader</MyTooltip></Th>
  },
  {
    name: 'rtt',
    type: 'Number',
    showBody: (p: Packet) => <Td>{p.rtt.toString()}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Roundtrip time">Rtt</MyTooltip>
      </Th>
  },
  {
    name: 'reflectedParameters',
    type: 'Map<String,String>',
    showBody: (p: Packet) => <Td maxW="180px" pr="5px">[{Object.keys(p.reflectedParameters || {}).join(', ')}]</Td>,
    showCol: () => <Th><MyTooltip label="reflectedParameters">Reflected</MyTooltip></Th>
  },
  {
    name: 'codeName',
    type: 'String',
    showBody: (p: Packet) => <Td maxW="320px">{p.codeName}</Td>,
    showCol: () =>
      <Th><MyTooltip label="Sender's codename">Author</MyTooltip></Th>
  },
  {
    name: 'staticScore',
    type: 'Number',
    showBody: (p: Packet) => <Td>{p.staticScore.toString()}</Td>,
    showCol: () =>
      <Th>
        <MyTooltip label="Static Score">Score</MyTooltip>
      </Th>
  },
];
const ParserOperations = {
  '==': '$eq',
  '===': '$eq',
  '<': '$lt',
  '<=': '$lte',
  '>': '$gt',
  '>=': '$gte',
  '!=': '$ne',
  // 'matches': '$regex',
  // 'contains': '$regex'
  // 'not_matches': '$not: { $regex }'
  // 'not_contains': '$not: { $regex }'
} as any

type Interval = {
  from: number;
  to: number;
};
function toNode(leftNode: string, ops: string, rightNode: string, idxInterval: Interval): any {
  let val;
  try {
    // Convert string rightNode to magic like object or regex
    val = eval(`rightNode = ${rightNode}`) as any;
  } catch (err) {
    throw new ParserError(QueryParserErr.PARSE_NODE, `Could not evaluate value for "${rightNode}"`, `Error detected at ql[${idxInterval.from}:${idxInterval.to}]`);
  }
  if (ops in ParserOperations)
    return {
      [leftNode]: {
        [ParserOperations[ops]]: val
      }
    }
  if (ops.includes('match') || ops.includes('contain')) {
    if (!ops.includes('not'))
      return {
        [leftNode]: {
          $regex: rightNode
        }
      }
    return {
      [leftNode]: {
        $not: {
          $regex: rightNode
        }
      }
    }
  }
  throw new ParserError(QueryParserErr.PARSE_NODE, `Not found operation "${ops}". Supported operation "match" and "contain" only!`, `Error detected at ql[${idxInterval.from}:${idxInterval.to}]`);
}

/** Logic
 * () && || !
 *
 * Ops
 * MATCHES
 * CONTAINS
 * ==
 * <=
 * >=
 * <
 * >
 * !() &&
 * () &&
 * SOMETHING &&
 */

function isSpace(c: string): boolean {
  return ['\r', '\n', '\t', ' '].includes(c);
}

function getNextToken(s: string): string {
  let i = 0;
  for (; i < s.length && isSpace(s[i]); ++i);

  let terminator = undefined;
  if (s[i] === "'" || s[i] === "`" || s[i] === '"' || s[i] === '/') terminator = s[i], i++;

  if (!terminator) {
    for (; i < s.length && !isSpace(s[i]); ++i);
  } else {
    while (i < s.length) {
      try { // Try to eval until not error :)
        eval(s.slice(0, i));
        return s.slice(0, i);
      } catch (e) {
        ++i
      }
    }
  }
  return s.slice(0, i);
}
function getNext3Tokens(s: string, prefixIndex: number): [string, string, string, number] {
  let skipNums = 0;
  const firstToken = getNextToken(s);
  if (firstToken.length === 0) throw new ParserError(QueryParserErr.TOKENS, `Could not parse first token`, `Error detected at ql[${prefixIndex}]`);
  s = s.slice(firstToken.length), prefixIndex += firstToken.length, skipNums += firstToken.length;

  const secondToken = getNextToken(s);
  if (secondToken.length === 0) throw new ParserError(QueryParserErr.TOKENS, `Could not parse second token`, `Error detected at ql[${prefixIndex}]`);
  s = s.slice(secondToken.length), prefixIndex += secondToken.length, skipNums += secondToken.length;

  const thirdToken = getNextToken(s);
  if (thirdToken.length === 0) throw new ParserError(QueryParserErr.TOKENS, `Could not parse third token`, `Error detected at ql[${prefixIndex}]`);
  s = s.slice(thirdToken.length), prefixIndex += thirdToken.length, skipNums += thirdToken.length;

  return [firstToken.trim(), secondToken.trim(), thirdToken.trim(), skipNums];
}

function validateNode(L: string, OPS: string, firstNode: any): any {
  if (['requestHeaders', 'responseHeaders'].includes(L)) {
    if (!(OPS.includes('match') || OPS.includes('contain')))
      throw new ParserError(
        QueryParserErr.SPECIAL_FILTER,
        `When filter types of bodies, or requestHeaders, responseHeaders, headers, only support operator "matches"/"contains"/"not_matches"/"not_contains". However, "${OPS}" was found.`
      )
  }
  if (L === 'reflectedParameters') {
    if (OPS !== '==' && OPS !== '!=') throw new ParserError(
      QueryParserErr.SPECIAL_FILTER,
      `When filter "reflectedParameters" only support operator "=="/"!=". However, "${OPS}" was found.`
    )
  }
  return firstNode;
}

function parseLogicFromQuery(query: string, prefixIndex: number = 0): any {
  while (query.length > 0 && isSpace(query[0])) query = query.slice(1), prefixIndex += 1;
  if (query.length === 0) return {};

  let firstNode = {};
  if (query[0] === '(') {
    const firstGroup = get1stGroupParenthese(query, prefixIndex);
    firstNode = parseLogicFromQuery(firstGroup);
    query = query.slice(firstGroup.length + 2);
    prefixIndex += firstGroup.length + 2;
  } else {
    const [L, OPS, R, len] = getNext3Tokens(query, prefixIndex);
    firstNode = toNode(L, OPS, R, { from: prefixIndex, to: prefixIndex + len - 1 });
    firstNode = validateNode(L, OPS, firstNode);
    query = query.slice(len);
    prefixIndex += len;
  }

  const logicToken = getNextToken(query);
  const logicOperation = logicToken.trim();

  if (logicOperation.length === 0) return firstNode;
  if (!['&&','||','and','or','&','|'].includes(logicOperation))
    throw new ParserError(
      QueryParserErr.NOT_FOUND_LOGIC_OPS,
      `Support logic operation "&","|","&&","||","and","or" only but found logic operation called "${logicOperation}"`,
      `Error detected at ql[${prefixIndex}]`,
    );
  query = query.slice(logicToken.length), prefixIndex += logicToken.length;
  return {
    [(logicOperation.includes('&') || logicOperation === 'and') ? '$and' : '$or']: [
      firstNode,
      parseLogicFromQuery(query, prefixIndex)
    ],
  }
}

export type Query2ObjectResult = {
  body?: string;
  requestBody?: string;
  responseBody?: string;
  criteria: any;
  queryDistinct: boolean;
}
export const defaultQuery2ObjectResult: Query2ObjectResult = {
  body: undefined,
  requestBody: undefined,
  responseBody: undefined,
  criteria: {},
  queryDistinct: false,
}
export function query2Object(query: string): any {
  const criteria = parseLogicFromQuery(query);
  return criteria;
}
