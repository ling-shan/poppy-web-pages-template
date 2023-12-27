
interface MaskifyOpts {
  maskSymbol: string
  matchPattern: RegExp
  visibleCharsStart: number
  visibleCharsEnd: number
  minChars: number
}

const defaultMaskifyOpts: MaskifyOpts = {
  maskSymbol : '*',
  matchPattern : /^.+$/,
  visibleCharsStart : 3,
  visibleCharsEnd : 4,
  minChars : 6
}

export function maskify(inputString = '', options?: Partial<MaskifyOpts>) {
  const targetOptions = {
    ...defaultMaskifyOpts,
    ...options,
  };

  // Skip e.g. short credit card numbers or empty strings
  if (inputString.length < targetOptions.minChars) {
    return inputString;
  }

  const startChars = inputString.slice(0, targetOptions.visibleCharsStart);
  const endChars = inputString.slice(-targetOptions.visibleCharsEnd);
  const charsToMask = inputString.slice(targetOptions.visibleCharsStart, -targetOptions.visibleCharsEnd);
  const maskedChars = charsToMask.split('').map(char => {
    const output = targetOptions.matchPattern.test(char) ? targetOptions.maskSymbol : char;
    return output;
  });

  const maskedString = [
    startChars,
    ...maskedChars,
    endChars
  ].join('');


  return maskedString;
}
