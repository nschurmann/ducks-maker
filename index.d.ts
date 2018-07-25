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

export type createReducer = (initialState: any, actionHandlers: any) => Reducer

export type reduceReducers = (Reducer[]) => (prevState: any, value: any, ...args: any[]) => any

export type makeTypes = (mod: string) => (type: any, async?: boolean, sub?: boolean) => any

export type mac = (type: string, argNames: any[]) => AnyAction

export type asyncMac = (types: { START: string, SUCCESS: string, ERROR: string }) => {
  error: (x: any) => ActionError,
  start: () => ActionStart,
  success: <T>(x: T) => ActionSuccess<T>,
}

export type subscribeMac = (types: { ADD: string, SUBSCRIBE: string, UNSUBSCRIBE: string }) => {
  add: <T>(x: T) => ActionSuccess<T>,
  subscribe: () => ActionStart,
  unsubscribe: <T>(x: T) => ActionStart,
}