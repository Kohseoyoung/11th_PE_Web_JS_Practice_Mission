import { useState } from "react";

const MIN = 0;
const MAX = 5;

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>카운터</h1>
      <p>현재 값: {count}</p>
      <button
        onClick={() => setCount((current) => current + 1)}
        disabled={count >= MAX}
      >
        +1
      </button>
      <button
        onClick={() => setCount((current) => current - 1)}
        disabled={count <= MIN}
      >
        -1
      </button>
      <button onClick={() => setCount(0)}>초기화</button>
    </main>
  );
}