'use strict';
module.exports = function(context) {
	return {
	    CallExpression(node) {

			function replaceLodash() {
				return `(Array.isArray(${node.arguments[0].name})) ?
			${node.arguments[0].name}.map(${node.arguments[1].name}):
			_.map(${node.arguments[0].name}, ${node.arguments[1].name})`
			}

			let isArrayIsArrayCondExpression = false;      
			if (node.parent.type === "ConditionalExpression" && node.parent.test.callee) {
				isArrayIsArrayCondExpression = node.parent.test.callee.object.name === 'Array' && 
			    node.parent.test.callee.property.name === 'isArray' &&
			    node.parent.test.arguments[0].name === node.arguments[0].name;
			}

			let isLodashWithMap = false;
			if (node.callee && node.callee.object && node.callee.property) {
			  isLodashWithMap = node.callee.object.name === '_' &&
			    node.callee.property.name === 'map';
			}
	      
	                          
			if (isLodashWithMap && !isArrayIsArrayCondExpression) {
				context.report({
					node: node,
					message: "LODASH with MAP",
					fix: function(fixer) {
						return fixer.replaceText(node, replaceLodash());
					}
				});
			}
								
    	}
  	};
}