const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require('./models/User');
const app = express();
const visitHistoryRoutes = require("./routes/visitHistory");

// initialize transporter for email sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.APP_PASSWORD,
  },
});

// user schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false }, // track active status
  isAdmin: { type: Boolean, default: false },
});

// middleware to check if user is an admin
const requireAdmin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const user = await User.findById(req.user._id); // retrieve user by ID stored in session
      if (user && user.isAdmin) {
        return next(); // ok admin, proceed to the route
      }
      return res.status(403).json({ message: "Not Allowed. Admins only." });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching user data" });
    }
  } else {
    return res.status(401).json({ message: "Please log in to access this page" });
  }
};

dotenv.config(); // load environment variables
require("./config/passport"); // load passport configuration

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/"); // Redirect to login page if authentication fails

    req.logIn(user, (err) => {
      if (err) return next(err);
      // Redirect to frontend with user's first name in the query string
      res.redirect(`http://localhost:3000/dash?name=${user.firstName}`);
    });
  })(req, res, next);
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    credentials: true,
  })
);

// setup session (needed for Passport sessions)
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true kung production
  })
);

app.use(passport.initialize());
app.use(passport.session());

// use this middleware for routes that require admin access
app.get("/admin", requireAdmin, (req, res) => {
  res.send("Welcome to the admin dashboard");
});

// route to activate a user
app.put("/users/activate", async (req, res) => {
  const { email } = req.body;
  try {
    const activatedUser = await User.findOneAndUpdate(
      { email },
      { isActive: true },
      { new: true }
    );

    if (!activatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User activated", user: activatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error activating user" });
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // hashed password
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// route to send success email
app.post("/send-success-email", async (req, res) => {
  const { email } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Welcome to the BukSU Fitness Gym!",
      text: "Maayad ha aldaw! Your account has been successfully activated. You can now access the gym facilities.",
    });
    res.status(200).json({ message: "" });
  } catch (err) {
    res.status(500).json({ message: "Error sending success email" });
  }
});

// route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users" });s
  }
});

// route to update user’s first or last name
app.put("/users/update-name", async (req, res) => {
  const { email, firstName, lastName } = req.body;
  try {
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// route to archive (deactivate) a user
app.put("/users/archive", async (req, res) => {
  const { email } = req.body;
  try {
    const archivedUser = await User.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );

    if (!archivedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User archived", user: archivedUser });
  } catch (err) {
    res.status(500).json({ message: "Error archiving user" });
  }
});

// route
app.use("/auth", authRoutes);
app.use("/visitHistory", visitHistoryRoutes);

// server listening on..
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// i hate captialism (letters) >:(
