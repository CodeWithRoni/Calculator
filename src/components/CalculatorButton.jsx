import React from "react";
import style from "./CalculatorButton.module.css";

const CalculatorButton = ({ CalculatorButtons, handleCalButton }) => {
  return (
    <div className={style.buttons}>
      {CalculatorButtons.map((button) => (
        <button
          key={button}
          onClick={() => handleCalButton(button)}
          className={style.calculatorButton}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default CalculatorButton;
