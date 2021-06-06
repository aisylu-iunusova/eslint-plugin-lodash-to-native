const map = require("../../../lib/rules/map");
const { RuleTester } = require("eslint");

const ruleTester = new RuleTester({});

ruleTester.run('Suggests using the native Array#map function instead of _.map', map, {
    valid: [
        "_ = function() {}; _.map([1, 2, 3], fn);",
        "_.map({a: 1, b: 2}, fn);",
        '[1, 2, 3].map(fn)',
        '_.filter([1, 2], fn)',
    ],

    invalid: [
        {
            code: "var a = {}; _.map(a, b);",
            errors: 1,
            output: "var a = {}; Array.isArray(a) ? a.map(b) : _.map(a, b);"
        },
        {
            code: "_.map(arr, fn);",
            errors: 1,
            output: "Array.isArray(arr) ? arr.map(fn) : _.map(arr, fn);"
        },
        {
            code: "var _ = require('lodash'); _.map([1, 2, 3], fn);",
            errors: 1,
            output: "var _ = require('lodash'); [1, 2, 3].map(fn);"
        },
    ],
});