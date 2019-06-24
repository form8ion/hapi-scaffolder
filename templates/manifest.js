export default {
  server: {port: process.env.PORT, routes: {security: true}},
  register: {
    plugins: [
      {
        plugin: require('hapi-graceful-shutdown-plugin'),
        options: {
          sigtermTimeout: 10,
          sigintTimeout: 1
        }
      },
      {
        plugin: require('@hapi/good'),
        options: {
          ops: {
            interval: 1000
          },
          reporters: {
            console: [
              {
                module: require('@hapi/good-squeeze'),
                name: 'Squeeze',
                args: [{log: '*', request: '*', response: '*', error: '*'}]
              },
              {module: require('@hapi/good-console')},
              'stdout'
            ]
          }
        }
      }
    ]
  }
};
