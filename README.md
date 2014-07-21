Me Bot
======

This is a (very) simple bot that takes a csv file of your conversations with someone
and allows you to talk to them!

Installation
------------

- install [node.js](http://nodejs.org/)
- clone this repo `git clone https://github.com/benkaiser/me-bot.git`
- run `npm install`

Finding the CSV files
---------------------
I used an app on android called [Message Backup for Facebook](https://play.google.com/store/apps/details?id=com.chamika.fbmsgbackup).
Just make the CSV files then move them to your computer for processing.

Alternatively just make a CSV file with the format:
time,person,message

Usage
-----

`node app.js "path/to/file.csv" "Name of Person to Talk To"

Then a prompt will show up as follows:

```
You:
```

at which point you can start talking to  that person:

```
You: Hey
Benjamin James Kaiser: Heyy
```
