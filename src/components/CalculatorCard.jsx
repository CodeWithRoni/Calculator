import React, { useState } from "react";
import style from "./CalculatorCard.module.css";
import Display from "./Display";
import CalculatorButton from "./CalculatorButton";

const CalculatorCard = () => {
  let CalculatorButtons = [
    "AC",
    "DEL",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    "00",
    ".",
    "=",
  ];
  const [displayValue, setDisplayValue] = useState("0");

  const handleCalButton = (button) => {
    if (button === "AC") {
      setDisplayValue("0");
    } else if (button === "DEL") {
      setDisplayValue(displayValue.slice(0, -1));
    } else if (button === "=") {
      setDisplayValue(eval(displayValue));
    } else if (displayValue === "0") {
      setDisplayValue(button);
    } else {
      setDisplayValue(displayValue + button);
    }
  };
  return (
    <div className={style.calculatorCard}>
      <Display displayValue={displayValue} />
      <CalculatorButton
        CalculatorButtons={CalculatorButtons}
        handleCalButton={handleCalButton}
      />
    </div>
  );
};

export default CalculatorCard;
