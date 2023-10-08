const jsonServer = require('json-server');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);

const customCorsMiddleware = require('./middlewares');

server.use(cors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
server.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.path}`);
  next();
});

server.use(customCorsMiddleware);
server.use(middlewares);

const jwtSecret = 'your-secret-key';

// Instead of a hardcoded user array, read users from db.json
const db = require('./db.json');
const users = db.admin;

server.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email in the 'users' array
  const user = users.find((u) => u.email === email);

  console.log(user);

  if (!user || user.password !== password) {
    res.status(401).json({ message: 'Invalid email or password' });
  } else {
    try {
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '1h',
      });

      console.log('Generated Token:', token);

      res.status(200).json({ token });
    } catch (error) {
      console.error('JWT Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
