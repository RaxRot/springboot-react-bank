// simple helpers for formatting
export const shortIban = (iban = "") =>
    iban.length > 10 ? `${iban.slice(0, 4)}…${iban.slice(-3)}` : iban;

export const formatMoney = (val, cur) => {
    const n = Number(val ?? 0);
    return `${n.toFixed(2)} ${cur || ""}`.trim();
};

export const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
};
