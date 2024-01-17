const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 8989;

const JWT_KEY = "KJSEBFKERFO3WRH49RHW39R8FDG839WFW409R4E80FHEW4";

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect('mongodb+srv://archan:987kL3Taipr2rXoW@cluster0.pqzn9.mongodb.net/secretapp?retryWrites=true&w=majority');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:'true'}));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  password: String,
});

// Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

const User = mongoose.model('user', userSchema);
const Post = mongoose.model('post', postSchema);

// Public endpoint: User signup
app.post('/api/user/create', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, phone, password: hashedPassword });
    await user.save();

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Public endpoint: User login and send JWT as response
app.post('/api/user/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '1000d' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Private endpoint: Get user details by token
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Private endpoint: Create a post
app.post('/api/post', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const prevPost = await Post.findOne({postedBy: req.user._id});
    if(prevPost) return res.status(400).json({message: "User has already crated post"});
    const post = new Post({ title, content, postedBy: req.user._id });
    await post.save();

    return res.json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Private endpoint: Get all posts without user details
app.get('/api/post', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find().select('-postedBy -__v');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_KEY, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    user = await User.findById(user.userId);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
