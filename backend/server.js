require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(bodyParser.json());

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  // Your API key is automatically sourced from GEMINI_API_KEY env variable
});

// Load data files and preprocess for Fuse indexing
const faqs = JSON.parse(fs.readFileSync(path.join(__dirname, "faqs.json"), "utf-8"));
const departments = JSON.parse(fs.readFileSync(path.join(__dirname, "departments.json"), "utf-8"));
const procedures = JSON.parse(fs.readFileSync(path.join(__dirname, "procedures.json"), "utf-8"));

const normalizeText = (text) => (text ? text.toLowerCase().trim() : "");

const proceduresIndexed = procedures.map(proc => ({
  ...proc,
  stepsText: proc.steps.join(" "),
  combinedText: normalizeText(`${proc.title} ${proc.description} ${proc.steps.join(" ")}`),
}));

const faqsIndexed = faqs.map(faq => ({
  ...faq,
  combinedText: normalizeText(`${faq.question} ${faq.answer}`),
}));

const departmentsIndexed = departments.map(dept => ({
  ...dept,
  combinedText: normalizeText(`${dept.department} ${dept.contact} ${dept.info}`),
}));

const fuseOptions = {
  threshold: 0.6,
  includeScore: true,
  ignoreLocation: true,
};

const fuseFaq = new Fuse(faqsIndexed, { ...fuseOptions, keys: ["combinedText"] });
const fuseDept = new Fuse(departmentsIndexed, { ...fuseOptions, keys: ["combinedText"] });
const fuseProc = new Fuse(proceduresIndexed, { ...fuseOptions, keys: ["combinedText"] });

function filterByScore(results, maxScore = 0.5) {
  return results.filter(r => r.score !== undefined && r.score <= maxScore);
}

function findRelevantFaqs(question, maxResults = 5) {
  const normalizedQuestion = normalizeText(question);
  console.log("Normalized search question:", normalizedQuestion);
  let results = fuseFaq.search(normalizedQuestion, { limit: maxResults * 3 });
  console.log("Fuse FAQ search raw results:", results);
  results = filterByScore(results, 0.5);
  console.log("Filtered FAQ results:", results);
  return results.slice(0, maxResults).map(r => r.item);
}

function findRelevantDepartments(question, maxResults = 3) {
  const normalizedQuestion = normalizeText(question);
  let results = fuseDept.search(normalizedQuestion, { limit: maxResults * 3 });
  console.log("Fuse Department search raw results:", results);
  results = filterByScore(results, 0.5);
  console.log("Filtered Department results:", results);
  return results.slice(0, maxResults).map(r => r.item);
}

function findRelevantProcedures(question, maxResults = 3) {
  const normalizedQuestion = normalizeText(question);
  let results = fuseProc.search(normalizedQuestion, { limit: maxResults * 3 });
  console.log("Fuse Procedure search raw results:", results);
  results = filterByScore(results, 0.5);
  console.log("Filtered Procedure results:", results);
  return results.slice(0, maxResults).map(r => r.item);
}

app.post("/api/chat", async (req, res) => {
  const question = req.body.question;
  console.log("Received question:", question);

  let relevantFaqs = findRelevantFaqs(question);
  let relevantDepts = findRelevantDepartments(question);
  let relevantProcs = findRelevantProcedures(question);

  console.log("Relevant FAQs:", relevantFaqs);
  console.log("Relevant Departments:", relevantDepts);
  console.log("Relevant Procedures:", relevantProcs);

  // Fallback if no relevant FAQs - uncomment if desired
  if (relevantFaqs.length === 0) {
    relevantFaqs = faqs.slice(0, 5);
  }

  const faqSection = relevantFaqs.length > 0
    ? `Relevant FAQs which might help:\n${relevantFaqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}\n\n`
    : "No relevant FAQs found.\n\n";

  const deptSection = relevantDepts.length > 0
    ? `Department Contacts which might help:\n${relevantDepts.map(dept => `Department: ${dept.department}\nContact: ${dept.contact}\nInfo: ${dept.info}`).join('\n\n')}\n\n`
    : "No relevant department contacts found.\n\n";

  const procSection = relevantProcs.length > 0
    ? `Procedures which might help:\n${relevantProcs.map(proc => `Title: ${proc.title}\nDescription: ${proc.description}\nSteps:\n${proc.steps.map((step, idx) => `  ${idx + 1}. ${step}`).join('\n')}`).join('\n\n')}\n\n`
    : "No relevant procedure details found.\n\n";

  const prompt = `You are a smart and friendly university assistant chatbot 🤖🎓.

Please answer student questions with these guidelines:
- Please format your answer using markdown syntax with bullet points, numbered lists, paragraphs, and emojis for readability.
- Use relevant emojis 🌟 to make the chat engaging.
- Keep answers polite, friendly, and easy to understand.
- Prioritize and use the following contextual information first.** If any of the provided FAQs, departments, or procedures are relevant to the user's question, integrate them directly into your response.
- If the question is general and not covered by the contextual information (FAQs, departments, procedures), use the information avaible on the internet. Do not use phrases like "Information is not available in the database".
- NEVER state that you lack information or that the answer is outside your knowledge base.** Always provide a positive and helpful response, drawing from the provided context or the general knowledge section.
- Maintain a friendly, supportive, and encouraging tone.

${faqSection}${deptSection}${procSection}Based on the above information, please answer this student question:

${question}

Answer:
`;

  console.log("Prompt sent to Gemini AI:\n", prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ type: "text", text: prompt }],
    });
    res.json({ answer: response.text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "Sorry, something went wrong with the AI service." });
  }
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
