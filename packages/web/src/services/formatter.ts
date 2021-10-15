interface FormatterSettings {
  style?: string;
  minimumFractionDigits?: number;
}

export const formatter = (value: number, locale: string, settings?: FormatterSettings): string => {
  const { style = 'currency', minimumFractionDigits = 0 } = settings || {};
  const shouldShorten = value > 0.01 && Math.round(value).toString().length > 6;

  const locales = {
    usd: 'en-US',
    brl: 'pt-BR',
  } as { [locale: string]: string };

  return new Intl.NumberFormat(locales[locale] ?? 'en-US', {
    style,
    minimumFractionDigits: locale === 'eth' && style === 'currency' ? 5 : minimumFractionDigits,
    currency: style === 'currency' ? locale || 'usd' : undefined,
    notation: shouldShorten ? 'compact' : 'standard',
    compactDisplay: shouldShorten ? 'short' : 'long',
  }).format(value);
};
