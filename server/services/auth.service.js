import prisma from "../prisma.js";
import bcrypt from "bcrypt";
async function verifyUser(req) {
  const returnValue = {
    verified: false,
    message: "",
    status: 200,
    user: {},
  };
  const data = req.body;
  try {
    returnValue.user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
  } catch (err) {
    returnValue.message = "Internal server error";
    returnValue.status = 500;
    console.error(err);
    return returnValue;
  }

  if (!returnValue.user) {
    //user does not exist
    returnValue.message = "User not found";
    returnValue.status = 404;
    return returnValue;
  } else {
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      returnValue.user.password,
    );
    if (isPasswordCorrect) {
      returnValue.verified = true;
      returnValue.message = `Welcome: ${returnValue.user.name}`;
    } else {
      returnValue.message = "Incorrect password";
      returnValue.status = 401;
    }
    return returnValue;
  }
}

export { verifyUser };
