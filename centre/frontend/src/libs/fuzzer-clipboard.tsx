import { Packet } from "./apis/packets";
import { FfufSettingType } from "./apis/types";

function parseFfufSettingToCmd(ffuf: FfufSettingType, packet: Packet): string {
  const cmd = `ffuf -u `
}

export function copyClipboardFuzzer(fuzzer: FfufSettingType, packet: Packet) {
  const cmd = parseFfufSettingToCmd(fuzzer, packet);
  window.copyToClipboard(cmd);
}