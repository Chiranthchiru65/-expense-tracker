import { useCounterStore } from "./store/CounterStore";
function App() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <h1 className="text-3xl font-bold underline">Counter:{count}</h1>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>
    </>
  );
}

export default App;
