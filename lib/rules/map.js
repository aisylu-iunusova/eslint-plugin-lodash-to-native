// Проверка на наличие "_.map"
const isMemberExpression = (node) => {
    return node.callee.type === 'MemberExpression'
};

// Проверка на наличие "_"
const isLodash = (node) => {
    return isMemberExpression(node) && node.callee.object && node.callee.object.name === '_';
};

// Проверка на наличие "map"
const isMap = (node) => {
    return isMemberExpression(node) && node.callee.property && node.callee.property.name === 'map';
};

// Проверка является ли первый параметр массивом
const isFirstArgArray = (node) => {
    return node.arguments && Array.isArray(node.arguments) && node.arguments.length > 0 && node.arguments[0].type === 'ArrayExpression';
};

// Проверка является ли первый параметр объектом
const isFirstArgObject = (node) => {
    return node.arguments && node.arguments[0].type === 'ObjectExpression';
};

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Suggests using the native Array#map function instead of _.map",
            category: "Code improvements"
        },
        fixable: "code",
        schema: []
    },
    create: function (context) {
        let assignExpression = true;

        return {
            // проверяем переопределен или нет переменная "_"
            AssignmentExpression(node) {
                if (node.left.name === "_") {
                    assignExpression = false;
                }
            },

            CallExpression(node) {
                const arr = isLodash(node) && isMap(node) && !isFirstArgObject(node);

                if (!arr || !assignExpression) {
                    return;
                };

                // первый аргумент метода "map"
                const firstArgMap = context.getSourceCode().getText(node.arguments[0]);
                // второй аргумент метода "map"
                const secondArgMap = context.getSourceCode().getText(node.arguments[1]);
                // исходный код
                const sourceCode = context.getSourceCode().getText(node);

                if (node.parent.type === 'ConditionalExpression' && context.getSource(node.parent.alternate) === sourceCode) {
                    return;
                }

                context.report({
                    node,
                    message: "Используйте нативную функцию Array#map вместо _.map",
                    fix: function (fix) {
                        if (isFirstArgArray(node)) {
                            return fix.replaceText(node, `${firstArgMap}.map(${secondArgMap})`);
                        }

                        return fix.replaceText(node, `Array.isArray(${firstArgMap}) ? ${firstArgMap}.map(${secondArgMap}) : ${sourceCode}`);
                    }
                })
            },
        }
    }
}