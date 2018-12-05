const express = require("express"); // import the NPM dependancy package
const bodyParser = require("body-parser");
const cors = require("cors");
const uniqid = require("uniqid");

const app = express(); // initialise express() inside and write to the app variable

app.use(bodyParser.json());
app.use(cors());

require("./routes/userRoutes")(app); // import route module and pass your app


const PORT = 5000; // choose what port on which to run the server

app.listen(PORT, () => { // use the app variable and listen on the port
    console.log(`Server running`);
});
