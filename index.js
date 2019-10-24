const express = require('express');
const app = express();
const error = require('./middleware/error');
app.use(express.json());
require('./config/db')();

app.use('/api/employees', require('./routes/employees'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/inventories', require('./routes/inventories'));
app.use('/api/auth', require('./routes/auth'));

// error handeling
// app.use(error);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
