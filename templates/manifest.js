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
      }
    ]
  }
};
