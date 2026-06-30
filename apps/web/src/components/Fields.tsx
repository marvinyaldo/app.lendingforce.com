import type { FieldDef, CallData } from "@lf/types";

interface FieldsProps {
  fields: FieldDef[];
  data: CallData;
  setField: (key: string, value: string) => void;
}

export function Fields({ fields, data, setField }: FieldsProps) {
  if (!fields.length) return null;
  return (
    <div className="grid">
      {fields.map((f) => {
        const key = f[0];
        const label = f[1];
        const type = f[2];
        const opts = f[3];
        const value = data[key] ?? "";
        return (
          <div key={key} className="field">
            <label htmlFor={`f-${key}`}>{label}</label>
            {type === "textarea" ? (
              <textarea
                id={`f-${key}`}
                value={value}
                onChange={(e) => setField(key, e.target.value)}
              />
            ) : type === "select" ? (
              <select
                id={`f-${key}`}
                value={value}
                onChange={(e) => setField(key, e.target.value)}
              >
                <option value="" />
                {(opts ?? "").split("|").map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`f-${key}`}
                value={value}
                onChange={(e) => setField(key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
