import axios from 'axios';
import config from '../../config';
// Function to delete all WireMock stubs
async function deleteAllStubs() {
  try {
    const response = await axios.delete(`${config.WIREMOCK_API_URL}/__admin/mappings`,{
        headers: {
            Authorization: `Token ${config.WIREMOCK_API_TOKEN}`,
        },
    });
    console.log('Stubs deleted:', response.data);
  } catch (error) {
    console.error('Error deleting stubs:', error);
  }
}

// Call the function to delete the stubs
deleteAllStubs();