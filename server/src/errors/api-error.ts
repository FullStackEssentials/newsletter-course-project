export type Code = keyof typeof errors;

const errors = {
  "ERR-001": "{#key} is required",
  "ERR-002": "{#key} is not valid",
  "ERR-003": "Invalid PubSub payload",
};

export const getErrorDescription = (code: Code, key?: string) => {
  const errorDescription = errors[code];
  const description = `${code}: ${errorDescription}`;

  if (!key) return description;
  return description.replace("{#key}", key);
};

export class ErrorCode extends Error {
  code: Code;

  constructor(code: Code, key?: string) {
    const message = getErrorDescription(code, key);
    super(message);
    this.code = code;
  }
}
