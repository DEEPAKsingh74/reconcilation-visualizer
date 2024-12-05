function compareTrees(oldNode, newNode) {
	if (!oldNode) {
		// Node added
		return { ...newNode, changeType: "added" };
	}
	if (!newNode) {
		// Node deleted
		return { ...oldNode, changeType: "deleted" };
	}

	// Node exists in both; check for modifications
	const isModified =
		oldNode.name !== newNode.name ||
		JSON.stringify(oldNode.attributes) !== JSON.stringify(newNode.attributes);

	return {
		...newNode,
		changeType: isModified ? "modified" : "unchanged",
		children: reconcileChildren(oldNode.children, newNode.children),
	};
}

function reconcileChildren(oldChildren = [], newChildren = []) {
	const maxLength = Math.max(oldChildren.length, newChildren.length);
	const result = [];

	for (let i = 0; i < maxLength; i++) {
		result.push(compareTrees(oldChildren[i], newChildren[i]));
	}

	return result;
}


//exporting the functions
export { compareTrees, reconcileChildren };