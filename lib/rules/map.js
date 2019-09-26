'use strict';
module.exports = function(context) {
  	let isLodashReassigned = false;
	return {
		AssignmentExpression(node) {
			if (node.left.name === '_') {
				isLodashReassigned = true;
			}
		},
	    CallExpression(node) {
	    	let IsCondExpressionToCheckArray = checkIsCondExpressionToCheckArray();
	    	let isLodashWithMap = checkIsLodashWithMap();


	    	if (!isLodashReassigned &&
				isLodashWithMap &&
				!IsCondExpressionToCheckArray) {
				context.report({
					node: node,
					message: "LODASH with MAP",
					fix: function(fixer) {
                      	if (node.arguments.length === 2 && node.arguments[0].type !== 'ObjectExpression') {
							return fixer.replaceText(node, replaceLodash());
                        }
					}
				});
			}


	    	function getArrayArgs() {
	    		let arrVals = [];
            	node.arguments[0].elements.forEach(el => {
                	arrVals.push(el.value);
                });
                return arrVals;
	    	}

			function replaceLodash() {
              	let str = ``;
              
              	if (node.arguments[0].type === 'ArrayExpression') {
                	let arrayArgs = getArrayArgs();
              		str = `[${arrayArgs}].map(${node.arguments[1].name})`;
              	} else {
                      str = `(Array.isArray(${node.arguments[0].name})) ?
          ${node.arguments[0].name}.map(${node.arguments[1].name}):
          _.map(${node.arguments[0].name}, ${node.arguments[1].name})`
              	}

              	return str;
			}

			function checkIsCondExpressionToCheckArray() {
				if (node.parent.type === "ConditionalExpression" &&	node.parent.test.callee && node.parent.test.callee.object) {
					return node.parent.test.callee.object.name === 'Array' && 
				    node.parent.test.callee.property.name === 'isArray' &&
				    node.parent.test.arguments[0].name === node.arguments[0].name;
				} else {
					return false;
				}
			}
			
			function checkIsLodashWithMap() {
				if (node.callee && node.callee.object && node.callee.property) {
				  	return node.callee.object.name === '_' &&
				    node.callee.property.name === 'map';
				} else {
					return false;
				}
			}
			
    	}
  	};
};
