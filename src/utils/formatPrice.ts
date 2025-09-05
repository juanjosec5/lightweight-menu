export const formatPrice = (
  value: number,
  currency = "COP",
  locale = "es-CO"
) => {
  let options: Intl.NumberFormatOptions = {
    style: "currency",
    currency
  };

  if (currency === "USD") {
    // Always show 2 decimals for USD
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  } else {
    // Default (e.g. COP): no decimals
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 0;
  }

  return new Intl.NumberFormat(locale, options).format(value);
};
