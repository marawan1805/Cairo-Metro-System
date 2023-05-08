const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/registerUser", async (req, res) => {
  const { fullName, phoneNumber, password } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        phoneNumber,
        role: 'User',
        password,
        email: "maro@gmail.com",
        isSenior: false,
      },
    });

    res.status(200).json({ data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
