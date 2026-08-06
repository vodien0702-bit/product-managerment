const express = require('express');
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const path = require('path');

require("dotenv").config();
const route = require("./routes/client/index.route.js");
const routeAdmin = require('./routes/admin/index.route.js');
const database = require('./config/database.js');
const systemConfig = require('./config/systems.js');
// DNS
// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);
database.connect();

const app = express();
const port = process.env.PORT;
// method-override
app.use(methodOverride('_method'));
// end method-ovverrid


// express-flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end express-flash


// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// end body-parser
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

routeAdmin(app);
route(app);

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express.static(`${__dirname}/public`));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});