import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
 import axios from "axios";  // Import axios
 import cors from "cors";




import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();



cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(cors());
app.use(express.json({ limit: "5mb" })); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);


//Add AI chat endpoint
app.post("/api/get-ai-response", async (req, res) => {
    const { userMessage } = req.body;  // Get the user's message from the request body

    try {
        // Make a request to the OpenAI API
        const response = await axios.post(
    "https://api.openai.com/v1/chat/completions", // New endpoint for GPT-3.5 / GPT-4
    {
        model: "gpt-3.5-turbo", // or gpt-4
        messages: [
            { role: "user", content: userMessage }  // This is the correct format for chat-based models
        ],
        max_tokens: 100,
        temperature: 0.7,
    },
    {
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,  // Use environment variable for API key
        },
    }
);


        const aiResponse = response.data.choices[0].text.trim();
        res.json({ aiResponse });
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);
        res.status(500).send("Error processing the request");
    }
});

// Example route for fetching credit score
app.get('/api/users/credit-score', (req, res) => {
    const user = req.user; // Assuming you have user authentication
    // Fetch user's credit score from the database
    const creditScore = getUserCreditScore(user.id); // Replace with your own logic
    res.json({ score: creditScore.score, history: creditScore.history });
  });
  

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
