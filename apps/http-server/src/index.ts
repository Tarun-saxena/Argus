import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "HTTP Server running",
  });
});

//Signup
app.post("/signup", (req, res) => {
  console.log(req.body);

  res.json({
    
    message: "Signup endpoint hit"
  });
});

//Signin
app.post("/signin", (req, res) => {
  console.log(req.body);

  res.json({
  
    message: "Signin endpoint hit"
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});