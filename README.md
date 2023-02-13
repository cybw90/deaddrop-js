#  deaddrop-js

A deaddrop utility written in Typescript. Put files in a database behind a password to be retrieved at a later date.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:
- [Go](https://github.com/andey-robins/deaddrop-go)
- [Rust](https://github.com/andey-robins/deaddrop-rs)

## Versioning

`deaddrop-js` is built with:
- node v18.13.0

## Usage

`npm run build && node dist/index.js --help` for instructions

Then run `node dist/index.js --new --user <username here>` and you will be prompted to create the initial password.

## Database

Data gets stored into the local database file dd.db. This file will not by synched to git repos. Delete this file if you don't set up a user properly on the first go

## Metigation
1. Data should be in encrypted form as stored on open desk
2. Log files contain data/information which can be view via browser and data can be leak, to mitigate we can create ACL and assign permissions to specific group of users to access logs file.
## Logging Strategy
My code made change in log based on "log levels", which is categorized into differenet levels as logging errors and info to indicate their severity and make it easier to prioritize and handling of logs.