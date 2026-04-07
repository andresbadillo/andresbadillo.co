import { useMemo } from "react";
import styles from "./CodeRainHeader.module.scss";

interface CodeRainHeaderProps {
  sourceText: string;
}

export function CodeRainHeader({ sourceText }: CodeRainHeaderProps) {
  const lines = useMemo(() => {
    const words = sourceText.split(" ");
    const chunkSize = 6;
    const result: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      result.push(words.slice(i, i + chunkSize).join("_"));
    }
    return result;
  }, [sourceText]);

  return (
    <div className={styles.wrap} aria-hidden="true">
      {lines.map((line, index) => (
        <p key={line + index} className={styles.line} style={{ opacity: Math.random() * 0.5 + 0.15 }}>
          {line}
        </p>
      ))}
    </div>
  );
}
