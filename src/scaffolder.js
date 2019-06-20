export async function scaffold() {
  return {
    dependencies: [
      '@hapi/glue',
      'hapi-graceful-shutdown-plugin'
    ]
  };
}
