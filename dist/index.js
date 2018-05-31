"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createReducer(initialState, actionHandlers) {
    return function reducer(state, action) {
        if (state === void 0) { state = initialState; }
        if (actionHandlers.hasOwnProperty(action.type)) {
            var newState = actionHandlers[action.type](state, action);
            if (newState !== state) {
                return newState;
            }
        }
        return state;
    };
}
exports.createReducer = createReducer;
exports.reduceReducers = function () {
    var reducers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        reducers[_i] = arguments[_i];
    }
    return function (prevState, value) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return reducers.reduce(function (newState, reducer) { return reducer.apply(void 0, [newState, value].concat(args)); }, prevState);
    };
};
function makeTypes(mod) {
    return function (type, async) {
        var t = mod + "/" + type;
        if (async) {
            return {
                ERROR: t + "-error",
                START: t + "-start",
                SUCCESS: t + "-success",
            };
        }
        return t;
    };
}
exports.makeTypes = makeTypes;
// makeActionCreator
function mac(type) {
    var argNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argNames[_i - 1] = arguments[_i];
    }
    return function ac() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var action = { type: type };
        argNames.forEach(function (arg, index) {
            action[argNames[index]] = args[index];
        });
        return action;
    };
}
exports.mac = mac;
// asyncMakeActionCreator
function asyncMac(types) {
    return {
        error: mac("" + types.ERROR, 'error'),
        start: mac("" + types.START),
        success: mac("" + types.SUCCESS, 'payload'),
    };
}
exports.asyncMac = asyncMac;
