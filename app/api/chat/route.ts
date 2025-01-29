import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const { ASTRA_DB_KEYSPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, OPENAI_API_KEY } = process.env;

const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT as string, { keyspace: ASTRA_DB_KEYSPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMsg = messages[messages?.length - 1]?.content;

    let docContext = "";

    const embedding = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMsg,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION as string);
      const currsor = collection.find(
        {},
        {
          sort: {
            $vector: embedding.data[0].embedding,
          },
          limit: 10,
        }
      );
      const documents = await currsor.toArray();

      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap);
    } catch {
      console.log("Error finding embeddings...");
    }

    const template = {
      role: "system",
      content: `Your are an AI assistant who konws everything about Max Verstapen. Use the below context to augument what you know about him.
        The context will provide you with the most recent and factual data. If the context dont include the information you need or question isnt about Max Verstapen respond that question is out of bounds of your knowledge.
        Format responses using markdown where apllicable and don't return images.
        ----------------
        START CONTEXT
        ${docContext}
        END CONTEXT 
        ---------------
        QUESTION: ${latestMsg}
        ---------------
        `,
    };

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [template, ...messages],
    });

    return result.toDataStreamResponse();
    // return new StreamingTextResponse(result.toAIStream())
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   stream: true,
    //   messages: [template, ...messages],
    // });

    // const stream = streamText(response);
    // return stream.toDataStreamResponse();
  } catch (err) {
    // console.log("Error querying db...");
    throw err;
  }
}
