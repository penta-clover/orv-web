import React from "react";

interface NL2BRProps {
  children: string;
}

export function NL2BR({ children }: NL2BRProps) {
  const lines = children.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}