Concerto Headless CMS - API
==================================
[![Travis](https://img.shields.io/travis/concerto-cms/api.svg?style=flat-square)](https://travis-ci.org/concerto-cms/api)
[![Website](https://img.shields.io/website/http/concertocms.org.svg?label=concertocms.org&style=flat-square)](http://concertocms.org)
[![license](https://img.shields.io/github/license/concerto-cms/api.svg?style=flat-square)](https://github.com/concerto-cms/api/blob/master/LICENSE)
[![Docker Stars](https://img.shields.io/docker/stars/concertocms/api.svg?style=flat-square)](https://hub.docker.com/r/concertocms/api/)

Concerto CMS is driven by this Express JS backend that will consist of 2 different API endpoints:
- the Management API will support the Angular 2 admin app
- the Consumer API will be used by the website to publish the content

Running the API
-----------------

The provided Docker-compose file will make it easy to run the API

```sh
# clone it
git clone git@github.com:concerto-cms/api.git
cd api

# Install dependencies
npm install

# Run using docker-compose
docker-compose up
```

Available NPM scripts
-----------------------
```sh
# Start dev server
npm start

# Build for production (using Babel)
npm run build

# Run production server
npm run serve

# Run tests
npm test
```


License
-------

BSD-3
