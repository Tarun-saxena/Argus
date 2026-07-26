import "dotenv/config";
import "./jobs/pollgithub.js";
import "./jobs/analyzeIssue.js";
import "./jobs/matchUsers.js";

console.log("Worker started, listening for jobs...");