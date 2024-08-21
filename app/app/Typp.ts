export type SendTweets = {
    "address": "J3gr33G9u4Maj6GEZ6Zcxm7EQB4GhNJrJ4SUPg1L3jMH",
    "metadata": {
      "name": "sendTweets",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "sendTweet",
        "discriminator": [
          179,
          213,
          79,
          165,
          123,
          247,
          82,
          109
        ],
        "accounts": [
          {
            "name": "tweets",
            "writable": true,
            "signer": true
          },
          {
            "name": "author",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "topic",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "tweet",
        "discriminator": [
          229,
          13,
          110,
          58,
          118,
          6,
          20,
          79
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "invalidArgLength",
        "msg": "Invalid argument length"
      }
    ],
    "types": [
      {
        "name": "tweet",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "author",
              "type": "pubkey"
            },
            {
              "name": "timestamp",
              "type": "i64"
            },
            {
              "name": "topic",
              "type": "string"
            },
            {
              "name": "content",
              "type": "string"
            }
          ]
        }
      }
    ]
  };