import React from "react";
import style from "./Display.module.css";

const Display = ({ displayValue }) => {
  return (
    <div>
      <input
        className={style.input}
        type="text"
        readOnly
        value={displayValue}
      />
    </div>
  );
};

export default Display;
