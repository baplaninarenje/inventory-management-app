const path = require('node:path');
const express = require('express');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const indexRouter = require('./routes/indexRouter');
const genresRouter = require('./routes/genresRouter');

// Set up routes
app.use('/genres', genresRouter);
app.use('/', indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App - listening on port ${PORT}!`);
});
