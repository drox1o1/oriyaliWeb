/** Graphite marginalia for section 05. CSS supplies the stop-motion frames. */
export function RecordSketch({ variant }: { variant: "journal" | "cycles" }) {
  return (
    <div className={`record-sketch record-sketch--${variant}`}>
      <svg viewBox="0 0 260 170" aria-hidden="true" focusable="false">
        <g className="record-sketch__paper" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          {variant === "journal" ? (
            <>
              <path d="M43 40 Q81 29 126 44 Q164 27 203 37 L207 130 Q165 119 128 138 Q85 125 46 138 Z" />
              <path opacity=".35" d="M40 43 L43 142 Q84 130 128 142 Q171 124 211 135 L206 41 M47 38 Q88 31 125 47 M129 47 L131 132" />
              <path d="M126 44 Q123 90 128 138 M57 53 Q86 46 112 53 M58 59 Q81 54 99 58" />
              {[72, 87, 102, 117].map((y) => (
                <g key={y} opacity=".6">
                  <path d={`M59 ${y} l7 -1 0 6 -7 1 Z M75 ${y + 2} q18 -3 36 0`} />
                  <path d={`M141 ${y - 8} q23 -8 47 -5`} opacity=".5" />
                </g>
              ))}
              <path className="record-sketch__marks" d="M59 74 l3 2 6 -8 M59 89 l3 2 6 -8 M59 104 l3 2 6 -8" />
              <g className="record-sketch__pencil">
                <path fill="var(--paper-deep)" d="M151 92 L180 28 Q183 23 187 27 L191 30 160 96 149 104 Z" />
                <path d="M151 92 l9 4 M155 94 l30 -65 M178 32 l10 5 M149 104 l4 -6 3 3" />
                <path opacity=".35" d="M158 88 l24 -51 M162 84 l20 -42" />
              </g>
              <path opacity=".22" d="M45 149 Q119 143 206 146 M63 153 l116 -3" />
            </>
          ) : (
            <>
              <g strokeDasharray="1 5" opacity=".65">
                <path d="M107 79 C111 120 45 132 36 90 C24 44 99 32 107 79 Z" />
                <path d="M195 75 C210 117 145 137 128 97 C109 52 178 31 195 75 Z" />
              </g>
              <g className="record-sketch__rings" stroke="var(--bloom-ink)" strokeWidth="1.8">
                <path d="M38 94 C43 117 76 122 95 105 M132 100 C145 122 175 122 190 101" />
              </g>
              <path opacity=".5" d="M63 80 q10 -8 17 -1 M68 73 l1 16 M155 74 q15 -9 13 1 l-12 14 17 -2 M106 83 q9 -5 17 -1" />
              <g className="record-sketch__iris">
                <path d="M211 148 Q209 107 218 73 M213 135 Q194 118 198 100 Q211 112 213 135 M213 120 Q231 107 235 88 Q217 99 213 120" />
                <path stroke="var(--bloom-ink)" d="M218 75 C203 64 209 46 218 44 C230 50 230 66 218 75 Z M217 75 C198 76 192 62 197 58 Q211 58 217 75 M220 75 C237 73 244 59 237 56 Q224 58 220 75 M216 77 Q204 82 205 91 Q217 89 220 77 Q227 86 234 84 Q234 75 222 73" />
                <path opacity=".35" d="M218 51 l1 17 M199 63 l11 8 M233 62 l-9 8 M202 110 l8 17 M228 103 l-10 14" />
              </g>
              <path opacity=".25" d="M34 145 Q114 140 226 151" />
            </>
          )}
        </g>
      </svg>
      {variant === "journal" ? (
        <label className="record-sketch__pause">
          <input type="checkbox" /> Pause sketches
        </label>
      ) : null}
    </div>
  );
}
