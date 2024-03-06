// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 5000;
// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// Apply the rate limiter to all requests
app.use(limiter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/intern', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  profilePicture: String,
});

const User = mongoose.model('User', userSchema);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Nodemailer configuration

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'projectplazapro@gmail.com', // Your Gmail email address
      pass: 'bynw qsyz fbqy guvq' // Your Gmail password
    }
  });

app.post('/signup', upload.single('profilePicture'), async (req, res) => {
    try {
      const { username, email, password, name } = req.body;
  
      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password,
        name,
        profilePicture: req.file ? req.file.path : ''
      });
  
      await newUser.save();
  
      // Send confirmation email
      const mailOptions = {
        from: 'projectplazapro@gmail.com',
        to: email,
        subject: 'Welcome to MyApp!',
        text: `Dear ${name},\n\nThank you for signing up with MyApp.`
      };
  
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  //signin-authentication
  app.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      // Check if user exists
      const user = await User.findOne({ email, password });
      if (user) {
        // Successful sign-in
        return res.status(200).json({ success: true, message: 'Sign in successful' });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  // Password reset route
app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
/**const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/intern', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create user schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Generate verification token
    const verificationToken = jwt.sign({ email }, 'secret', { expiresIn: '1d' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'projectplazapro@gmail.com',
        pass: 'bynw qsyz fbqy guvq'
      }
    });

    const mailOptions = {
      from: 'projectplazapro@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Please click <a href="http://localhost:3000/verify-email/${verificationToken}">here</a> to verify your email.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ message: 'User created. Please check your email for verification.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Verify email route
app.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, 'secret');
    
    const user = await User.findOneAndUpdate({ email: decoded.email }, { isVerified: true });
    
    res.redirect('http://localhost:3000/signin');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));**/
