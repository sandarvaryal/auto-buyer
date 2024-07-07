import express from "express";
import cors from "cors";

import registerRoute from "./routes/registerRoute";
import loginRoute from "./routes/loginRoute";
import darazRegisterRoute from "./routes/darazCredsRoute";
import darazAddItemRoute from "./routes/darazAddItemRoute";
import darazAccounts from "./routes/darazAccounts";
import darazAccountInstances from "./routes/darazAccountInstances";

import cookieParser from "cookie-parser";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "**",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/darazRegister", darazRegisterRoute);
app.use("/addItem", darazAddItemRoute);

//get routes
app.use("/darazAccounts", darazAccounts);
app.use("/darazAccountInstances", darazAccountInstances);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
