import { asyncMac, createReducer, mac, makeTypes, reduceReducers } from './index'

describe('redux ducks', () => {
  it('creates a reducer', () => {
    const reducer = createReducer({a: 1}, {
      'my-action': (state, action) => ({
        ...state,
        b: action.payload,
      }),
    })

    const state = reducer(undefined, { type: 'my-action', payload: 2 })
    expect(state).toEqual({
      a: 1,
      b: 2,
    })
  })

  it('reduce reducers', () => {
    const reducer1 = createReducer({}, {
      'my-action': (state, action) => ({
        ...state,
        a: action.payload,
      }),
    })

    const reducer2 = createReducer({}, {
      'my-action-2': (state, action) => ({
        ...state,
        b: action.payload,
      }),
    })

    const reduced = reduceReducers(reducer1, reducer2)

    const state = reduced({a: 1, b: 2}, { type: 'my-action-2', payload: 3 })
    expect(state).toEqual({
      a: 1,
      b: 3,
    })
  })

  it('makes a type', () => {
    const t = makeTypes('users')
    const type = t('action-type').single()
    expect(type).toBe('users/action-type')
  })

  it('make async type', () => {
    const t = makeTypes('users')
    const type = t('async-type').async()
    expect(type).toEqual({
      ERROR: 'users/async-type-error',
      START: 'users/async-type-start',
      SUCCESS: 'users/async-type-success',
    })
  })

  it('creates a simple action', () => {
    const action = mac('my-action', 'payload')
    expect(action(1)).toEqual({
      payload: 1,
      type: 'my-action',
    })
  })

  it('creates an async action', () => {
    const t = makeTypes('users')
    const types: any = t('async-type').async()
    const actions = asyncMac(types)
    const { start, error, success } = actions
    expect(start()).toEqual({
      type: 'users/async-type-start',
    })
    expect(success(['user1'])).toEqual({
      payload: ['user1'],
      type: 'users/async-type-success',
    })
    expect(error('some error')).toEqual({
      error: 'some error',
      type: 'users/async-type-error',
    })
  })
})
