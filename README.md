# EVENDY

Frontend part for the [Evendy.ru](http://evendy.ru) - Rails 5 API + VueJS web application for scheduling new events and share it between your friends.

## Setup

Run API server from [https://github.com/maratgaliev/evendy_api](https://github.com/maratgaliev/evendy_api) and setup frontend part.

Clone project.

```
$ git clone git@github.com:maratgaliev/evendy_frontend.git
$ cd evendy_frontend
```

Change API_URL to the correct path.

```
const API_URL = process.env.API_URL || 'http://api.evendy.ru'
```

Run server.

```
$ npm run dev
```

