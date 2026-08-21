import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  retrieveRelevantDocuments,
  sanitizeAndCheckInput,
  checkRateLimit,
  getKnowledgeDocs,
  addOrUpdateKnowledgeDoc,
  deleteKnowledgeDoc,
  logChatMessage,
  getChatLogs,
  KnowledgeDocument,
} from "./server/ragKnowledgeBase";

dotenv.config();

// Lazy safe Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      company: "V&I TECH AFRICA LTD",
      llmEngine: "Google Gemini 3.7 Flash RAG",
    });
  });

  // ==========================================================================
  // RAG KNOWLEDGE BASE MANAGEMENT ENDPOINTS (ADMIN CMS)
  // ==========================================================================

  // List all knowledge base documents
  app.get("/api/kb/documents", (_req, res) => {
    try {
      const docs = getKnowledgeDocs();
      res.json({ success: true, count: docs.length, documents: docs });
    } catch (err: any) {
      res.status(500).json({ error: "Impossible de récupérer la base de connaissances." });
    }
  });

  // Add or update document in knowledge base
  app.post("/api/kb/documents", (req, res) => {
    try {
      const doc: KnowledgeDocument = req.body;
      if (!doc || !doc.title || !doc.content) {
        return res.status(400).json({ error: "Le titre et le contenu du document sont requis." });
      }
      addOrUpdateKnowledgeDoc(doc);
      res.json({ success: true, message: "Document indexé dans le système RAG avec succès." });
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de l'enregistrement du document." });
    }
  });

  // Delete document from knowledge base
  app.delete("/api/kb/documents/:id", (req, res) => {
    try {
      const { id } = req.params;
      const deleted = deleteKnowledgeDoc(id);
      if (deleted) {
        res.json({ success: true, message: "Document supprimé de la base RAG." });
      } else {
        res.status(404).json({ error: "Document introuvable." });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la suppression du document." });
    }
  });

  // Get chat audit logs (Admin Monitoring)
  app.get("/api/chat/logs", (_req, res) => {
    try {
      const logs = getChatLogs();
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la récupération des journaux de conversation." });
    }
  });

  // Human Escalation Endpoint
  app.post("/api/chat/escalate", (req, res) => {
    const { userMessage, clientContact, reason } = req.body;
    console.log("[Escalation] Demande d'assistance humaine urgente reçue :", { userMessage, clientContact, reason });
    res.json({
      success: true,
      escalated: true,
      whatsappDirectUrl: "https://wa.me/250795507001",
      phone: "+250 792 124 342",
      email: "contact.vitechdev@gmail.com",
      message: "Votre demande a été transmise à notre Direction Technique. Vous pouvez échanger immédiatement par WhatsApp.",
    });
  });

  // ==========================================================================
  // SECURE RAG-GROUNDED LLM CHAT ENDPOINT
  // ==========================================================================
  app.post("/api/chat", async (req, res) => {
    try {
      const {
        message,
        conversationHistory = [],
        customPrompt,
        temperature: reqTemp,
        model: reqModel,
        visitorLanguage = "fr",
      } = req.body;

      // 1. Rate Limiting Protection
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anonymous";
      const allowed = checkRateLimit(clientIp, 25);
      if (!allowed) {
        return res.status(429).json({
          reply: "Trop de requêtes envoyées. Pour votre sécurité, veuillez patienter une minute avant de renvoyer un message.",
          error: "Rate limit exceeded",
        });
      }

      // 2. Input Validation & Prompt Injection Sanitization
      const check = sanitizeAndCheckInput(message);
      if (!check.safe) {
        return res.status(400).json({
          reply: check.reason || "Entrée non valide.",
          blocked: true,
        });
      }
      const sanitizedMessage = check.sanitized;

      // 3. RAG Retrieval Step (Knowledge Retrieval)
      const retrievedItems = retrieveRelevantDocuments(sanitizedMessage, 4);
      const contextText = retrievedItems
        .map(
          (item, idx) =>
            `--- [DOCUMENT ${idx + 1} : ${item.doc.title} (Catégorie: ${item.doc.category})] ---\n${item.doc.content}`
        )
        .join("\n\n");

      const sourcesUsed = retrievedItems.map((item) => item.doc.title);

      // Check if user is asking for a human handoff
      const wantsHuman = /(parler à un humain|contact humain|conseiller humain|directeur|téléphoner|whatsapp|numéro|agent réel|talk to human)/i.test(
        sanitizedMessage
      );

      const ai = getAI();
      if (!ai) {
        // Fallback intelligent response if API key is not yet configured
        const fallbackReply = `Bienvenue chez V&I TECH AFRICA LTD ! Je suis votre assistant officiel.
Concernant votre demande "${sanitizedMessage.slice(0, 60)}..." :
Nos équipes d'ingénieurs interviennent sur le développement web, mobile, cloud et IA avec garantie de 6 mois et cession 100% du code source.
Pour toute question spécifique non couverte ou pour échanger directement avec notre Direction Générale, contactez-nous au +250 795 507 001 (WhatsApp) ou par email à contact.vitechdev@gmail.com.`;

        logChatMessage({
          userMessage: sanitizedMessage,
          botReply: fallbackReply,
          sourcesUsed: sourcesUsed,
          escalatedToHuman: wantsHuman,
          languageDetected: visitorLanguage,
          model: "fallback-static",
        });

        return res.json({
          reply: fallbackReply,
          sources: sourcesUsed,
          escalatedToHuman: wantsHuman,
          isFallback: true,
        });
      }

      // 4. Construct Grounded System Instructions (Anti-Hallucination & Multi-language)
      const systemInstruction = `Tu es l'Assistant IA Officiel & Conseiller Technique de l'entreprise "V&I TECH AFRICA LTD" (aussi appelée VITECH AFRICA, site: vitechafrica.com).

🎯 RÈGLES ABSOLUES ET STRICTES (ANTI-HALLUCINATION & SÉCURITÉ) :
1. RÈGLE D'OR DE VÉRACITÉ : Réponds UNIQUEMENT et STRICTEMENT sur la base des informations officielles fournies dans la section "BASE DE CONNAISSANCES OFFICIELLE" ci-dessous.
2. ABSENCE D'INFORMATION = AVEU CLAIR : Si l'information demandée par l'utilisateur (prix exact non spécifié, service non répertorié, données personnelles d'un collaborateur, horaires spécifiques non mentionnés) N'EST PAS présente dans la base de connaissances, TU NE DOIS JAMAIS L'INVENTER. Réponds poliment :
   "Je ne dispose pas de cette information spécifique dans la documentation officielle de V&I TECH AFRICA LTD."
   et propose de contacter directement la Direction via WhatsApp (+250 795 507 001) ou par email (contact.vitechdev@gmail.com).
3. PROPRIÉTÉ & DIRECTION :
   - Directeur Général : Direction Générale V&I TECH AFRICA LTD (contact.vitechdev@gmail.com).
   - WhatsApp Direction : +250 795 507 001 | Tél : +250 792 124 342.
   - Hubs : Kigali (Rwanda - Norrsken House), Dakar (Sénégal - Almadies), Abidjan (Côte d'Ivoire - Plateau), Paris (France - Station F).
4. GARANTIES MAJEURES :
   - 100% Cession de Propriété Intellectuelle (IP) au client.
   - Garantie corrective de 6 mois offerte sur tout développement.
   - Accord de Confidentialité (NDA) immédiat avant cadrage.
   - SLA Haute Disponibilité de 99.99%.
5. LANGUE : Réponds dans la langue utilisée par le visiteur (Français par défaut, Anglais si anglais, Kinyarwanda si kinyarwanda, Arabe si arabe, etc.). Reste professionnel, courtois, précis et accueillant.

${customPrompt ? `\nDIRECTIVES ADDITIONNELLES DU GÉRANT :\n${customPrompt}\n` : ""}

📚 BASE DE CONNAISSANCES OFFICIELLE (EXTRAITS RAG PERTINENTS) :
${contextText}`;

      // 5. Format Conversation History
      const historyFormatted = (conversationHistory || []).slice(-8).map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      }));

      const contents = [
        ...historyFormatted,
        {
          role: "user",
          parts: [{ text: sanitizedMessage }],
        },
      ];

      const modelName = reqModel || "gemini-3.7-flash";
      const temperature = typeof reqTemp === "number" ? Math.max(0.1, Math.min(1.0, reqTemp)) : 0.4; // Low temp for factual answers

      // 6. Generate Grounded LLM Response
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature,
        },
      });

      const reply =
        response.text ||
        "Merci pour votre message. Pour une réponse personnalisée, notre Direction Technique est joignable au +250 795 507 001 sur WhatsApp.";

      // 7. Audit Logging
      logChatMessage({
        userMessage: sanitizedMessage,
        botReply: reply,
        sourcesUsed: sourcesUsed,
        escalatedToHuman: wantsHuman,
        languageDetected: visitorLanguage,
        model: modelName,
      });

      return res.json({
        reply,
        sources: sourcesUsed,
        escalatedToHuman: wantsHuman,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Chat RAG API error:", err);
      return res.json({
        reply:
          "Merci pour votre demande. Un ingénieur de V&I TECH AFRICA LTD peut vous répondre directement par WhatsApp (+250 795 507 001) ou par email (contact.vitechdev@gmail.com).",
        fallback: true,
        sources: ["V&I TECH AFRICA LTD Overview"],
      });
    }
  });

  // AI Project Architect Recommendation (Scope generator)
  app.post("/api/ai-scope", async (req, res) => {
    try {
      const { projectType, features, industry, targetAudience, budgetRange } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          recommendation: {
            suggestedStack: ["Next.js 15 / React", "Node.js (NestJS)", "PostgreSQL + Redis", "Docker / AWS ECS"],
            timelineWeeks: 8,
            architectureNotes:
              "Architecture cloud résiliente avec mise en cache edge, offline-first pour mobile et API REST/GraphQL sécurisée.",
            securityMeasures: ["Chiffrement AES-256", "Authentification JWT / MFA", "Protection anti-DDoS Cloudflare"],
          },
        });
      }

      const prompt = `Génère une analyse d'architecture technique pour un projet de type "${projectType}" dans l'industrie "${industry}", avec les fonctionnalités suivantes : ${features?.join(
        ", "
      )}, public cible : "${targetAudience}", budget approximatif : "${budgetRange}".
Retourne une recommandation structurée en JSON valide avec les clés suivantes :
- "suggestedStack": tableau de 4-6 technos recommandées
- "timelineWeeks": nombre estimé de semaines (ex: 6 à 12)
- "architectureNotes": résumé technique des meilleures pratiques (2-3 phrases)
- "securityMeasures": tableau de 3-4 mesures de sécurité recommandées
- "keyMilestones": tableau de 3 étapes de livraison`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ recommendation: parsed });
    } catch (err: any) {
      console.error("AI Scope Error:", err);
      return res.json({
        recommendation: {
          suggestedStack: ["React / Next.js", "Node.js TypeScript", "PostgreSQL", "Cloud AWS"],
          timelineWeeks: 6,
          architectureNotes: "Architecture moderne, performante et évolutive.",
          securityMeasures: ["Chiffrement de bout en bout", "Authentification 2FA", "Audit de code OWASP"],
          keyMilestones: ["Cadrage & Design System", "Développement MVP", "Tests de charge & Déploiement"],
        },
      });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", (req, res) => {
    const { email, topics } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email valide requis" });
    }
    console.log(`[Newsletter] Nouvel abonné : ${email} | Thématiques :`, topics);
    res.json({
      success: true,
      message: "Merci pour votre inscription ! Vous recevrez nos analyses technologiques exclusives.",
    });
  });

  // Global Semantic Search powered by Gemini AI
  app.post("/api/semantic-search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return res.status(400).json({ error: "Requête de recherche requise." });
      }

      const cleanQuery = query.trim();
      const allDocs = getKnowledgeDocs();

      // Keyword & Fuzzy match first
      const queryLower = cleanQuery.toLowerCase();
      const terms = queryLower.split(/\s+/).filter((t: string) => t.length > 2);

      const scoredDocs = allDocs.map((doc) => {
        let score = 0;
        const titleLower = doc.title.toLowerCase();
        const contentLower = doc.content.toLowerCase();
        const tagsLower = doc.tags.map((t: string) => t.toLowerCase());

        if (titleLower.includes(queryLower)) score += 10;
        if (tagsLower.some((t: string) => t.includes(queryLower) || queryLower.includes(t))) score += 8;
        if (contentLower.includes(queryLower)) score += 5;

        for (const term of terms) {
          if (titleLower.includes(term)) score += 3;
          if (tagsLower.some((t: string) => t.includes(term))) score += 2;
          if (contentLower.includes(term)) score += 1;
        }

        return { doc, score };
      });

      const topResults = scoredDocs
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => item.doc);

      // Call Gemini for intelligent semantic synthesis if client is available
      let aiSummary = "";
      const ai = getAI();
      if (ai) {
        try {
          const contextSnippets = (topResults.length > 0 ? topResults : allDocs.slice(0, 4))
            .map((d) => `[${d.title}] (${d.category}): ${d.content.slice(0, 300)}...`)
            .join("\n\n");

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Tu es le moteur de recherche sémantique intelligent de V&I TECH AFRICA LTD.
L'utilisateur a recherché : "${cleanQuery}".
Voici le contexte de la documentation technique et des offres de VITECH AFRICA :
${contextSnippets}

Génère une réponse ultra concise (2-3 phrases maximum), très claire et orientée action pour guider l'utilisateur vers les services, tarifs ou hubs appropriés. Mentionne directement les points clés.`,
                  },
                ],
              },
            ],
          });
          aiSummary = response.text || "";
        } catch (aiErr) {
          console.warn("Semantic AI summary generation fallback:", aiErr);
        }
      }

      // Format results with target route navigation IDs
      const mappedResults = (topResults.length > 0 ? topResults : allDocs.slice(0, 3)).map((d) => {
        let route = "services";
        if (d.category === "pricing" || d.id.includes("pricing")) route = "pricing";
        else if (d.category === "offices" || d.id.includes("hubs")) route = "hubs";
        else if (d.category === "faq") route = "faq";
        else if (d.category === "security") route = "services";
        else if (d.tags.includes("devis") || d.tags.includes("calculateur")) route = "estimator";
        else if (d.tags.includes("contact") || d.tags.includes("direction")) route = "contact";
        else if (d.tags.includes("blog") || d.tags.includes("ia") || d.tags.includes("offline")) route = "blog";

        return {
          id: d.id,
          title: d.title,
          category: d.category,
          tags: d.tags,
          snippet: d.content.slice(0, 160) + "...",
          route,
        };
      });

      res.json({
        success: true,
        query: cleanQuery,
        aiSummary: aiSummary || undefined,
        results: mappedResults,
        total: mappedResults.length,
      });
    } catch (err: any) {
      console.error("Semantic search error:", err);
      res.status(500).json({ error: "Erreur lors de la recherche sémantique" });
    }
  });

  // Contact form submission
  app.post("/api/contact", (req, res) => {
    const data = req.body;
    console.log("[Contact] Nouveau projet reçu :", data);
    res.json({
      success: true,
      reference: `VIT-${Math.floor(100000 + Math.random() * 900000)}`,
      message:
        "Votre demande de projet a été transmise à nos Lead Developers. Un expert vous contactera sous 24h ouvrées.",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vitech Africa Server running on http://localhost:${PORT}`);
  });
}

startServer();
