const user_path = "./DB/users.json";
const items_path = "./DB/items.json";
const jsonfile = require("jsonfile");
const uniqid = require("uniqid");

module.exports = app => {

    /*
    * USERS
    */
    app.post("/users/new", (req, res) => {
        let { email, username } = req.body;
        jsonfile.readFile(user_path, function (err, content) {
            content.push({ email, username });
            console.log("added " + email + "to DB");

            jsonfile.writeFile(user_path, content, function (err) {
                console.log(err);
            });

            res.sendStatus(200);
        });
    });

    app.get("/users", (req, res) => {
        jsonfile.readFile(user_path, (err, content) => {
            res.send(content);
        });
        console.log("GET returned");
    });

    /* 
    * ITEMS
    */

    app.get('/items', (req, res) => {
        jsonfile.readFile(items_path, (err, content) => {
            res.send(content);
        })
        console.log("Item json returned");
    });

    app.post('/items/new', (req, res) => {
        let { name, description, lat, lon } = req.body;
        let id = uniqid();
        jsonfile.readFile(items_path, function (err, content) {
            content.docs.push({ id: id, name, description, lat, lon });
            console.log("added " + name + "to DB");

            jsonfile.writeFile(items_path, content, function (err) {
                console.log(err);
            });

            res.sendStatus(200);
        });
    })

}