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
