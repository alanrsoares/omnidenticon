type AddressKind = "ethereum" | "gno" | "cosmos" | "unknown";

export const inferAddressKind = (address: string, prefix = ""): AddressKind => {
  if (address.startsWith("0x")) {
    return "ethereum";
  } else if (/^g(\w+)/.test(address) && !prefix) {
    return "gno";
  } else if (prefix && address.startsWith(prefix)) {
    return "cosmos";
  } else {
    return "unknown";
  }
};

export const addressToNumber = (address: string, prefix = ""): number => {
  const kind = inferAddressKind(address, prefix);

  switch (kind) {
    case "ethereum":
      return parseInt(address.slice(2, 10), 16);
    case "gno":
      return stringToNumber(address.slice(1));
    case "cosmos":
      return stringToNumber(address.replace(prefix, ""));
    case "unknown":
    default:
      return stringToNumber(address);
  }
};

const stringToNumber = (str: string) =>
  str
    .split("")
    .reduce(
      (acc, char, i) =>
        acc + (isNaN(Number(char)) ? char.charCodeAt(0) + i : Number(char)),
      0
    );
