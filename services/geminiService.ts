import { GoogleGenAI, Type } from "@google/genai";
import { RegionConfig, AnalysisResult } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeContractWithGemini = async (
  contractText: string, 
  region: RegionConfig
): Promise<AnalysisResult> => {
  const ai = createClient();

  const prompt = `
    Role: You are a senior legal compliance AI specialized in ${region.name} law.
    Context: The user has uploaded a contract for risk analysis.
    
    Applicable Legal Framework for ${region.name}:
    ${region.laws.map(l => `- ${l}`).join('\n')}
    
    Task:
    Analyze the following contract text strictly against ${region.name} laws.
    Identify red flags, critical omissions (like missing data protection clauses required by local law), and unfair terms.
    Assign a risk score from 0 (Safe) to 100 (Extremely Risky).
    
    Contract Text:
    "${contractText.slice(0, 30000)}..." (Text truncated for analysis if too long)
    
    Output Format:
    Return strictly JSON matching the specified schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_score: { type: Type.INTEGER, description: "0-100 score where 100 is highest risk" },
            risk_rating: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
            summary: { type: Type.STRING, description: "A concise 2-sentence executive summary of the contract's safety." },
            red_flags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: { type: Type.STRING },
                  law_violated: { type: Type.STRING, description: "Specific act or section violated" },
                  severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  explanation: { type: Type.STRING },
                  suggested_fix: { type: Type.STRING, description: "Specific legal language to fix the issue" }
                }
              }
            },
            compliant_points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 good things about the contract"
            },
            applicable_laws_identified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of laws that were relevant to this analysis"
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze contract. Please try again.");
  }
};