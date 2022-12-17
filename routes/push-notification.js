const pushNotificationController = require("../controller/push-notifications.controller");
const express = require("express");
const router = express.Router();

router.post("/send-notification", pushNotificationController.sendPushNotification);
module.exports = router;