const express = require("express");
const {generateShortUrl,deleteShortUrl,getUrlData,updateShortUrl, getStats} = require("../controllers/url");
const router = express.Router();

router.post("/",generateShortUrl);
router.route("/:shortId")
.get(getUrlData)
.delete(deleteShortUrl)
.put( updateShortUrl);
router.get("/:shortId/stats",getStats)

module.exports = router;