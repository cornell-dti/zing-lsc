import React from 'react'
import { Redirect } from 'react-router'
import { DASHBOARD_PATH } from '@core/Constants'
import { RouteProps } from '@core'
import { useAuthValue } from './AuthContext'
import { RouteLoading } from './RouteLoading'

export const PublicRoute = ({ children }: RouteProps) => {
  const { authState } = useAuthValue()

  switch (authState) {
    case 'loading':
      return <RouteLoading isLoading />
    // not logged in, go to this component
    case 'unauthenticated':
      return children
    // user has logged in, should redirect to the dashboard path
    case 'authorized':
    case 'unauthorized':
      return <Redirect to={DASHBOARD_PATH} />
  }
}
