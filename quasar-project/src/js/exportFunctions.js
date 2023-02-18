export const checkNumber = (stringToCheck) => {
  let tempString = stringToCheck;
  if (stringToCheck.includes("ein") || stringToCheck.includes("Ein")) {
    if (stringToCheck.includes("eine") || stringToCheck.includes("Eine")) {
      tempString = tempString.replace("eine", "");
    } else {
      tempString = tempString.replace("ein", "");
    }
    return "1 " + tempString;
  } else if (stringToCheck.includes("zwei") || stringToCheck.includes("Zwei")) {
    tempString = tempString.replace("zwei", "");
    return "2 " + tempString;
  } else if (stringToCheck.includes("drei") || stringToCheck.includes("Drei")) {
    tempString = tempString.replace("drei", "");
    return "3 " + tempString;
  } else if (stringToCheck.includes("vier") || stringToCheck.includes("Vier")) {
    tempString = tempString.replace("vier", "");
    return "4 " + tempString;
  } else if (stringToCheck.includes("fünf") || stringToCheck.includes("Fünf")) {
    tempString = tempString.replace("fünf", "");
    return "5 " + tempString;
  } else if (
    stringToCheck.includes("sechs") ||
    stringToCheck.includes("Sechs")
  ) {
    tempString = tempString.replace("sechs", "");
    return "6 " + tempString;
  } else if (
    stringToCheck.includes("sieben") ||
    stringToCheck.includes("Sieben")
  ) {
    tempString = tempString.replace("sieben", "");
    return "7 " + tempString;
  } else if (stringToCheck.includes("acht") || stringToCheck.includes("Acht")) {
    tempString = tempString.replace("acht", "");
    return "8 " + tempString;
  } else if (stringToCheck.includes("neun") || stringToCheck.includes("Neun")) {
    tempString = tempString.replace("neun", "");
    return "9 " + tempString;
  } else if (stringToCheck.includes("zehn") || stringToCheck.includes("Zehn")) {
    tempString = tempString.replace("zehn", "");
    return "10 " + tempString;
  } else if (stringToCheck.includes("elf") || stringToCheck.includes("Elf")) {
    tempString = tempString.replace("efl", "");
    return "11 " + tempString;
  } else {
    return null;
  }
};

export const checkSize = (stringToCheck) => {
  let tempString = stringToCheck;
  if (stringToCheck.includes("gramm") || stringToCheck.includes("Gramm")) {
    if (stringToCheck.includes("kilo") || stringToCheck.includes("Kilo")) {
      if (
        stringToCheck.includes("kilogramm") ||
        stringToCheck.includes("Kilogramm")
      ) {
        tempString = tempString.replace("kilogramm", "kg");
      } else {
        tempString = tempString.replace("kilo", "kg");
      }
    } else {
      tempString = tempString.replace("gramm", "g");
    }
    return tempString;
  } else if (
    stringToCheck.includes("liter") ||
    stringToCheck.includes("Liter")
  ) {
    if (
      stringToCheck.includes("milliliter") ||
      stringToCheck.includes("Milliliter")
    ) {
      tempString = tempString.replace("milliliter", "ml");
    } else {
      tempString = tempString.replace("liter", "l");
    }
    return tempString;
  } else if (
    stringToCheck.includes("stück") ||
    stringToCheck.includes("Stück")
  ) {
    tempString = tempString.replace("stück", "Stk");
    return tempString;
  } else if (
    stringToCheck.includes("packung") ||
    stringToCheck.includes("Packung")
  ) {
    if (
      stringToCheck.includes("packungen") ||
      stringToCheck.includes("Packungen")
    ) {
      tempString = tempString.replace("packungen", "Pkg");
    } else {
      tempString = tempString.replace("packung", "Pkg");
    }
    return tempString;
  } else {
    return null;
  }
};
