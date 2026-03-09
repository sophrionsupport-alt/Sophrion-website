"use client";

import * as React from "react";

type ScheduleItem = {
day: string;
time: string;
title: string;
};

type Props = {
value: ScheduleItem[];
onChange: (items: ScheduleItem[]) => void;
};

export default function EventScheduleBuilder({ value, onChange }: Props) {
function addRow() {
onChange([...value, { day: "", time: "", title: "" }]);
}

function update(index: number, key: keyof ScheduleItem, v: string) {
const next = [...value];
next[index] = { ...next[index], [key]: v };
onChange(next);
}

function remove(index: number) {
const next = [...value];
next.splice(index, 1);
onChange(next);
}

return ( <div className="space-y-4">
{value.map((row, i) => ( <div key={i} className="grid grid-cols-4 gap-2">

```
      <input
        placeholder="Day"
        value={row.day}
        onChange={(e) => update(i, "day", e.target.value)}
        className="input"
      />

      <input
        placeholder="Time"
        value={row.time}
        onChange={(e) => update(i, "time", e.target.value)}
        className="input"
      />

      <input
        placeholder="Title"
        value={row.title}
        onChange={(e) => update(i, "title", e.target.value)}
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
    onClick={addRow}
    className="rounded-lg border px-3 py-2 text-sm"
  >
    + Add Schedule Row
  </button>
</div>

);
}
