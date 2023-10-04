# Steps to run the project
*** run these commands on the terminal ***
1. npm install
2. node index.js

# Project Working

The log file prod-api-prod-out.log contains logs of server requests. The lines like 

*** 2023-06-09 23:28 +10:00: ::ffff:103.176.11.168 - - [09/Jun/2023:13:28:08 +0000] "GET /api/member/recommended?rowsPerPage=25&page=1&keyname=company& HTTP/1.1" 304 - "-" "okhttp/4.9.1" *** is the basis of this application.

This contains these set of information
1. Server time and offset (2023-06-09 23:28 +10:00:) denoting when the request was served
2. Users ip address (::ffff:103.176.11.168)
3. Api URL and method ("GET /api/member/recommended?rowsPerPage=25&page=1&keyname=company& HTTP/1.1") Here a GET request is made on api url /api/member/recommended?rowsPerPage=25&page=1&keyname=company& using HTTP/1.1 protocol
4. Status code 304
5. I have downloaded a json file that contains the brief about a status code , like what does 200 signals for. After parsing the json file I have created a map of (status code , meaning). example (200,"OK")

I have parsed these kind of lines in the file to get the desired information. I have created three map namely apiEndpointsMap, statusCodesMap, timestampsMap, statusCodesMessage .
apiEndpointsMap has been used to count the frequency a particular api address has been called, statusCodesMap stores how many time particular status code appeared and timestamp stores how many api request were answered at a particular time. statusCodesMessage map the status code to their meaning.

using these information following can be easily calculated.
Which endpoint is called how many times
How many API calls were being made on per minute basis
How many API calls are there in total for each HTTP status code
