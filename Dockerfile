# Use official Node runtime
#FROM node:9

# Use GCP node runtime
FROM gcr.io/google_appengine/nodejs

# Set working dir in the container to /opt/app
WORKDIR /opt/app

# Copy package.json to /opt/app and run npm install
COPY package.json /opt/app
RUN npm install

# Copy the rest of the files to /opt/app
ADD . /opt/app

# Start the app
CMD npm start

# Make port 8080 available to outside
EXPOSE 8080
