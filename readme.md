# Cingkleung BOT 0.5.1 (Beta)
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

### Flush Request
In case there's a pile of request you want to get rid, simply uncomment
```javascript
app.use(flushRequestService);
```
in index.js file.
Use caution when using this service, as it'll flush all request without processing it.

### Run Bot Apps
Simply go to your bot folder location using terminal and start script using npm.
```sh
$ cd cingkleungBot
$ npm start
```
### Contributors
* **Habib Fikri** - *Providing API and making this project to happen* - [harkce](https://github.com/harkce "Habib's github")

### Changelog
> ### 0.5.1 (2017-02-04)
> - logged data will now saved in different files depend on the date log added
>
> ### 0.5.0 (2017-01-25)
> **Flush Requests**
> - flush request service now added
> - use caution for this service, as it'll flush all request without processing it (see flush request)
>
> ### 0.4.0 (2017-01-24)
> **Spam Filter**
> - added spam service to filter spam
> - chat from vasu geramona (id: 302707362) now considered as spam
> 
> **fix**
> - added username collumn in csv log
>
> ### 0.3.0 (2017-01-24)
> **Feedback**
> - feedback option added
> - added feedbacks table to contain the feedback
> - added feedback service for adding feedbacks
> - added 2 new test case to both test.js and test_sequence.js
>
> **bug fix**
> - sequence test callback message json structure fixed
>
> ### 0.2.0 (2017-01-24)
> **Logger Service**
> - logger service added
> - every request will now be logged in log/log.txt
> - log will be saved in csv format as following: date, query, user
>
> ### 0.1.1 (2017-01-23)
> - testing script fixed, so it can run on telegram like JSON request
>
> ### 0.1.0 (2017-01-22)
> **Feature**
> - classroom check added
> - classroom query saved in database for simplicity
> - classroom check divided to two section (sendMessage and answerCallbackQuery)
>
> **Testing**
> - automated testing added (see testing section)
> - test.js for testing each component and test_sequence.js to simulated user's usage
>
> **Others**
> - JSON request now adapted to real JSON request from telegram
>
> ### 0.0.1 (2017-01-18)
> **Initial Commit**
> - Basic operation defined (send message, ask for NIM, save to database, etc)
> - untested version, don't pull from this version!!


**Matias Alvin (2017)**