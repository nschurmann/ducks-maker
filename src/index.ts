export function createReducer(initialState: {}, actionHandlers: {}) {
  return function reducer(state = initialState, action: any) {
    if (actionHandlers.hasOwnProperty(action.type)) {
      const newState = actionHandlers[action.type](state, action)
      if (newState !== state) {
        return newState
      }
    }
    return state
  }
}

export const reduceReducers = (...reducers: any[]) => (prevState: any, value: any, ...args: any[]) =>
  reducers.reduce(
    (newState, reducer) => reducer(newState, value, ...args),
    prevState,
  )

export function makeTypes(mod: string) {
  return (type: any, async?: boolean, sub?: boolean) => {
    const t = `${mod}/${type}`
    if (async) {
      return {
        ERROR: `${t}-error`,
        START: `${t}-start`,
        SUCCESS: `${t}-success`,
      }
    }

    if (sub) {
      return {
        ADD: `${t}-subscribe-add-entity`,
        SUBSCRIBE: `${t}-subscribe`,
        UNSUSCRIBE: `${t}-unsubscribe`,
      }
    }

    return t
  }
}

// makeActionCreator
export function mac(type: string, ...argNames: any[]) {
  return function ac(...args: any[]) {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

// asyncMakeActionCreator
export function asyncMac(types: { START: string, SUCCESS: string, ERROR: string }): any {
  return {
    error: mac(`${types.ERROR}`, 'error'),
    start: mac(`${types.START}`),
    success: mac(`${types.SUCCESS}`, 'payload'),
  }
}

export function subscribeMac(types: { SUBSCRIBE: string, UNSUBSCRIBE: string, ADD: string }) {
  return {
    add: mac(`${types.ADD}`),
    subscribe: mac(`${types.SUBSCRIBE}`),
    unsubscribe: mac(`${types.UNSUBSCRIBE}`),
  }
}