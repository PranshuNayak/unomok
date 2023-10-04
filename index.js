//used to read line by line in a file using line break
const readline = require("readline");
//to read a file
const fs = require("fs");


/*to get a mapping of status code to their meaning. This file contains status code and their details*/ 
const jsonStatusCodes = "./status-codes.json";
const statusCodesMessage = new Map();
fs.readFile(jsonStatusCodes, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    return;
  }

  try {
    // Parse the JSON data into an array of objects
    const jsonData = JSON.parse(data);

    // Create a map from the JSON data
    jsonData.forEach((entry) => {
      statusCodesMessage.set(entry.code, entry.phrase);
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});

// Define data structures to store API endpoints, status codes, and timestamps.
const apiEndpointsMap = new Map();
const statusCodesMap = new Map();
const timestampsMap = new Map();

//file path that is to be read
const logFilePath = "./prod-api-prod-out.log";

//create a readline for a given file
const rl = readline.createInterface({
  input: fs.createReadStream(logFilePath),
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  //match the lines having information for a api endpoints
  //the method can be post,put,delete,get
  const apiEndpointMatch = line.match(/(POST|PUT|GET|DELETE) (.+?) HTTP\/1.1/);
  if (apiEndpointMatch) {
    const [, method, url] = apiEndpointMatch;
    const apiEndpoint = `${method} ${url}`;
    apiEndpointsMap.set(
      apiEndpoint,
      (apiEndpointsMap.get(apiEndpoint) || 0) + 1
    );
    
    //find the status code for that api request
    const statusCodeMatch = line.match(/HTTP\/1.1" (\d+)/);
    if (statusCodeMatch) {
      const statusCode = statusCodeMatch[1];
      statusCodesMap.set(statusCode, (statusCodesMap.get(statusCode) || 0) + 1);
    }
    
    //time stamp for that api request
    const timestampMatch = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
    if (timestampMatch) {
      const timestamp = timestampMatch[0];
      timestampsMap.set(timestamp, (timestampsMap.get(timestamp) || 0) + 1);
    }
  }
});

rl.on("close", () => {
  // Convert the API endpoints map to an array of objects for console.table
  const apiEndpointsTable = Array.from(
    apiEndpointsMap,
    ([apiEndpoint, frequency]) => ({
      Method: apiEndpoint.split(" ")[0],
      API: apiEndpoint.split(" ")[1],
      Frequency: frequency,
    })
  );

  // Convert the status codes map to an array of objects for console.table
  const statusCodesTable = Array.from(
    statusCodesMap,
    ([statusCode, frequency]) => ({
      Status: statusCode,
      Meaning: statusCodesMessage.get(statusCode), // Define your own function to get status meanings
      Frequency: frequency,
    })
  );

  // Convert the timestamps map to an array of objects for console.table
  const timestampsTable = Array.from(
    timestampsMap,
    ([timestamp, frequency]) => ({
      Timestamp: timestamp,
      Frequency: frequency,
    })
  );

  console.log("API Endpoints and Call Frequencies:");
  console.table(apiEndpointsTable);

  console.log("\nStatus Codes and Their Counts:");
  console.table(statusCodesTable);

  console.log("\nTimestamps and Their Frequencies:");
  console.table(timestampsTable);

  // Calculate the total number of unique timestamps and sum of their frequencies
  let totalUniqueTimestamps = 0;
  let sumOfTimestampFrequencies = 0;

  for (const [, frequency] of timestampsMap) {
    totalUniqueTimestamps++;
    sumOfTimestampFrequencies += frequency;
  }

  console.log("\nAPI calls being made on per minute basis:");
  console.table(sumOfTimestampFrequencies/totalUniqueTimestamps);
});
