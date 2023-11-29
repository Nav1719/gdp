import React from "react";
import "./Title.css";
export default function Title(props: any) {
  return (
    <div>
      {" "}
      <div className="s">{props.title}</div>
    </div>
  );
}
