export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((_s: string, _d: string, cb: () => void) => {
      cb();
    })
  }
};
