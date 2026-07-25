import "dotenv/config";
import "./jobs/pollgithub.js";
import "./jobs/analyzeIssue.js";
console.log("Worker started, listening for jobs...");