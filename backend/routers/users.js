import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
const router = express.Router();
//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      if (req.body.password) {
        const salt = crypto.randomBytes(16).toString("hex");
        req.body.password = crypto
          .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
          .toString("hex");
        req.body.salt = salt;
      }
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json("User has been updated");
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("you can update only your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found or already deleted");
    }
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } else {
      res.status(403).json("you can delete only your account");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { following: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("your allready follow");
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("you can delete only your account");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { following: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("your you dont follow this user");
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("you can delete only your account");
  }
});

export default router;
