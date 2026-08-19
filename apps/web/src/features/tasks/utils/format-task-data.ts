/** Converts a camel-cased API data key into a readable UI label. */
export const formatTaskDataLabel = (key: string): string => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
};

/**
 * Turns any saved task value into simple text that a person can read.
 *
 * Think of the API value as a closed box. The function opens the box and asks
 * what is inside:
 *
 * - `true` or `false` becomes `Yes` or `No`.
 * - An empty value becomes `—`.
 * - Text and numbers become normal text.
 * - A value whose key contains `price` also receives a `$` sign.
 * - An array or object is opened, and this same function formats every value
 *   found inside it. This repeated call is called recursion.
 *
 * For example, `{ supplierName: 'Roi', price: 100 }` becomes
 * `Supplier Name: Roi · Price: 100$`.
 *
 * @param value The saved API value that needs to be displayed.
 * @param key Its optional property name, used to recognize prices.
 * @returns Simple readable text for the task summary.
 */
export const formatTaskDataValue = (value: unknown, key?: string): string => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value !== "object") {
    return key?.toLowerCase().includes("price")
      ? `${String(value)}$`
      : String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item !== "object" || item === null) return String(item);

        return Object.entries(item)
          .map(
            ([itemKey, itemValue]) =>
              `${formatTaskDataLabel(itemKey)}: ${formatTaskDataValue(itemValue, itemKey)}`,
          )
          .join(" · ");
      })
      .join("\n");
  }

  return Object.entries(value)
    .map(
      ([itemKey, itemValue]) =>
        `${formatTaskDataLabel(itemKey)}: ${formatTaskDataValue(itemValue, itemKey)}`,
    )
    .join(" · ");
};
