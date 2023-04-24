export const property =
  (environmentKey: string) => async (): Promise<string> => {
    const value = process.env[environmentKey];

    if (!value) {
      throw new Error(`Environment property "${environmentKey}" is not set`);
    }

    return value;
  };
