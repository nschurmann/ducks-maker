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

interface IAsyncTypes {
  ERROR: string
  START: string
  SUCCESS: string
}

interface ISubscribeTypes {
  ADD: string
  SUBSCRIBE: string
  UNSUBSCRIBE: string
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

interface ITyper {
  async: () => IAsyncTypes
  single: () => string
  subscribe: () => ISubscribeTypes
}
export function makeTypes(mod: string): ((x: string) => ITyper) {
  return (type: string) => {
    const t = `${mod}/${type}`
    return {
      async: () => ({
        ERROR: `${t}-error`,
        START: `${t}-start`,
        SUCCESS: `${t}-success`,
      }),
      single: () => t,
      subscribe: () => ({
        ADD: `${t}-add-entity`,
        SUBSCRIBE: `${t}-hooked`,
        UNSUBSCRIBE: `${t}-unsubscribe`,
      }),
    }
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
export function asyncMac(types: IAsyncTypes): IAsyncMac {
  return {
    error: mac(`${types.ERROR}`, 'error'),
    start: mac(`${types.START}`),
    success: mac(`${types.SUCCESS}`, 'payload'),
  }
}

// subscribe
export function subscribeMac(types: ISubscribeTypes): ISubscribeMac {
  return {
    add: mac(`${types.ADD}`, 'payload'),
    subscribe: mac(`${types.SUBSCRIBE}`),
    unsubscribe: mac(`${types.UNSUBSCRIBE}`),
  }
}
