import { exec, hash } from '@drstrain/drutil';
import { RawPacket } from './schemas/raw_packet.schema';

/**
 * Run ripgrep with value `val` in specified directory
 *
 * @function
 * @param {string} directory - The directory that will run ripgrep
 * @param {string} regexValue - The regex value to search for
 * @return {string} The location of request/response body
 */
export async function grepRegexInDirectory(
  directory: string,
  regexValue: string,
): Promise<string[]> {
  const FILE_NAME_LENGTH = 64;
  const { stdout } = await exec('rg', [
    '--files-with-matches',
    '--text',
    '--color',
    'never',
    '-e',
    regexValue,
    directory,
  ]);
  return stdout
    .split('\n')
    .map((line) => line.slice(line.length - FILE_NAME_LENGTH));
}

export function getOneExist<T>(...args: T[]): T {
  return args.find((v) => !!v);
}

/**
 * Calculate hash for a rawPacket
 * For detecting least frequently used feature :)
 *
 * @function
 * @param {RawPacket} p - The packet to hash
 * @return {string} The hash result
 */
export function calculateHash(p: Partial<RawPacket>): string {
  const input = `project=${p.project};method=${p.method};origin=${p.origin};path=${p.path}`;
  const output = hash(input, 'sha256');
  return output;
}
