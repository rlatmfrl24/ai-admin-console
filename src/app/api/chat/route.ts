import { ChatAnswer } from "@/lib/types/chat";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

function makeMockResponseMessage(): ChatAnswer {
  const sourceCount = faker.number.int({ min: 1, max: 10 });
  const sources = Array.from({ length: sourceCount }, (_, index) => {
    const sourceType = faker.helpers.arrayElement([
      "retrieval",
      "api",
      "chat",
      "pim",
    ] as const);
    const base = {
      sourceType,
      sourceId: faker.string.uuid(),
      sourceName: faker.company.name(),
      sourceMessage: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
      },
      sourceDescription: faker.lorem.paragraph(),
      duration: faker.number.int({ min: 1000, max: 10000 }),
      sourceRank: index + 1,
    } as const;

    switch (sourceType) {
      case "retrieval":
        return {
          ...base,
          sourceType: "retrieval" as const,
          chunkName: faker.system.fileName(),
          previewFiles: Array.from(
            { length: faker.number.int({ min: 0, max: 3 }) },
            () =>
              new File([faker.lorem.paragraph()], faker.system.fileName(), {
                type: "text/plain",
              })
          ),
          keywords: Array.from(
            { length: faker.number.int({ min: 1, max: 5 }) },
            () => faker.lorem.word()
          ),
        };
      case "api":
        return {
          ...base,
          sourceType: "api" as const,
          specificFields: {
            endpoint: faker.internet.url(),
            method: faker.helpers.arrayElement([
              "GET",
              "POST",
              "PUT",
              "DELETE",
            ]),
            status: String(faker.number.int({ min: 200, max: 599 })),
            json: JSON.stringify({
              id: faker.string.uuid(),
              name: faker.person.fullName(),
              email: faker.internet.email(),
            }),
          },
        };
      case "pim":
        return {
          ...base,
          sourceType: "pim" as const,
          keywords: Array.from(
            { length: faker.number.int({ min: 1, max: 6 }) },
            () => faker.commerce.productAdjective()
          ),
        };
      case "chat":
        return {
          ...base,
          sourceType: "chat" as const,
          context: Array.from(
            { length: faker.number.int({ min: 1, max: 4 }) },
            () => faker.lorem.sentence()
          ),
        };
    }
  });

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
