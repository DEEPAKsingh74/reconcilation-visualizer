import CodeComp from "./components/CodeComp";
import VisualComp from "./components/GraphComp";
import "./styles/App.css";
import React from "react";
import starterCode from "./utils/starter_code";

function App() {

  const [contentViewWidth, setContentViewWidth] = React.useState(50);
  const [code, setCode] = React.useState(starterCode);
  const [prevCode, setPrevCode] = React.useState(starterCode);
  const [isRunning, setIsRunning] = React.useState(false);

  const handleCodeFromChild = (codeChanged) => {
    setPrevCode(code);
    setCode(codeChanged);
    setIsRunning(true);
  }

  const handleUpdateSave = () => {
    setPrevCode(code);
  }

  const terminateRunning = () => {
    setIsRunning(false);
  }

  return (
    <div className="app-container">

      <CodeComp contentWidth={contentViewWidth} updateCode={handleCodeFromChild} />

      <VisualComp contentWidth={100 - contentViewWidth} code={code} prevCode={prevCode} updateSave={handleUpdateSave} isRunning={isRunning} terminateRunning={terminateRunning}/>

    </div>
  );
}

export default App;
