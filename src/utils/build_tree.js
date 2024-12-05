class Node {
	constructor(tag_name, value, attributes, id, classes) {
	  this.tag_name = tag_name;  // Name of the tag
	  this.value = value || '';   // Text content inside the tag (if any)
	  this.attributes = attributes || {}; // Object of attributes { key: value }
	  this.id = id || null;       // ID of the tag
	  this.classes = classes || []; // List of classes
	  this.children = [];         // Child nodes
	}
  }
  
  const contentTree = (stringContent) => {
	let tree = null;
	let currentParent = null;
	let tagStack = []; // To keep track of nested tags
  
	let tag_open_state = false;
	let tag_name_state = false;
	let tag_close_state = false;
  
	let tag_name = '';
	let tag_value = '';  // Variable for holding tag content (inner text)
	let tag_id = '';
	let tag_classes = [];
	let tag_attributes = {};
  
	stringContent = stringContent.trim();
  
	console.log('String content:', stringContent);
  
	for (let i = 0; i < stringContent.length; i++) {
  
	  // Tag opening
	  if (stringContent[i] === '<') {
		tag_open_state = true;
		tag_close_state = stringContent[i + 1] === '/'; // Check if it's a closing tag
		if (tag_close_state) i++; // Skip the '/'
		tag_name_state = true;
		tag_name = '';
		tag_value = '';  // Reset value when opening a tag
		console.log('Found opening tag');
	  }
  
	  // Tag closing
	  else if (stringContent[i] === '>') {
		tag_open_state = false;
		tag_name_state = false;
  
		if (tag_close_state) {
		  // Closing tag, move back up the tree
		  tagStack.pop();
		  currentParent = tagStack[tagStack.length - 1] || null;
		} else {
		  // Create a new node for the current tag with its value
		  const newNode = new Node(tag_name, tag_value, tag_attributes, tag_id, tag_classes);
		  tag_attributes = {};
		  tag_id = '';
		  tag_classes = [];
		  tag_value = '';  // Reset value after node creation
  
		  // Append to the tree
		  if (!tree) {
			tree = newNode; // First node becomes the root
		  } else if (currentParent) {
			currentParent.children.push(newNode);
		  }
  
		  // Update parent and stack
		  tagStack.push(newNode);
		  currentParent = newNode;
		}
	  }
  
	  // Handle text content
	  else if (!tag_open_state) {
		// Add text content as part of the current tag's value
		let text = '';
		while (i < stringContent.length && stringContent[i] !== '<') {
		  text += stringContent[i];
		  i++;
		}
		i--; // Rewind to the last character before '<'
  
		if (text.trim()) {
		  // Append text to the current node's value if text is not empty
		  if (currentParent) {
			currentParent.value += text.trim();
		  }
		  console.log('Found text content:', text.trim());
		}
	  }
  
	  // Process tag name and attributes
	  else if (tag_open_state) {
		if (tag_name_state) {
		  if (stringContent[i] === ' ' || stringContent[i] === '/' || stringContent[i] === '>') {
			tag_name_state = false; // End of the tag name
			console.log('Tag name found:', tag_name);  // Debugging tag name
		  } else {
			tag_name += stringContent[i];
		  }
		} else {
		  // Parse attributes
		  let attrName = '';
		  let attrValue = '';
		  let inAttrName = true;
		  let inAttrValue = false;
		  let quoteChar = '';
  
		  while (i < stringContent.length && stringContent[i] !== '>' && stringContent[i] !== '/') {
  
			if (inAttrName) {
			  if (stringContent[i] === '=') {
				inAttrName = false;
				inAttrValue = true;
				quoteChar = '';
			  } else if (stringContent[i] !== ' ') {
				attrName += stringContent[i];
			  }
			} else if (inAttrValue) {
			  if (stringContent[i] === '"' || stringContent[i] === '\'') {
				if (!quoteChar) {
				  quoteChar = stringContent[i]; // Start of quoted value
				} else if (quoteChar === stringContent[i]) {
				  // End of quoted value
				  inAttrValue = false;
				  tag_attributes[attrName] = attrValue;
				  attrName = '';
				  attrValue = '';
				  inAttrName = true;
				}
			  } else {
				attrValue += stringContent[i];
			  }
			}
			i++;
		  }
		  i--; // Rewind for the next iteration
		}
	  }
	}
  
	return tree;
  };
  
//   const htmlContent = `
//   <div id="main" class="container">
// 	<p>Hello, <span>World!</span></p>
//   </div>
//   `;
  
//   console.log(JSON.stringify(contentTree(htmlContent), null, 2));

export default contentTree;
  