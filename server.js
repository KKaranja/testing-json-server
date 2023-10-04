const jsonServer = require('json-server');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import JWT library
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);

const customCorsMiddleware = require('./middlewares');

server.use(cors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));

// Enable CORS for all routes
server.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.path}`);
  next();
});

server.use(customCorsMiddleware);
server.use(middlewares);

// Secret key for JWT token (you should use a strong, unique secret key in production)
const jwtSecret = 'your-secret-key';

// Example user data (you can load user data from a database)
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'adminpassword',
  },
];

// Custom login route
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email (you would typically query a database here)
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    // Invalid credentials
    res.status(401).json({ message: 'Invalid email or password' });
  } else {
    // Valid credentials, generate a JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1h', // Token expiration time (adjust as needed)
    });

    // Respond with the generated token
    res.status(200).json({ token });
  }
});

server.use(router);

const port = process.env.PORT || 3500;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
