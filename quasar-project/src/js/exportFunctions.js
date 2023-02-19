export const checkNumber = (stringToCheck) => {
  let tempString = stringToCheck;
  if (stringToCheck.includes(" ein ") || stringToCheck.includes("Ein ")) {
    if (stringToCheck.includes(" eine ") || stringToCheck.includes("Eine ")) {
      tempString = tempString.replace("eine", "1");
    } else {
      tempString = tempString.replace("ein", "1");
    }
    return tempString;
  } else if (
    stringToCheck.includes(" zwei ") ||
    stringToCheck.includes("Zwei ")
  ) {
    tempString = tempString.replace("zwei", "2");
    return tempString;
  } else if (
    stringToCheck.includes(" drei ") ||
    stringToCheck.includes("Drei ")
  ) {
    tempString = tempString.replace("drei", "3");
    return tempString;
  } else if (
    stringToCheck.includes(" vier ") ||
    stringToCheck.includes("Vier ")
  ) {
    tempString = tempString.replace("vier", "4");
    return tempString;
  } else if (
    stringToCheck.includes(" fünf ") ||
    stringToCheck.includes("Fünf ")
  ) {
    tempString = tempString.replace("fünf", "5");
    return tempString;
  } else if (
    stringToCheck.includes(" sechs ") ||
    stringToCheck.includes("Sechs ")
  ) {
    tempString = tempString.replace("sechs", "6");
    return tempString;
  } else if (
    stringToCheck.includes(" sieben ") ||
    stringToCheck.includes("Sieben ")
  ) {
    tempString = tempString.replace("sieben", "7");
    return tempString;
  } else if (
    stringToCheck.includes(" acht ") ||
    stringToCheck.includes("Acht ")
  ) {
    tempString = tempString.replace("acht", "8");
    return tempString;
  } else if (
    stringToCheck.includes(" neun ") ||
    stringToCheck.includes("Neun ")
  ) {
    tempString = tempString.replace("neun", "9");
    return tempString;
  } else if (
    stringToCheck.includes(" zehn ") ||
    stringToCheck.includes("Zehn ")
  ) {
    tempString = tempString.replace("zehn", "10");
    return tempString;
  } else if (
    stringToCheck.includes(" elf ") ||
    stringToCheck.includes("Elf ")
  ) {
    tempString = tempString.replace("efl", "11");
    return tempString;
  } else {
    return null;
  }
};

export const checkSize = (stringToCheck) => {
  let tempString = stringToCheck;
  if (stringToCheck.includes(" gramm ") || stringToCheck.includes(" Gramm ")) {
    tempString = tempString.replace("gramm", "g");
    return tempString;
  } else if (
    stringToCheck.includes(" kilo ") ||
    stringToCheck.includes(" Kilo ")
  ) {
    tempString = tempString.replace("kilo", "kg");
    return tempString;
  } else if (
    stringToCheck.includes(" kilogramm ") ||
    stringToCheck.includes(" Kilogramm ")
  ) {
    tempString = tempString.replace("kilogramm", "kg");
    return tempString;
  } else if (
    stringToCheck.includes(" liter ") ||
    stringToCheck.includes(" Liter ")
  ) {
    tempString = tempString.replace("liter", "l");
    return tempString;
  } else if (
    stringToCheck.includes(" milliliter ") ||
    stringToCheck.includes(" Milliliter ")
  ) {
    tempString = tempString.replace("milliliter", "ml");
    return tempString;
  } else if (
    stringToCheck.includes(" stück ") ||
    stringToCheck.includes(" Stück ")
  ) {
    tempString = tempString.replace("stück", "Stk");
    return tempString;
  } else if (
    stringToCheck.includes(" packung ") ||
    stringToCheck.includes(" Packung ")
  ) {
    tempString = tempString.replace("packung", "Pkg");
    return tempString;
  } else if (
    stringToCheck.includes(" packungen ") ||
    stringToCheck.includes(" Packungen ")
  ) {
    tempString = tempString.replace("packungen", "Pkg");
    return tempString;
  } else {
    return null;
  }
};
