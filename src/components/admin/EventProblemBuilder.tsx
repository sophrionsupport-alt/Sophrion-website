"use client";

import * as React from "react";

type Problem = {
title: string;
summary: string;
};

type Props = {
value: Problem[];
onChange: (items: Problem[]) => void;
};

export default function EventProblemBuilder({ value, onChange }: Props) {

function add() {
onChange([...value, { title: "", summary: "" }]);
}

function update(i: number, key: keyof Problem, v: string) {
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
  {value.map((p, i) => (
    <div key={i} className="space-y-2 border p-3 rounded-lg">

      <input
        placeholder="Problem Title"
        value={p.title}
        onChange={(e) => update(i, "title", e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Problem Summary"
        value={p.summary}
        onChange={(e) => update(i, "summary", e.target.value)}
        className="textarea"
      />

      <button
        type="button"
        onClick={() => remove(i)}
        className="text-red-400 text-sm"
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
    + Add Problem
  </button>

</div>

);
}
