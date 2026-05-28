import React from "react";

interface LegalContentProps {
  content: string;
}

export function LegalContent({ content }: LegalContentProps) {
  // Parse the content and convert to structured HTML
  const parseContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let currentTable: { headers: string[]; rows: string[][] } | null = null;
    let inTable = false;
    let paragraphBuffer: string[] = [];

    const flushParagraph = () => {
      if (paragraphBuffer.length > 0) {
        const text = paragraphBuffer.join(" ").trim();
        if (text) {
          elements.push(
            <p key={elements.length} className="mb-3">
              {text}
            </p>
          );
        }
        paragraphBuffer = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={elements.length} className="mb-4 ml-6 list-disc space-y-1 pl-2">
            {currentList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushTable = () => {
      if (currentTable && currentTable.headers.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  {currentTable.headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 text-left text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTable.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-zinc-800">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-2 text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTable = null;
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Empty line
      if (!line) {
        flushParagraph();
        continue;
      }

      // Check for table separator (——)
      if (line.includes("——") || line.match(/^[-—]+$/)) {
        inTable = true;
        continue;
      }

      // Check for table header or row (contains |)
      if (line.includes("|") && !line.startsWith("•")) {
        flushParagraph();
        flushList();

        const parts = line.split("|").map((p) => p.trim());

        if (!currentTable) {
          // This is the header
          currentTable = { headers: parts, rows: [] };
        } else {
          // This is a row
          currentTable.rows.push(parts);
        }
        continue;
      }

      // After table separator, if next line doesn't have |, flush table
      if (inTable && !line.includes("|")) {
        flushTable();
      }

      // Check for bullet point (•)
      if (line.startsWith("•")) {
        flushParagraph();
        flushTable();
        currentList.push(line.substring(1).trim());
        continue;
      }

      // Check for section headers (a), b), etc.)
      if (line.match(/^[a-e]\)/)) {
        flushParagraph();
        flushList();
        flushTable();
        elements.push(
          <h3 key={elements.length} className="mb-2 mt-4 font-semibold">
            {line}
          </h3>
        );
        continue;
      }

      // Regular paragraph line
      flushList();
      flushTable();
      paragraphBuffer.push(line);
    }

    // Flush any remaining content
    flushParagraph();
    flushList();
    flushTable();

    return elements;
  };

  return <div className="space-y-2">{parseContent(content)}</div>;
}
