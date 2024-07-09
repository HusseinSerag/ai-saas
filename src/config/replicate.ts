import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_AI_API_KEY,
});

export default replicate;
