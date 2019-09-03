export default async function ({tests}) {
  return {
    devDependencies: [...tests.integration ? ['http-status-codes'] : []]
  };
}
