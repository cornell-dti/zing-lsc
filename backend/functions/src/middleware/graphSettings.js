import 'dotenv/config'

const appSettings = {
  appCredentials: {
    clientId: process.env.MS_GRAPH_API_CLIENT_ID,
    tenantId: process.env.MS_GRAPH_API_TENANT_ID,
    clientSecret: process.env.MS_GRAPH_API_CLIENT_SECRET_VALUE,
  },
  authRoutes: {
    redirect: '/redirect',
    error: '/error', // the wrapper will redirect to this route in case of any error
    unauthorized: '/unauthorized', // the wrapper will redirect to this route in case of unauthorized access attempt
  },
  protectedResources: {
    graphAPI: {
      endpoint: 'https://graph.microsoft.com/v1.0/me',
      scopes: ['user.read'],
    },
    armAPI: {
      endpoint: 'https://management.azure.com/tenants?api-version=2020-01-01',
      scopes: ['https://management.azure.com/user_impersonation'],
    },
  },
}

module.exports = appSettings
