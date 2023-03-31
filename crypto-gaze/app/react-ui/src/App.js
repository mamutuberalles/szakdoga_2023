import { useState } from 'react';
import { MyApp } from "./MyApp";
function App() {
  const [inputVal, setInputVal] = useState('');
  const handleInput = (e) => {
    setInputVal(e.target.value);
  };
  return (
    <>
      <MyApp />
    </>
  );
}

export default App;
