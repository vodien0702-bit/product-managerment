const express = require('express');
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const dns = require('dns');
const moment = require('moment');
require("dotenv").config();
const route = require("./routes/client/index.route.js");
const routeAdmin = require('./routes/admin/index.route.js');
const database = require('./config/database.js');
const systemConfig = require('./config/systems.js');

// DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
database.connect();

const app = express();
const port = process.env.PORT;

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// App locals (Khai báo biến toàn cục trước khi gọi Route)
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;


// Static files (Phục vụ file tĩnh trước khi chạy vào Routes)
app.use(express.static(path.join(__dirname, "public")));

// body-parser (Đặt trước methodOverride để đọc được req.body)
app.use(bodyParser.urlencoded({ extended: false }));
// end body-parser

// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End Tiny MCE

// method-override
app.use(methodOverride('_method'));
// end method-ovverrid

// express-flash
app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat', // Thêm trường secret bắt buộc
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());
// end express-flash

// Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;