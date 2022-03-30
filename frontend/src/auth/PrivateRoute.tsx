import React from 'react'
import { Redirect, Route } from 'react-router'

import { HOME_PATH } from '@core/Constants'
import { useAuthValue } from './AuthContext'
import { RouteProps } from '@core'
import { RouteLoading } from './RouteLoading'

export const PrivateRoute = ({
  component: Component,
  ...routeProps
}: RouteProps) => {
  const { user, isLoading } = useAuthValue()
  if (isLoading) return <RouteLoading isLoading />

  // putting this here because auth token will always be needed for Private Routes
  // axios.interceptors.request.use(
  //   (request) => {
  //     request.headers.authtoken = token
  //     return request
  //   },
  //   (error) => {
  //     return Promise.reject(error)
  //   }
  // )

  return (
    <Route
      {...routeProps}
      render={(props) => {
        return user ? <Component {...props} /> : <Redirect to={HOME_PATH} />
      }}
    />
  )
}
