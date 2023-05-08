BQMR6I - Szakdoga 2023

Project title: Crypto Gaze

Installation:

First you have to install the node packages by both the frontend and the backend.

Install backend packages:

Navigate to /crypto-gaze in terminal.
Run the command `npm i`.
This will install the necessary npm packages for running the backend.

Install frontend packages:

Navigate to /crypto-gaze/app/react-ui in terminal.
Run the command `npm i`.
This will install the necessary npm packages for running the frontend.

Deploying the persistent database:

Navigate to /crypto-gaze in terminal.
Run the command `cds deploy --to sqlite`
This will deploy the persistent database to a local sqlite file with some initial data to work with.

Starting the frontend in development mode:

Navigate to /crypto-gaze/app/react-ui in terminal.
Run the command `npm start`.
This command will start the frontend server and open a browser window at `localhost:3000`
Note that this will render the terminal window useless for running any other commands, while this command is active.

Starting the backend without persistence:

Navigate to /crypto-gaze in terminal.
Run the command `cds watch`.
This command will start the backend with an in-memory sqlite database at `localhost:4004` similar to the frontend in development mode.
Note that this will render the terminal window useless for running any other commands, while this command is active.

Starting the backend with persistence:

Navigate to /crypto-gaze in terminal.
Run the command `cds serve`.
This command will start the backend with a persistent database, if a persistent database was deployed.