import axios from "axios";
import { Command } from "./Command";

export async function sendCommand(command: Command) {
  try {
    const response = await axios.post(
      "http://localhost:3001/command",
      command,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error sending command:", error.message);
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error details:",
        error.response?.data,
        error.response?.status,
        error.response?.headers
      );
    }
  }
}
