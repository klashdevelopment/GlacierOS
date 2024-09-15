export default class xor {
  static encode(str: string) {
    return encodeURIComponent(
      str
        .toString()
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        )
        .join("")
    );
  }
  static decode(str: string) {
    if (str.charAt(str.length - 1) == "/") str = str.slice(0, -1);
    return decodeURIComponent(str)
      .split("")
      .map((char, ind) =>
        ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
      )
      .join("");
  }
  static uriencode(str: string) {
    return encodeURIComponent(str)
  }
  static quickURL(str: string) {
    return `/uv/service/${xor.encode(str)}`
  }
}

export function formatJson(input: any) {
  function formatValue(value: any, indent: any) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).map((key: any): string => {
        if (typeof value[key] === 'object') {
          return `${indent}- "${key}":\n${formatValue(value[key], indent + '    ')}`;
        } else {
          return `${indent}- "${key}": "${value[key]}"`;
        }
      }).join('\n');
    } else if (Array.isArray(value)) {
      return value.map((item: any): string => {
        if (typeof item === 'object' && !Array.isArray(item)) {
          return `${indent}-\n${formatValue(item, indent + '    ')}`;
        } else if (Array.isArray(item)) {
          return `${indent}- (array)\n${formatValue(item, indent + '    ')}`;
        } else {
          return `${indent}- ${item}`;
        }
      }).join('\n');
    } else {
      return `${indent}- ${value}`;
    }
  }

  let output = '';
  if (Array.isArray(input)) {
    output += '- root (array)\n';
    output += formatValue(input, '    ');
  } else {
    output += formatValue(input, '');
  }

  return output;
}