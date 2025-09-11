import { ChatAnswer } from "@/lib/types/chat";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

function makeMockResponseMessage(): ChatAnswer {
  const sourceCount = faker.number.int({ min: 1, max: 10 });
  const sources = Array.from({ length: sourceCount }, (_, index) => ({
    sourceType: faker.helpers.arrayElement(["retrieval", "api", "chat", "pim"]),
    sourceId: faker.string.uuid(),
    sourceName: {
      title: faker.lorem.sentence(),
      name: faker.lorem.sentence(),
    },
    sourceMessage: faker.lorem.paragraphs(),
    duration: faker.number.int({ min: 1000, max: 10000 }),
    sourceRank: index + 1,
  }));

  return {
    chatId: faker.string.uuid(),
    message: faker.lorem.paragraph(),
    role: "assistant",
    intent: faker.lorem.sentence(),
    createdAt: new Date(),
    duration: faker.number.int({ min: 1000, max: 10000 }),
    sources: sources,
  };
}

export async function POST(request: Request) {
  const { message } = await request.json();
  console.log(message);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json({ message: makeMockResponseMessage() });
}
