const axios = require("axios");

const getLangugageById = (lang) => {
  const language = {
    "c++": 106,
    java: 91,
    javascript: 97,
  };
  return language[lang.toLowerCase()];
};
const waiting = async (timer) => {
  setTimeout(() => {
    return 1;
  }, timer);
};
const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: process.env.JUDGE0_URL,
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-host": process.env.JUDGE0_KEY1,
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};
const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: process.env.JUDGE0_URL,
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY2,
      "x-rapidapi-host": process.env.JUDGE0_KEY3,
      "Content-Type": "application/json",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  while (true) {
    const result = await fetchData();
    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);
    if (IsResultObtained) return result.submissions;
    await waiting(1000);
  }
};

module.exports = { getLangugageById, submitBatch, submitToken };
