// importing controller
const surveyController = require("../controllers/surveyController");
const checkAuth = require("../handler/middlewares/checkAuth");

//validator
const ValidateSurvey = require("../handler/validator/survey");

// router
const router = require("express").Router();

// routes
router.post(
  "/create",
  checkAuth,
  ValidateSurvey.CREATE,
  surveyController.create
);

router.post("/*", surveyController.fillSurvey)

router.get("/admin/*", checkAuth, surveyController.getFilledSurvey);

router.get(
  "/*",
  surveyController.getOne
)
module.exports = router;
