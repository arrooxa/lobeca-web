export function formatToE164(phoneNumber: string): string {
  return `+55${phoneNumber.replace(/\D/g, "")}`;
}

export function formatFromE164ToBrazilian(e164Number: string): string {
  const cleaned = e164Number.replace(/\D/g, "");

  const areaCode = cleaned.slice(2, 4);
  const firstPart = cleaned.slice(4, 9);
  const secondPart = cleaned.slice(9, 13);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

export function getNameInitials(name: string): string {
  if (!name) return "";

  const parts = name
    .trim()
    .split(" ")
    .filter((part) => part.length > 0);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    const singleName = parts[0];
    return singleName.length >= 2
      ? singleName.substring(0, 2).toUpperCase()
      : singleName.toUpperCase();
  }

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const secondInitial = parts[1].charAt(0).toUpperCase();

  return `${firstInitial}${secondInitial}`;
}
