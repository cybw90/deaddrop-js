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
## MAC Strategy
After the implementation of all required changes, the MAC code using SHA-256 algorithm creates a unique hash key for each message, which is used to generate the MAC. The SHA-256 algorithm is a widely used hashing algorithm that produces a 256-bit hash value that is difficult to reverse engineer. This ensures that any modifications to the messages are easily detected, making the Deaddrop app more secure and reliable.
## Discussion on changes:
The changes implemented in the code aim to improve the security and reliability of the system by adding features such as message authentication codes (MACs), logging MAC failures, committing log files to GitHub, and including sender identification in the database. Additionally, the system now reports the sender when retrieving messages.
The implementation of MACs ensures that any modifications to the messages will be detected, as the MACs are calculated based on the contents of the message and a secret key known only to the sender and the receiver. This makes it more difficult for an attacker to modify the messages without being detected.
The logging of MAC failures provides a record of any attempts to modify the messages, which can help in identifying potential security threats and in improving the system's security measures. Committing log files to GitHub provides a secure and easily accessible backup of the log files, which can be useful in case of data loss or corruption. The presence of sender identification in the database provides an additional layer of security by ensuring that only authorized senders can access and modify the messages.
Finally, reporting the sender when retrieving messages provides culpability and traceability, making it easier to track who has accessed or modified the messages. Main amin is to increase the security of a messaging system by implementing measures to detect and prevent tampering, keeping logs of suspicious activity, and tracking the identity of senders. These measures are important to take care of privacy and security concerns.
