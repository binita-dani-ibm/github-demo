import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const { WIREMOCK_URL, WIREMOCK_TOKEN } = process.env;

// Function to delete all WireMock stubs
async function deleteAllStubs() {
  try {
    const response = await axios.delete(`${WIREMOCK_URL}/__admin/mappings`, {
      headers: {
        Authorization: `Token ${WIREMOCK_TOKEN}`,
      },
    });
    console.log("Stubs deleted:", response.data);
  } catch (error) {
    console.error("Error deleting stubs:", error);
  }
}

// Call the function to delete the stubs
deleteAllStubs();
