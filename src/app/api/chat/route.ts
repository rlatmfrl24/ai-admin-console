import { ChatAnswer } from "@/lib/types/chat";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

function makeMockResponseMessage(): ChatAnswer {
  const sourceCount = faker.number.int({ min: 1, max: 10 });
  const sources = Array.from({ length: sourceCount }, (_, index) => ({
    sourceType: faker.helpers.arrayElement(["retrieval", "api", "chat", "pim"]),
    sourceId: faker.string.uuid(),
    sourceName: faker.lorem.sentence(),
    sourceMessage: {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
    },
    sourceDescription: faker.lorem.paragraph(),
    duration: faker.number.int({ min: 1000, max: 10000 }),
    sourceRank: index + 1,
  }));

  return {
    chatId: faker.string.uuid(),
    message: faker.lorem.paragraph(),
    role: "assistant",
    intent: {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      keywords: Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        () => faker.lorem.word()
      ),
    },
    createdAt: new Date(),
    duration: faker.number.int({ min: 1000, max: 10000 }),
    sources: sources,
  };
}

export async function POST(request: Request) {
  const { message } = await request.json();
  console.log("message::", message);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json({ message: makeMockResponseMessage() });
}
