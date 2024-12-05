import "../styles/GraphComp.css";
import Tree from "react-d3-tree";
import contentTree from "../utils/build_tree";
import cleanRawCode from "../utils/clean_code";
import { compareTrees } from "../utils/compare_trees";
import React from "react";

// Function to determine node colors dynamically
function getNodeColor(nodeDatum) {
	switch (nodeDatum.changeType) {
		case "added":
			return "#6FCF97"; // Color for added nodes
		case "deleted":
			return "#EB5757"; // Color for deleted nodes
		case "modified":
			return "#F2C94C"; // Color for modified nodes
		default:
			return "#BDBDBD"; // Default color for unchanged nodes
	}
}


const stepsData = [
	"Construct the Virtual DOM Tree: React first builds a virtual representation of the UI in memory, known as the Virtual DOM. This tree structure mirrors the intended state of the UI but is independent of the actual DOM.",
	"Identify Changes with the Diffing Algorithm: React compares the new Virtual DOM tree with the previous one to detect differences. This process, known as 'diffing,' identifies what parts of the UI have changed and need to be updated.",
	"Efficiently Update the DOM: React updates only the necessary parts of the real DOM based on the identified changes, ensuring minimal manipulation. This step synchronizes the real DOM with the latest Virtual DOM state."
];



function convertToD3Format(node) {
	if (!node) return null;

	const { tag_name, value, attributes, id, classes, children } = node;

	return {
		name: tag_name,
		attributes: {
			...attributes,
			value: value || null,
			id: id || null,
			classes: classes?.join(" ") || null
		},
		children: children?.map(convertToD3Format) || []
	};
}

function VisualComp({ contentWidth, code, prevCode, updateSave, isRunning, terminateRunning }) {

	const [position, setPosition] = React.useState({ x: 50, y: 400 });
	const [isDragging, setIsDragging] = React.useState(false);
	const [currentStep, setCurrentStep] = React.useState(1);
	const [buttonData, setButtonData] = React.useState("Continue");

	const handleMouseDown = (e) => {
		setIsDragging(true);
		e.target.style.cursor = "grabbing";
	}

	const handleMouseMove = (e) => {
		if (isDragging) {
			setPosition((prev) => ({
				x: prev.x + e.movementX,
				y: prev.y + e.movementY,
			}));
		}
	}

	const handleMouseUp = (event) => {
		setIsDragging(false);
		event.target.style.cursor = "grab";
	};

	const handleMouseLeave = () => setIsDragging(false);

	const initialPosition = { x: 400, y: 200 };
	const nodeSize = { x: 100, y: 100 };

	// Step 1: Clean the raw code
	const oldData = cleanRawCode(prevCode);
	const newData = cleanRawCode(code);

	// Generate content trees
	const oldTree = contentTree(oldData);
	const newTree = contentTree(newData);

	// Convert to D3-compatible format and reconcile
	const oldTreeData = convertToD3Format(oldTree);
	const newTreeData = convertToD3Format(newTree);
	const reconciledTree = compareTrees(oldTreeData, newTreeData);

	if (!reconciledTree) {
		return <div>Error: Tree data is invalid</div>;
	}

	if (!oldTreeData) {
		return <div>Error: Tree data is invalid</div>;
	}

	const handleInfoUpdate = () => {
		setCurrentStep((prevStep) => {
			const nextStep = prevStep + 1;
	
			if (nextStep === 3) {
				updateSave();
				setButtonData("Finish");
			} else if (nextStep === 4) {
				terminateRunning();
				setButtonData("Continue");
				return 1;
			}else{
				setButtonData("Continue");
			}
	
			return nextStep;
		});
	};
	

	return (
		<div className="graph-container" style={{ width: `${contentWidth}%` }}>
			<Tree
				data={currentStep === 1 ? newTreeData : reconciledTree}
				orientation="vertical"
				renderCustomNodeElement={({ nodeDatum }) => (
					<g>
						<circle r="15" fill={getNodeColor(nodeDatum)} />

						<text
							fill="black"
							x="25"
							y="5"
							fontSize={16}
							font-family="Times New Roman"
							letter-spacing="2"
						>
							{nodeDatum.name}
						</text>
					</g>
				)}
				translate={initialPosition}
				nodeSize={nodeSize}
			/>


			{/* Virtual DOM Tree */}
			<div className="virtual-dom">
				<span>Virtual DOM</span>
				<div>
					<Tree
						data={oldTreeData}
						orientation="vertical"
						renderCustomNodeElement={({ nodeDatum }) => (
							<g>
								<circle r="15" fill={getNodeColor(nodeDatum)} />

							</g>
						)}
						translate={{ x: 100, y: 10 }}
						zoom={0.4}
					/>
				</div>
			</div>

			{/* Real DOM Tree */}
			<div className="real-dom">
				<span>Real DOM</span>
				<div>
					<Tree
						data={oldTreeData}
						orientation="vertical"
						renderCustomNodeElement={({ nodeDatum }) => (
							<g>
								<circle r="15" fill={getNodeColor(nodeDatum)} />

							</g>
						)}
						translate={{ x: 100, y: 10 }}
						zoom={0.4}
					/>
				</div>
			</div>


			<div className="symbols">

				<div className="symbol">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="5" fill="#6FCF97" stroke="black" stroke-width="1" />
					</svg>
					<span>Added</span>
				</div>
				<div className="symbol">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="5" fill="#EB5757" stroke="black" stroke-width="1" />
					</svg>
					<span>Deleted</span>
				</div>
				<div className="symbol">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="5" fill="#F2C94C" stroke="black" stroke-width="1" />
					</svg>
					<span>Modified</span>
				</div>
				<div className="symbol">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="5" fill="#BDBDBD" stroke="black" stroke-width="1" />
					</svg>
					<span>No change</span>
				</div>
			</div>


			{
				isRunning && (
					<div
						className="info-div"
						style={{
							position: "absolute",
							left: `${position.x}px`,
							top: `${position.y}px`,
							cursor: "grab",
						}}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onMouseMove={handleMouseMove}
						onMouseLeave={handleMouseLeave}
					>
						<span>
							{stepsData[currentStep - 1]}
						</span>
						<br />

						<button onClick={handleInfoUpdate}>
							{buttonData}
						</button>
					</div>
				)
			}
		</div>
	);
}

export default VisualComp;
