export const COST_PER_BYTE = 400;
export const COST_PER_BOX = 2500;
export const MAX_BOX_SIZE = 32768;

export const BYTES_PER_CALL =
  2048 -
  4 - // 4 bytes for the method selector
  34 - // 34 bytes for the key
  8 - // 8 bytes for the box index
  8; // 8 bytes for the offset
