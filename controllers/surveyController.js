const db = require("../models");
const Survey = db.survey;
const Question = db.question;
const User = db.user;
const Answer = db.answer;

const sequelize = require("../config/sequelize");

const { validationResult } = require("express-validator");
const { errorResponse, successResponse } = require("../handler/response");
const e = require("express");

class Surveys {
  static async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }

    try {
      const user = await req.user;
      const { title, questions } = await req.body;

      //generate a url
      const baseSurveyUrl = "www.survey.com";
      const surveyName = title.replace(/\s+/g, "_");
      const randomString = Math.random().toString(36).substring(2, 18);

      const url = baseSurveyUrl + "/" + surveyName + "/" + randomString;

      await sequelize.transaction(async function (transaction) {
        const survey = await Survey.create(
          {
            userId: user.id,
            title,
            url: url,
          },
          { transaction }
        );

        await questions.forEach(
          async (item) => {
            await Question.create({
              surveyId: survey.id,
              question: item,
            });
          },
          { transaction }
        );
        return successResponse(res, 201, "survey successfully created", {
          survey,
        });
      });
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }

  static async getOne(req, res) {
    const url = req.params;

    try {
      const survey = await Survey.findOne({
        where: { url: url[0] },
        include: User,
        include: Question,
      });
      if (!survey) {
        return errorResponse(res, 404, "invalid survey url", null);
      }

      return successResponse(res, 200, "successful", survey);
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }

  static async fillSurvey(req, res) {
    const url = req.params;
    const answer = req.body;

    try {
      const survey = await Survey.findOne({
        where: { url: url[0] },
        include: User,
        include: Question,
      });
      if (!survey) {
        return errorResponse(res, 404, "invalid survey url", null);
      }
      let surveyQuestions = survey.toJSON().Questions;

      if (Object.keys(answer).length != surveyQuestions.length) {
        return errorResponse(res, 422, "please fill", null);
      } else {
      }

      for (let i = 0; i < surveyQuestions.length; i++) {
        const question = surveyQuestions[i];
        Answer.create({
          questionId: question.id,
          answer: Object.values(answer)[i],
        });
      }

      return successResponse(res, 201, "survey successfully filled", req.body);
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }

  static async getFilledSurvey(req, res) {
    const url = req.params;
    const result = []

    try {
      let survey = await Survey.findOne({
        where: { url: url[0] },
        include: User,
        include: Question,
      });
      survey = survey.toJSON();
      if (!survey) {
        return errorResponse(res, 404, "invalid survey url", null);
      }
      const surveyQuestions = survey.Questions;
      const surveyQuestionsId = [];

      //get the ids of the questions in this survey
      for (let i = 0; i < surveyQuestions.length; i++) {
        const question = surveyQuestions[i];
        surveyQuestionsId.push(question.id);
      }

      // get the answers to the questions
      for (let i = 0; i < surveyQuestionsId.length; i++) {
        let answer = await Answer.findAll({
          where: { questionId: surveyQuestionsId[i] },
          raw: true,
        });
        const answersArray = [];

        // group answers by questionId
        for (let i = 0; i < Object.keys(answer).length; i++) {
          answersArray.push(answer[i].answer);
        }

        let question = await Question.findOne({ where: { id: answer[i].questionId } })
        question = question.toJSON()
        question = question.question

        const payload = {
          question: question,
          answers: answersArray,
        };
        result.push(payload)
      }

      return successResponse(res, 200, "successful", result);
    } catch (err) {
      console.log(err);
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Surveys;
