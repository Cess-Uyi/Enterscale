const express = require("express");
const router = express.Router();

const userRoute = require("./userRouter");
const surveyRoute = require("./surveyRouter")

router.use("/users", userRoute);
router.use("/surveys", surveyRoute);

module.exports = router;
