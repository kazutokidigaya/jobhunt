import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../config/datauri.js";
import cloudinary from "../config/cloudinary.js";
import pdfParse from "pdf-parse-debugging-disabled";
import Groq from "groq-sdk";
import axios from "axios";

const extractDataWithGroq = async (parsedResumeText) => {
  // Prepare your prompt to instruct the model to return a JSON object with key details
  const prompt = `
Extract the candidate's total work experience from the resume text below.
If the candidate has worked at multiple positions, sum up all durations.
For example, if the candidate worked 6 months at one job and 11 months at another, return "1 year 5 months".
If no clear experience is mentioned, return "NA".
Additionally, extract the candidate's skills as an array of strings.
Return only a JSON object with the following keys:
{
  "yearsExperience": "a string representing total work experience (e.g., '1 year 5 months' or 'NA')",
  "skills": ["an array of skill strings"]
}

Resume Text:
${parsedResumeText}
  `;

  const requestData = {
    model: "llama-3.3-70b-versatile", // Adjust to your chosen model
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 1,
  };

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    // The extracted data should be in response.data.choices[0].message.content as valid JSON.
    const extractedData = JSON.parse(response.data.choices[0].message.content);

    return extractedData;
  } catch (error) {
    console.error(
      "Error calling Groq API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role)
      return res
        .status(400)
        .json({ message: "Please fill the required fields", success: false });

    const file = req.file;
    const fileUri = getDataUri(file);
    if (!fileUri)
      return res
        .status(400)
        .json({ message: "Please upload an profile image", success: false });
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const userExsists = await User.findOne({ email });
    if (userExsists)
      return res
        .status(400)
        .json({ message: "Email is Already Taken", success: false });

    await User.create({
      fullname,
      email,
      phoneNumber,
      password,
      role,
      profile: {
        profilePhoto:
          cloudResponse?.secure_url || "https://github.com/shadcn.png",
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in Register Controller", error.message);
    res
      .status(500)
      .json({ message: "Register Failed. Please Try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res
        .status(400)
        .json({ message: "Please fill the required fields", success: false });

    let user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found. Please sign up", success: false });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid email or password.", success: false });

    if (role !== user.role)
      return res
        .status(400)
        .json({ message: "Incorrect Account Role", success: false });

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullname}`, user, success: true });
  } catch (error) {
    console.log("Error in LogIn Controller", error.message);
    res.status(500).json({ message: "Login Failed. Please Try again later." });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "LoggedOut Successfully", success: true });
  } catch (error) {
    console.log("Error in LogOut Controller", error.message);
    res.status(500).json({ message: "LogOut Failed. Please Try again later." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    let cloudResponse = null;
    let parsedResumeData = "";
    let extractedData = {};

    // If a resume file is uploaded, process it
    if (file) {
      // Convert file to data URI for cloud upload
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);

      // Use pdf-parse to extract text from the uploaded PDF buffer
      try {
        const data = await pdfParse(file.buffer);
        parsedResumeData = data.text;
        // Use compromise to extract key fields from the parsed text
        extractedData = extractedData = await extractDataWithGroq(
          parsedResumeData
        );
      } catch (err) {
        console.error("Error parsing resume PDF:", err);
      }
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found. Please sign up", success: false });

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
      user.profile.parsedResume = parsedResumeData;
      user.profile.extractedData = extractedData; // Save extracted fields
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile Updated Successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error in Update Profile Controller", error);
    res
      .status(500)
      .json({ message: "Update Profile Failed, Please Try Again Later!" });
  }
};
