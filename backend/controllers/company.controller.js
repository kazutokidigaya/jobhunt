import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName)
      return res
        .status(400)
        .json({ message: "Company name is required!", success: false });

    let company = await Company.findOne({ name: companyName });

    if (company)
      return res.status(400).json({
        message: "You can't register same company twice.",
        success: false,
      });

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log("Error in RegisterComapny Controller", error);
    res
      .status(500)
      .json({ message: "Error Registering Company, Please Try Again Later!" });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies)
      return res
        .status(404)
        .json({ message: "Companies not found!", success: false });

    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.log("Error in GetComapny Controller", error);
    res
      .status(500)
      .json({ message: "Error Fetching Company, Please Try Again Later!" });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const comapnyId = req.params.id;
    const company = await Company.findById(comapnyId);

    if (!company)
      return res
        .status(404)
        .json({ message: "Company not found!", success: false });

    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.log("Error in GetComapnyById Controller", error.message);
    res.status(500).json({
      message: "Error Fetching Company details, Please Try Again Later!",
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updateData = { name, description, website, location, logo };

    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Company ID is required", success: false });
    }

    const company = await Company.findByIdAndUpdate(
      req?.params?.id,
      updateData,
      {
        new: true,
      }
    );

    if (!company)
      return res
        .status(404)
        .json({ message: "Company not found", success: false });

    return res
      .status(200)
      .json({ message: "Company Data Updated Successfully!", success: true });
  } catch (error) {
    console.log("Error in updateCompany Controller", error.message);
    res.status(500).json({
      message: "Error Updating Company details, Please Try Again Later!",
    });
  }
};
