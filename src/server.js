const express = require("express");

const app = express();
const PORT = 3333;

app.listen(PORT, () => {
    console.log(`funcionando na porta ${PORT}`);
});

app.get("/movie", (request, response) => {
    const { id } = request.query;
    response.send(`
    Id do Filme: ${id},
    Filme: Ela dança, eu danço`);
});
