const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function isValidRoomCode(code) {
  return /^[A-Z0-9]{4}$/.test(code.trim().toUpperCase());
}

export function normalizeRoomCode(code) {
  return code.trim().toUpperCase();
}
