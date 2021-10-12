const express = require('express');
const authControllers = require('../controllers/authControllers');
const liveControllers = require('../controllers/liveControllers');

module.exports = () => {
  let router = express.Router();
  router.post('/login', authControllers.login.bind());
  router.post('/challenge', authControllers.confirmChallenge.bind());
  router.post('/twofactor', authControllers.confirmTf.bind());

  // 
  router.post('/live/start', liveControllers.start.bind());
  router.post('/live/stop', liveControllers.stop.bind());
  router.post('/live/comments', liveControllers.getComments.bind());
  router.post('/live/comments/mute', liveControllers.muteComments.bind());
  router.post('/live/comments/unmute', liveControllers.unmuteComments.bind());
  router.post('/live/comments/send', liveControllers.snedComment.bind());
  router.post('/live/comments/pin', liveControllers.pinComment.bind());

  return router;
};
