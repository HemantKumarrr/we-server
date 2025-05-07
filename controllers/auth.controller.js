import User from "../models/user.model.js";
import jwtFn from "../middleware/inti_jwt.js";
import oauth2Client from "../utils/googleClient.js";
import axios from "axios";
import sendEmail from "../utils/email.js";
import jsonwebtoken, { decode } from "jsonwebtoken";
const jwt = jsonwebtoken;
import resetPasswordTemplate from "../utils/resetPasswordTemplate.js";
import emailOTPtemplate from "../utils/emailOTPtemplate.js";

const secure = process.env.NODE_ENV === "production";

const auth = {
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      switch (true) {
        case !username:
          return res.status(400).json({ error: "please enter username" });
          break;
        case !email:
          return res.status(400).json({ error: "please enter email" });
          break;
        case !password:
          return res.status(400).json({ error: "please enter password" });
          break;
        case !otp:
          return res.status(400).json({ error: "please enter OTP" });
          break;
      }

      const data = await User.create({
        username,
        email,
        password,
        otp,
        otpExpires,
      });
      console.log(`Email recieved from api : ${email}`);
      sendEmail(
        email,
        `Prod.me verification Code: ${otp}`,
        otp,
        emailOTPtemplate
      );
      res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
      if (error.code == 11000) {
        res.status(400).json({ error: "user already exists" });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      switch (true) {
        case !email:
          return res.status(400).json({ error: "please enter email" });
          break;
        case !password:
          return res.status(400).json({ error: "please enter password" });
          break;
      }

      const data = await User.login(email, password);
      const accessToken = jwtFn.genJWT(data._id);
      res.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        sameSite: "None",
        httpOnly: true,
        secure: secure,
      });
      res.status(200).json({ user: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  googleLogin: async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "G-Code not found" });

    try {
      const googleResponse = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(googleResponse.tokens);
      const userResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
      );

      const { id, email, name } = userResponse.data;

      switch (true) {
        case !id:
          res.status(400).json({ error: "G-Id not found" });
          break;
        case !email:
          res.status(400).json({ error: "G-Email not found" });
          break;
        case !name:
          res.status(400).json({ error: "name not found" });
          break;
      }

      let user = await User.findOne({ email }).select(
        "username age country email role createdAt isVerified profileImage"
      );
      if (!user) {
        user = await User.create({
          googleId: id,
          username: name,
          email: email,
        });
      }

      const accessToken = jwtFn.genJWT(user._id);
      console.log("Google Login response: ", user);
      res.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        sameSite: "None",
        httpOnly: true,
        secure: secure,
      });
      res.status(200).json({ user: user });
    } catch (error) {
      res.status(500).json({ error });
      console.log(error);
    }
  },
  logout: (req, res) => {
    try {
      res.cookie("accessToken", "", {
        maxAge: 1000,
        sameSite: "None",
        httpOnly: true,
        secure: secure,
      });
      res.status(200).json({ message: "logged out sucessfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      console.log("Fetched User: ", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate Reset Token (valid for 15 mins)
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      // Store token in database

      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
      await user.save();

      const message = `${process.env.ORIGIN}/reset-password/${resetToken}`;
      sendEmail(
        email,
        "Prod.me Reset Password Link",
        message,
        resetPasswordTemplate
      );
      res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "internal server error" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.id) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Find user by ID
      const user = await User.findOne({ _id: decoded.id, resetToken: token });
      if (!user || user.resetTokenExpiry < Date.now()) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset link" });
      }

      // Update password and remove reset token
      user.password = newPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      res.json({ message: "Password reset successful. Please login." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  verifySingup: async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date() },
      }).select(
        "username age country email role createdAt isVerified profileImage"
      );
      console.log(user);
      if (!user)
        return res.status(400).json({ message: "Invalid or expired OTP" });

      user.otp = null;
      user.otpExpires = null;
      user.isVerified = true;
      await user.save();
      const accessToken = jwtFn.genJWT(user._id);
      res.cookie("accessToken", accessToken, {
        maxAge: 3600000,
        sameSite: "None",
        httpOnly: true,
        secure: secure,
      });
      res.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error verifying OTP", error });
    }
  },
};

export default auth;
