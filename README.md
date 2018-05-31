# ducks-maker
Yet another way to implement ducks in your redux app.

Every time I add actions, types and reducers, they keep doing almost everytime the same thing, using redux ducks helped me to stay organized and this library helped me to keep my ducks short.

## Every day
Every day I find myself building reducers like this:

```javascript
import { get } from 'axios'

const FETCH_START = 'my-module/fetch-start'
const FETCH_SUCCESS = 'my-module/fetch-success'
const FETCH_ERROR = 'my-module/fetch-error'

const initialState = {
  data: {}, // entities goes here
  fetched: false,
  fetching: false,
}

export default reducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_START: {
      return {
        ...state,
        fetching: true,
      }
    }
    case: FETCH_SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }
    case: FETCH_ERROR: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      }
    }
  }
}

const startFetch = () => ({
  type: FETCH_START,
})

const successFetch = payload => ({
  type: FETCH_SUCCESS,
  payload,
})

const errorFetch = error => ({
  type: FETCH_ERROR,
  error,
})

export fetch = () =>
  async (dispatch, getState) => {
    dispatch(startFetch())
    try {
      const { data } = await get('/users')
      dispatch(successFetch(data))
    } catch(e) {
      dispatch(errorFetch(e))
    }
  }
```

It's a 60 line duck!, this library tries to diminish the effort of creating ducks like this.

## Create action types
The first step is reduce the boilerplate creating actions, it's included a utility just for that:

```javascript
const FETCH_START = 'my-module/fetch-start'
const FETCH_SUCCESS = 'my-module/fetch-success'
const FETCH_ERROR = 'my-module/fetch-error'
```
changes to:
```javascript
const t = makeTypes('my-module')
const FETCH_START = t('fetch-start')
const FETCH_SUCCESS = t('fetch-success')
const FETCH_ERROR = t('fetch-error')
```

At first is not a big deal, but when you start to have a lot of actions this wiss help, specially for async types. `makeTypes` will return a function that will let you create actions, will hold the value of the module and concatenate it with the action that you will pass later to the function `t` (shorthand for type)

## Create async types
The second step will let us create three action types at once, this are meant to be used for async operations concerning fetching APIs Rest or GraphQL.
```javascript
const FETCH_START = 'my-module/fetch-start'
const FETCH_SUCCESS = 'my-module/fetch-success'
const FETCH_ERROR = 'my-module/fetch-error'
```
changes to:
```javascript
import { makeTypes } from 'ducks-for-redux'

const t = makeTypes('my-module')
const FETCH = t('fetch', true)
```

Fetch is an object that hold three keys: START, SUCCESS and ERROR. This keys will hold the value of the types:
```javascript
FETCH.START === 'my-module/fetch-start'
FETCH.SUCCESS === 'my-module/fetch-success'
FETCH.ERROR === 'my-module/fetch-error'
```

## action creators
It's included a utility that helps building action creators, called `mac` (short for makeActionCreator) this is explained in the documentation of redux `reducing boilerplate`

```javascript
import { makeTypes } from 'ducks-maker'

const action1 = mac('my-action-1')
action1()
// {
//   type: 'my-action-1',
// }

const action2 = mac('my-action-2', 'payload')
action2(1)
// {
//   payload: 1,
//   type: 'my-action-2',
// }

const action3 = mac('my-action-3', 'error')
action3(1)
// {
//   error: 1,
//   type: 'my-action-3',
// }
```

With this utility we can re-write our action creators like this:
```javascript
const startFetch = mac(FETCH.START)
const successFetch = mac(FETCH.SUCCESS, 'payload')
const errorFetch = mac(FETCH.ERROR, 'error')
```

So far so good, our duck looks like this now:

