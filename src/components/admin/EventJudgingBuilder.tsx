"use client";

import * as React from "react";

type Judging = {
criterion: string;
weight: string;
};

type Props = {
value: Judging[];
onChange: (items: Judging[]) => void;
};

export default function EventJudgingBuilder({ value, onChange }: Props) {

function add() {
onChange([...value, { criterion: "", weight: "" }]);
}

function update(i: number, key: keyof Judging, v: string) {
const next = [...value];
next[i] = { ...next[i], [key]: v };
onChange(next);
}

function remove(i: number) {
const next = [...value];
next.splice(i, 1);
onChange(next);
}

return ( <div className="space-y-4">

```
  {value.map((j, i) => (
    <div key={i} className="grid grid-cols-3 gap-2">

      <input
        placeholder="Criterion"
        value={j.criterion}
        onChange={(e) => update(i, "criterion", e.target.value)}
        className="input"
      />

      <input
        placeholder="Weight"
        value={j.weight}
        onChange={(e) => update(i, "weight", e.target.value)}
        className="input"
      />

      <button
        type="button"
        onClick={() => remove(i)}
        className="text-red-400"
      >
        Remove
      </button>

    </div>
  ))}

  <button
    type="button"
    onClick={add}
    className="rounded-lg border px-3 py-2 text-sm"
  >
    + Add Criterion
  </button>

</div>

);
}
