const cleanRawCode = (rawCode) => {

	console.log("Raw Code:", rawCode); // Log for debugging
	
	let startIndex = rawCode.indexOf("<");
	let endIndex = rawCode.lastIndexOf(">");

	console.log("Start Index:", startIndex); // Log for debugging
	console.log("End Index:", endIndex); // Log for debugging
	
	if (startIndex === -1 || endIndex === -1) return ""; // Invalid indices

	let html = rawCode.slice(startIndex, endIndex).trim();

	html.replace(/[\n\t]/g, '');

	console.log("Cleaned HTML Content:", html); // Log for debugging

	return html;
};

export default cleanRawCode;