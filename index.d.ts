import { AnyAction, Reducer } from 'redux'

interface ActionError {
  type: string
  error: any
}

interface ActionStart {
  type: string
}

interface ActionSuccess<T> {
  type: string
  payload: T
}

export function createReducer(initialState: any, actionHandlers: any): Reducer

export function reduceReducers(x: Reducer[]): (prevState: any, value: any, ...args: any[]) => any

export function makeTypes(mod: string): (type: any, async?: boolean, sub?: boolean) => any

export function mac(type: string, argNames: any[]): AnyAction

export function asyncMac(types: { START: string, SUCCESS: string, ERROR: string }): {
  error: (x: any) => ActionError,
  start: () => ActionStart,
  success: <T>(x: T) => ActionSuccess<T>,
}

export function subscribeMac(types: { ADD: string, SUBSCRIBE: string, UNSUBSCRIBE: string }): {
  add: <T>(x: T) => ActionSuccess<T>,
  subscribe: () => ActionStart,
  unsubscribe: <T>(x: T) => ActionStart,
}