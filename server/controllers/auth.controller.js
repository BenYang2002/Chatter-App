import bcrypt from "bcrypt";
import prisma from "../prisma.js";
async function handleRegister(req, res) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  try {
    const existingEmail = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (existingEmail) {
      res.status(409).send({ message: "Email already exists" });
      return false;
    }
  } catch (err) {
    console.error("Error checking existing email:", err);
    res.status(500).send({ message: "Internal server error" });
    return false;
  }

  try {
    await prisma.user.create({
      data: {
        name: req.body.username,
        email: req.body.email,
        password: passwordHash,
      },
    });
    res.status(200).send({ message: "Registration successful" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).send({ message: "Internal server error" });
    return false;
  }
  return true;
}

async function handleLogin(req, res) {
  const data = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  const inputPassword = data.password;
  if (user) {
    // not null
    const isPasswordCorrect = await bcrypt.compare(
      inputPassword,
      user.password,
    );
    if (isPasswordCorrect) {
      res.status(200).send({ message: `Welcome: ${user.name}` });
    } else {
      res.status(401).send({ message: "Incorrect password" });
    }
  } else {
    res.status(404).send({ message: "cannot find user" });
  }
}

export { handleRegister, handleLogin };
