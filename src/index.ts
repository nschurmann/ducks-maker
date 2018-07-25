import { ActionCreator, Reducer } from 'redux'

interface IActionError {
  type: string
  error: any
}

interface IActionStart {
  type: string
}

interface IActionSuccess<T> {
  type: string
  payload?: T
}

interface IAsyncMac {
  error: (x: any) => IActionError,
  start: () => IActionStart,
  success: <T>(x?: T) => IActionSuccess<T>,
}

interface ISubscribeMac {
  add: <T>(x: T) => IActionSuccess<T>,
  subscribe: () => IActionStart,
  unsubscribe: () => IActionStart,
}

export function createReducer(initialState: {}, actionHandlers: {}): Reducer {
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
        ADD: `${t}-add-entity`,
        SUBSCRIBE: `${t}-hooked`,
        UNSUSCRIBE: `${t}-unsubscribe`,
      }
    }

    return t
  }
}

// makeActionCreator
export function mac(type: string, ...argNames: any[]): ActionCreator<any> {
  return function ac(...args: any[]) {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

// asyncMakeActionCreator
export function asyncMac(types: { START: string, SUCCESS: string, ERROR: string }): IAsyncMac {
  return {
    error: mac(`${types.ERROR}`, 'error'),
    start: mac(`${types.START}`),
    success: mac(`${types.SUCCESS}`, 'payload'),
  }
}

export function subscribeMac(types: { SUBSCRIBE: string, UNSUBSCRIBE: string, ADD: string }): ISubscribeMac {
  return {
    add: mac(`${types.ADD}`),
    subscribe: mac(`${types.SUBSCRIBE}`, 'payload'),
    unsubscribe: mac(`${types.UNSUBSCRIBE}`),
  }
}