```javascript
import { makeTypes, mac } from 'ducks-maker'
import { get } from 'axios'

const t = makeTypes('my-module')
const FETCH = t('fetch', true)

const initialState = {
  data: {}, // entities goes here
  fetched: false,
  fetching: false,
}

export default reducer(state = initialState, action) {
  switch(action.type) {
    case FETCH.START: {
      return {
        ...state,
        fetching: true,
      }
    }
    case: FETCH.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }
    case: FETCH.ERROR: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      }
    }
  }
}

const startFetch = mac(FETCH.START)
const successFetch = mac(FETCH.SUCCESS, 'payload')
const errorFetch = mac(FETCH.ERROR, 'error')

export fetch = () =>
  async (dispatch, getState) => {
    dispatch(startFetch())
    try {
      const { data } = await get('/users')
      dispatch(successFetch(data))
    } catch(e) {
      dispatch(errorFetch(e))
    }
  }
```

## async action creators

We can still improve even further with the introduction of async action creators or `asyncMac` for short:

```javascript
import { makeTypes, asyncMac } from 'ducks-maker'

const t = makeTypes('my-module')
const FETCH = t('fetch', true) // this holds START, SUCCESS and ERROR

const fetch = asyncMac(FETCH)

fetch.start()
// {
//   type: 'my-module/fetch-start',
// }

fetch.success(1)
// {
//   payload: 1,
//   type: 'my-module/fetch-success',
// }

fetch.error(1)
// {
//   error: 1,
//   type: 'my-module/fetch-error',
// }
```

so now our reducer looks like this:

```javascript
import { makeTypes, mac, asyncMac } from 'ducks-maker'
import { get } from 'axios'

const t = makeTypes('my-module')
const FETCH = t('fetch', true)

const initialState = {
  data: {}, // entities goes here
  fetched: false,
  fetching: false,
}

export default reducer(state = initialState, action) {
  switch(action.type) {
    case FETCH.START: {
      return {
        ...state,
        fetching: true,
      }
    }
    case: FETCH.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }
    case: FETCH.ERROR: {
      return {
        ...state,
        fetching: false,
        error: action.error,
      }
    }
  }
}

const fetch = mac(FETCH)

export fetch = () =>
  async (dispatch, getState) => {
    dispatch(fetch.start()) // change here
    try {
      const { data } = await get('/users')
      dispatch(fetch.success(data)) // change here
    } catch(e) {
      dispatch(fetch.error(e)) // change here
    }
  }
```

We reduced our code from 60 to 49 lines of code, that's an improvement of almost 20%, but we can still improve this even further!

## High order reducers
HORs are just functions that let you create reducers, this in combination with createReducer (also included in this package) creates a marvellous combo.

First, create a HOR
```javascript
// hors.js

export const createFetch = ({ START, SUCCESS, ERROR }) => ({
  [START]: state => ({ ...state, fetching: true }),
  [SUCCESS]: (state, { payload }) => ({
    ...state,
    data: payload,
    fetched: true,
    fetching: false,
  }),
  [ERROR]: (state, { error }) => ({
    ...state,
    error,
    fetching: false,
  })
})
```

now import it in your duck and pass it to createReducer:

```javascript
// yourduck.js

import { makeTypes, mac, asyncMac, createReducer } from 'ducks-maker'
import { get } from 'axios'
import { createFetch } from './hors'

const t = makeTypes('my-module')
const FETCH = t('fetch', true)

const initialState = {
  data: {}, // entities goes here
  fetched: false,
  fetching: false,
}

const reducer = createFetch(FETCH)

export default createReducer(initialState, reducer)

const fetch = mac(FETCH)

export fetch = () =>
  async (dispatch, getState) => {
    dispatch(fetch.start()) // change here
    try {
      const { data } = await get('/users')
      dispatch(fetch.success(data)) // change here
    } catch(e) {
      dispatch(fetch.error(e)) // change here
    }
  }
```

Now our duck is 28 lines of code, that's an improvement of almost **54%!** (you have to consider to structure the shape of your reducers the same for almost all of them)

This lib also includes `reduceReducers` so you can compose all your `hors`