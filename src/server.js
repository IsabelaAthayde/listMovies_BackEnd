require("express-async-errors");

const AppError = require("./utils/AppError");
const database = require("./database/sqlite");
const express = require("express");
const cors = require("cors");

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

database();

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.log(error);

    response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

const PORT = 3333;
app.listen(PORT, () => {
    console.log(`funcionando na porta ${PORT}`);
});

