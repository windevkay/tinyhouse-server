This is the TypeScript + Node + GraphQl backend for the TinyHouse app

## Overall Structure

Apollo server is being used to create the GraphQl server.
MongoDB and MongoDB Atlas are employed for our database cloud service.

Types can be generated using and by adding a codegen.yml but this isnt being done here due to some complexity of our data. Hence we are defining our types manually.

Resolvers call on service files where majority of code logic is domiciled.

Jest is being used for testing of all individual services.

## Available Scripts

In the project directory, you can run:

### `npm run test`

Runs Jest to test all detected services test files.

### `npm run start`

Start the GraphQl server and access playground with /api.

### `npm run seed | clear`

Seed or Clear MongoDB Atlas with data. Said data can be found in the mocks folder.

### `npm run build`

Compile to Javascript.
