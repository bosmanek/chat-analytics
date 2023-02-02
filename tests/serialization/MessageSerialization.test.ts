import { Message } from "@pipeline/process/Types";
import { BitStream } from "@pipeline/serialization/BitStream";
import { DefaultMessageBitConfig, readMessage, writeMessage } from "@pipeline/serialization/MessageSerialization";

describe("obj -> (serialize) -> (deserialize) -> obj", () => {
    const cases: Message[] = [
        {
            day: 123,
            secondOfDay: 4,
            authorIndex: 8,
            langIndex: 11,
            sentiment: 14,
            replyOffset: 17,
        },
        {
            day: 456,
            secondOfDay: 6,
            authorIndex: 9,
            langIndex: 12,
            sentiment: 15,
            words: [
                [8, 9],
                [10, 11],
            ],
        },
        // prettier-ignore
        {
            day: 789,
            secondOfDay: 7,
            authorIndex: 10,
            langIndex: 13,
            sentiment: 16,
            words: [[8, 1], [10, 2]],
            emojis: [[12, 3], [14, 4], [16, 5]],
            mentions: [[30, 1], [32, 2], [34, 3]],
            reactions: [[24, 4], [26, 5], [28, 1]],
            domains: [[36, 2], [38, 3], [40, 4]],
            attachments: [[0, 5], [1, 1], [2, 2]],
        },
    ];

    test.each(cases)("%p", (message) => {
        const stream = new BitStream();
        writeMessage(message, stream, DefaultMessageBitConfig);
        stream.offset = 0;
        const gotObj = readMessage(stream, DefaultMessageBitConfig);
        expect(gotObj).toStrictEqual(message);
    });
});
