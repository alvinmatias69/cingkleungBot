# Cingkleung BOT 0.1.0 (Beta)
Telegram chat bot for checking students schedules.
## Getting Started
To get a copy of this bot just simply clone this repository
```sh
$ git clone https://github.com/alvinmatias69/cingkleungBot.git
```
### Prerequisites
This application required latest nodeJS version to be installed in your system to run
* Download NodeJS ([nodeJS](https://nodejs.org/en/ "NodeJS Homepage"))
* NodeJS installation guide ([installation guide](https://www.sitepoint.com/beginners-guide-node-package-manager/ "NodeJS installation guide"))

### Installing
Open the applications folder using terminal then install the required library
```sh
$ cd cingkleungBot
$ npm install
```
Open .env.example file using text manager and change it according to your own environment variables, then rename it to .env
```
API_TOKEN=exampleAPIToken:213941024921 //your telegram bot api token
DB_NAME=exampleDB                      //your database name
DB_USER=exampleUser                    //your database username
DB_PASS=examplePassword                //your database password
DB_HOST=exampleHost                    //your database host
DB_DIALECT=mysql                       //your database dialect (default mysql)
SCHEDULE_URL=exampleUrl                //your api source url
```

### Testing
This apps using mochajs and chaijs for automated testing
```sh
$ cd cingkleungBot
$ npm test
```
the test should have 26 test case passed

### Run Bot Apps
Simply go to your bot folder location using terminal and start script using npm.
```sh
$ cd cingkleungBot
$ npm start
```
### Contributors
* **Habib Fikri** - *Providing API and making this project to happen* - [harkce](https://github.com/harkce "Habib's github")

### Changelog

> ### 0.1.0 (2017-01-22)
> **Feature**
> - classroom check added
> - classroom query saved in database for simplicity
> - classroom check divided to two section (sendMessage and answerCallbackQuery)
> **Testing**
> - automated testing added (see testing section)
> - test.js for testing each component and test_sequence.js to simulated user's usage
> **Others**
> - JSON request now adapted to real JSON request from telegram
> ### 0.0.1 (2017-01-18)
> **Initial Commit**
> - Basic operation defined (send message, ask for NIM, save to database, etc)
> - untested version, don't pull from this version!!


**Matias Alvin (2017)**