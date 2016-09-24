# Test Delta

This is a side project I built to be a proof of concept for an online testing website. The company I worked for used a written test (60 minute time limit) as part of their interview process, but the recruitment company they used sent the test out in PDF format to applicants and took it on faith that the 60 minute time limit was adhered to. I built this site as a demo of how we could issue the tests ourselves and enforce the time limit at the same time.

This project was also a way to get some experience of the MEAN stack (MongoDB, Express, Agile, Node), none of which I had used before. It is based on the MEAN starter kit project that you can find on github.

## Features
1. Sign up and sign in
2. Create tests with time limits
3. Create questions of various types (multiple choice, freeform, code)
4. Automatic marking of MCQ and freeform questions based on criteria set by test admin
5. Tests can be assigned to candidates and unique links generated
6. Tests can be taken by candidates with a time limit enforced.
7. Playback of freeform and code quesitons, character by character, so you can check that answers haven't been copied and pasted.
8. See candidate marks at a glance, and expand to see their answers in detail.

I've got it hosted at [http://www.testdelta.com](http://www.testdelta.com) if you want to see it in action.

## To run on a MEAN Digital Ocean box
- rm /opt/mean
- cd /opt/
- git pull this_project
- cd your_project
- npm install
- npm install forever -g
- PORT=80 forever server.js
- or to run as a daemon: PORT=80 forever start server.js
