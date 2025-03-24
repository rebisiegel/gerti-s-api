import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3001;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`A szerver fut a ${PORT} porton.`);
});
