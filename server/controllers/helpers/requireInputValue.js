function requireInputValue(req, res) {
  const inputValue = req.body.inputValue;
  if (!inputValue) {
    res.status(400).send({ message: "input is required" });
    return null;
  }
  return inputValue;
}

export default requireInputValue;
