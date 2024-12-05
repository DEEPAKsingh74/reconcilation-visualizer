import "../styles/CodeComp.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import React from "react";
import starterCode from "../utils/starter_code";
import { CiPlay1 } from "react-icons/ci";
import { BsBrowserChrome } from "react-icons/bs";
import { IoMdInformationCircleOutline } from "react-icons/io";
import cleanRawCode from "../utils/clean_code";

const showInBrowser = (htmlContent) => {
	// Create a new window
	const newWindow = window.open("", "_blank", "width=800,height=600");

	if (newWindow) {
		// Write the HTML content into the new window

		newWindow.document.open();
		newWindow.document.write(htmlContent);
		newWindow.document.close();
	} else {
		alert("Failed to open a new window. Please allow pop-ups.");
	}
};

function CodeComp({ contentWidth, updateCode }) {

	const [value, setValue] = React.useState(starterCode);
	const onChange = React.useCallback((val, viewUpdate) => {
		setValue(val);
	}, []);

	const handleCodeSave = () => {
		updateCode(value);
	}

	const handleShowInBrowser = () => {

		const htmlContent = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Preview</title>
			</head>
			<body>
					${cleanRawCode(value)}
			</body>
			</html>
		`;
		showInBrowser(htmlContent);
	}



	return (
		<div className="code-container" style={{ width: `${contentWidth}%`, height: "100vh" }}>

			<div className="code-options">

				<div className="file-name">App.js</div>

				<div style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "1.3rem",
					color: "white",
					fontFamily: "sans-serif",
					marginRight: "10px"
				}}>
					Reconcilation Visualizer
				</div>

				<div>
					<button className="save-btn" onClick={handleCodeSave} title="save & run"><CiPlay1 /></button>
					<button className="save-btn" title="show in browser" onClick={handleShowInBrowser}><BsBrowserChrome /></button>
				</div>

			</div>

			<CodeMirror
				value={value}
				height="100vh"
				theme="dark"
				extensions={[javascript({ jsx: true })]}
				onChange={onChange}
				spellCheck={false}
				autoCorrect="off"
				autoCapitalize="off"
			/>
		</div>
	);
}

export default CodeComp;
