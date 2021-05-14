import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import pricesReducer from './prices'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'
import purchaseReducer from './purchase'

const store =  configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    toasts: toastsReducer,
    purchase: purchaseReducer,
    pools: poolsReducer,
    profile: profileReducer,
    prices: pricesReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
  },
})

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()


export default store