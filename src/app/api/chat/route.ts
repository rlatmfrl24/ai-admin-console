import { ChatAnswer } from "@/lib/types/chat";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

function makeMockJson() {
  return JSON.stringify({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    profile: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleName: faker.person.middleName(),
      gender: faker.person.sex(),
      bio: faker.person.bio(),
      jobTitle: faker.person.jobTitle(),
      jobArea: faker.person.jobArea(),
      jobType: faker.person.jobType(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      company: {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.buzzPhrase(),
        department: faker.commerce.department(),
        product: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
      },
      social: {
        website: faker.internet.url(),
        linkedin: faker.internet.url(),
        twitter: faker.internet.url(),
        github: faker.internet.url(),
      },
      preferences: {
        language: faker.helpers.arrayElement(["ko", "en", "ja", "zh"]),
        timezone: faker.location.timeZone(),
        currency: faker.finance.currencyCode(),
        theme: faker.helpers.arrayElement(["light", "dark", "auto"]),
      },
      statistics: {
        loginCount: faker.number.int({ min: 1, max: 1000 }),
        lastLogin: faker.date.recent(),
        totalSpent: faker.number.float({
          min: 0,
          max: 10000,
          fractionDigits: 2,
        }),
        ordersCount: faker.number.int({ min: 0, max: 100 }),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      },
      metadata: {
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        version: faker.system.semver(),
        tags: Array.from(
          { length: faker.number.int({ min: 3, max: 10 }) },
          () =>
            faker.helpers.arrayElement([
              "premium",
              "basic",
              "enterprise",
              "trial",
              "verified",
              "active",
            ])
        ),
        permissions: Array.from(
          { length: faker.number.int({ min: 5, max: 15 }) },
          () =>
            faker.helpers.arrayElement([
              "read",
              "write",
              "delete",
              "admin",
              "moderate",
              "publish",
            ])
        ),
        notifications: {
          email: faker.datatype.boolean(),
          sms: faker.datatype.boolean(),
          push: faker.datatype.boolean(),
          marketing: faker.datatype.boolean(),
        },
      },
      activities: Array.from(
        { length: faker.number.int({ min: 5, max: 20 }) },
        () => ({
          id: faker.string.uuid(),
          type: faker.helpers.arrayElement([
            "login",
            "logout",
            "purchase",
            "view",
            "search",
            "update",
          ]),
          description: faker.lorem.sentence(),
          timestamp: faker.date.recent(),
          ip: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          location: {
            country: faker.location.country(),
            city: faker.location.city(),
          },
        })
      ),
      subscriptions: Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        () => ({
          id: faker.string.uuid(),
          plan: faker.helpers.arrayElement([
            "basic",
            "premium",
            "enterprise",
            "pro",
          ]),
          status: faker.helpers.arrayElement([
            "active",
            "cancelled",
            "expired",
            "pending",
          ]),
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          price: faker.number.float({
            min: 9.99,
            max: 999.99,
            fractionDigits: 2,
          }),
          features: Array.from(
            { length: faker.number.int({ min: 3, max: 8 }) },
            () =>
              faker.helpers.arrayElement([
                "unlimited_storage",
                "priority_support",
                "advanced_analytics",
                "custom_branding",
              ])
          ),
        })
      ),
      documents: Array.from(
        { length: faker.number.int({ min: 3, max: 12 }) },
        () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          type: faker.helpers.arrayElement([
            "pdf",
            "doc",
            "txt",
            "html",
            "json",
          ]),
          size: faker.number.int({ min: 1024, max: 10485760 }), // 1KB to 10MB
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          tags: Array.from(
            { length: faker.number.int({ min: 1, max: 4 }) },
            () => faker.lorem.word()
          ),
          isPublic: faker.datatype.boolean(),
          downloadCount: faker.number.int({ min: 0, max: 1000 }),
        })
      ),
    },
    settings: {
      privacy: {
        profileVisibility: faker.helpers.arrayElement([
          "public",
          "private",
          "friends",
        ]),
        showEmail: faker.datatype.boolean(),
        showPhone: faker.datatype.boolean(),
        allowMessages: faker.datatype.boolean(),
      },
      security: {
        twoFactorEnabled: faker.datatype.boolean(),
        lastPasswordChange: faker.date.recent(),
        loginAlerts: faker.datatype.boolean(),
        sessionTimeout: faker.number.int({ min: 15, max: 480 }), // minutes
      },
      appearance: {
        fontSize: faker.helpers.arrayElement(["small", "medium", "large"]),
        colorScheme: faker.helpers.arrayElement(["light", "dark", "auto"]),
        language: faker.helpers.arrayElement(["ko", "en", "ja", "zh"]),
        dateFormat: faker.helpers.arrayElement([
          "MM/DD/YYYY",
          "DD/MM/YYYY",
          "YYYY-MM-DD",
        ]),
      },
    },
  });
}

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
          previewFiles: [
            "/0430231ea47fe9e4f4797fee3ed8f8d7e5085cf6.png",
            ...Array.from(
              { length: faker.number.int({ min: 0, max: 3 }) },
              (_, i) => {
                const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"><rect width=\"200\" height=\"200\" fill=\"${faker.color.rgb()}\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"14\" fill=\"#ffffff\">Mock ${
                  i + 1
                }</text></svg>`;
                const base64 = Buffer.from(svg).toString("base64");
                return `data:image/svg+xml;base64,${base64}`;
              }
            ),
          ],
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
            json: makeMockJson(),
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
          additionalInfo: {
            updatedAt: faker.date.recent(),
            isActive: faker.helpers.arrayElement([true, false]),
            isVerified: faker.helpers.arrayElement([true, false]),
            isAdmin: faker.helpers.arrayElement([true, false]),
            isStaff: faker.helpers.arrayElement([true, false]),
            isSuperuser: faker.helpers.arrayElement([true, false]),
          },
        };
      case "chat":
        return {
          ...base,
          sourceType: "chat" as const,
          context: Array.from(
            { length: faker.number.int({ min: 1, max: 4 }) },
            () => faker.lorem.word()
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
