# My Wallet API

An easy to use financial manager. Track your revenues and expenses to learn how you spend your money and know all the time how much you have.

Try it out now at [my-wallet-api (heroku)][my-wallet-api]

## About

This is an web application with which lots of people can manage their own expenses and revenues. Below are the implemented features:

- Sign Up
- Login
- List all financial events for a user
- Add expense
- Add revenue
- Sign Out

By using this app any user can learn how they've been using their money and always keep track of your balance.

## Technologies

The following tools and frameworks were used in the construction of the project:<br>

<p>
  <img style='margin: 5px;' src='https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white"/>
</p>

## How to run

1. Clone this repository
2. create a postgres Database named mywallet (for Jest tests: mywallet_test)
3. copy database from dump.sql file in root/dataFiles (optional: you'll find aditional scripts to create and delete database in ./scripts)
4. create a .env with your database connection URL, Port and JWT Secret before running your server (example file in root)
5. Install dependencies

```bash
npm i
```

6. start server with

```
npm run dev
```

7. Finally, you can consume the API sending requests to http://localhost:4000/route replacing route with the desired route.
Additionaly you can try the front-end deploy on vercel, integrated with the back-end deploy on heroku: [my-wallet-app][my-wallet-app]

[my-wallet-app]:https://my-wallet-dun.vercel.app
[my-wallet-api]:https://my-wallet-ap1.herokuapp.com/
