
const URL = require("../models/model");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 6 });

async function generateShortUrl(req,res) {
    const redirectedUrl = req.body;
    console.log(redirectedUrl.url);
    if (!redirectedUrl) {
        return res.status(400).json({ message: "redirectedUrl is required" });
    }

    try {
        // Generate a unique shortId using short-unique-id
        const shortId = uid.rnd();
        console.log("In try block");
        console.log(shortId);

        // Create a new URL document in the database
        const newUrl = await URL.create({
            shortId: shortId,
            redirectedUrl: redirectedUrl.url,
            visited: [],
        });

        return res.status(201).json({
            message: "Short URL generated successfully",
            shortId: newUrl.shortId,
            redirectedUrl: newUrl.redirectedUrl,
        });
    } catch (error) {
    return res.status(500).json({ message: "Error generating short URL", error: error.message })};
};

async function deleteShortUrl(req,res){
    const { shortId } = req.params;
    console.log(`Hello world ${shortId}`);
    try {
        const deletedUrl = await URL.findOneAndDelete({ shortId: shortId });

        if (!deletedUrl) {
            return res.status(404).json({ message: "Short URL not found" });
        }

        return res.status(200).json({ message: "Short URL deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting short URL", error: error.message });
    }
}

async function getUrlData (req,res){
    const shortId = req.params.shortId;
    const id = req.params.id;
    const entry = await URL.findOneAndUpdate({
        shortId,
        id
    },
    {
        $push:{
            visited:{
                timestamp: Date.now(),
            },
        },
    });
    res.redirect(entry.redirectedUrl);
};

async function updateShortUrl(req, res) {
    const { shortId } = req.params;
    const { redirectedUrl } = req.body;

    if (!redirectedUrl) {
        return res.status(400).json({ message: "redirectedUrl is required" });
    }

    try {
        const updatedUrl = await URL.findOneAndUpdate(
            { shortId: shortId },
            { 
                redirectedUrl: redirectedUrl,
                visited: [] // Clear all previous visited times
            },
            { new: true } // Return the updated document
        );

        if (!updatedUrl) {
            return res.status(404).json({ message: "Short URL not found" });
        }

        return res.status(200).json({
            message: "Short URL updated successfully",
            shortId: updatedUrl.shortId,
            redirectedUrl: updatedUrl.redirectedUrl,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating short URL", error: error.message });
    }
}

async function getStats(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    if(!shortId) return res.json({error: "Id not found", error});
    return res.status(200).json(result.visited.length);
}

module.exports ={
    generateShortUrl,
    deleteShortUrl,
    getUrlData,
    updateShortUrl,
    getStats,
};