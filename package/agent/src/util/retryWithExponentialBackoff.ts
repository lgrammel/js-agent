import axios from "axios";

export async function retryWithExponentialBackoff(
  requestFn: () => Promise<any>,
  retries = 5,
  delay = 2000
): Promise<any> {
  try {
    return await requestFn();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      if (retries > 0) {
        console.log("Retry 429");
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retryWithExponentialBackoff(requestFn, retries - 1, delay * 2);
      } else {
        throw new Error("Exceeded maximum retries");
      }
    } else {
      throw error;
    }
  }
}
