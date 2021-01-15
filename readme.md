# Stackoverflowers API

> Backend API for Stackoverflowers application, which is a social network website for developers.

## Usage

Rename "config/config.env.env" to "config.env" and update the values/settings to your own

## Install Dependancies
```
npm install
```
## Run App
```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```
## Added Basic Security Packages to Improve API Security
```
1. express-mongo-sanitize - To Prevent NoSQL Injections.
2. helmet - Security Headers
3. xss-clean - XSS Protection
4. express-rate-limit - To Limit the No of Reqs
5. hpp - To Prevent HTTP Parameter Pollution
6. cors - To Avoid Cross-Origin Resource Sharing Issues
```
For Detailed Information Visit: 
[How to tackle these common Node.js/Mongo API Security Problems](https://medium.com/javascript-in-plain-english/common-nodejs-mongo-api-security-problems-and-how-to-overcome-them-548d0137984c)

- Version: 1.0.0
- License: MIT