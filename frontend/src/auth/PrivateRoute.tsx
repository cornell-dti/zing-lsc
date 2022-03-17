import React from 'react'
import { Redirect, Route } from 'react-router'

import { HOME_PATH } from '@core/Constants'
import { useAuthValue } from './AuthContext'
import {
  RouteComponentProps,
  RouteProps as DefaultRouteProps,
} from 'react-router'

interface RouteProps extends DefaultRouteProps {
  component: React.ComponentType<RouteComponentProps>
}

export const PrivateRoute = ({
  component: Component,
  ...routeProps
}: RouteProps) => {
  const user = useAuthValue()

  return (
    <Route
      {...routeProps}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to={HOME_PATH} />
      }
    />
  )
}
