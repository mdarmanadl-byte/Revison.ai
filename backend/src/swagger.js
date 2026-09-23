const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My Express API',
    description: 'Auto-generated documentation'
  },
  host: 'localhost:3000',
  // Add your specific upload route configuration here so it never gets deleted
  paths: {
    "/upload/": {
      "post": {
        "description": "Upload a file to the server",
        "consumes": [
          "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "file",
            "in": "formData",
            "description": "The file to upload",
            "required": true,
            "type": "file"
          }
        ],
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad Request" },
          "500": { "description": "Internal Server Error" }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./index.js']; 

swaggerAutogen(outputFile, routes, doc); // Make sure 'doc' is passed here
