import axios from "axios";

export async function retryWithExponentialBackoff<T>(
  f: () => PromiseLike<T>,
  maxTries = 5,
  tryNumber = 1,
  delay = 2000
): Promise<
  {
    tries: number;
  } & (
    | {
        success: true;
        result: T;
      }
    | {
        success: false;
        error: unknown;
      }
  )
> {
  try {
    return {
      success: true,
      tries: tryNumber,
      result: await f(),
    };
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 429 || // too many requests
        error.response?.status === 502 ||
        error.response?.status === 520) && // cloudflare error
      maxTries > tryNumber
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithExponentialBackoff(f, maxTries, tryNumber + 1, delay * 2);
    }

    return {
      success: false,
      tries: tryNumber,
      error,
    };
  }
}
