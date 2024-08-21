import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolTalks } from "../target/types/sol_talks";
import * as assert from "assert";
import * as bs58 from "bs58";

describe("sol_talks", () => {
  // Calling the instruction SendTweet
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolTalks as Program<SolTalks>;

  it("can send a tweet", async () => {
    const tweet = anchor.web3.Keypair.generate();
    await program.rpc.sendTweet('web3-solana', 'welcome to solana!', {
      accounts: {
        tweet: tweet.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [tweet],
    });

    // Fetch account details of created tweets
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    // Ensure if it's correct.
    assert.equal(tweetAccount.author.toBase58(),program.provider.wallet.publicKey.toBase58());
    assert.equal(tweetAccount.topic, 'web3-solana');
    assert.equal(tweetAccount.content,'welcome to solana!');
    assert.ok(tweetAccount.timestamp);
  })

  it("can send a tweet without topic",async ()=>{
    const tweet = anchor.web3.Keypair.generate();
    await program.rpc.sendTweet('','gm',{
      accounts:{
        tweet: tweet.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [tweet],
    })

    // Fetching from blockchain
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    // Ensure if it's correct
    assert.equal(tweetAccount.author.toBase58(),program.provider.wallet.publicKey.toBase58());
    assert.equal(tweetAccount.topic,'');
    assert.equal(tweetAccount.content,'gm');
    assert.ok(tweetAccount.timestamp);
  })

  it("can send a tweet from a different author",async ()=>{
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey,1000000000);
    await program.provider.connection.confirmTransaction(signature);

    const tweet = anchor.web3.Keypair.generate();
    await program.rpc.sendTweet('vegan','Tofuu is yum',{
      accounts:{
        tweet: tweet.publicKey,
        author: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [otherUser, tweet]
    });

    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    assert.equal(tweetAccount.author.toBase58(),otherUser.publicKey.toBase58());
    assert.equal(tweetAccount.topic,'vegan');
    assert.equal(tweetAccount.content,'Tofuu is yum');
    assert.ok(tweetAccount.timestamp);
  })

  it("cannot provide a topic with more than 50 characters", async ()=>{
    try{
      const tweet = anchor.web3.Keypair.generate();
    const topicWith51Chars = 'h'.repeat(51);

    await program.rpc.sendTweet('vegan','i wont eat animals',{
      accounts:{
        tweet: tweet.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [tweet],
    })
    }catch(error){
      assert.equal(error.msg,'The provided topic exceeds the allowed length');
      return;
    }
    assert.fail('The instruction should have failed with len 51.');
  })

  it('cannot provide a content with more than 280 characters', async () => {
    try {
        const tweet = anchor.web3.Keypair.generate();
        const contentWith281Chars = 'x'.repeat(281);
        await program.rpc.sendTweet('veganism', contentWith281Chars, {
            accounts: {
                tweet: tweet.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [tweet],
        });
    } catch (error) {
        assert.equal(error.msg, 'The provided content should be 280 characters long maximum.');
        return;
    }

    assert.fail('The instruction should have failed with a 281-character content.');
});

it("can fetch all the tweets",async ()=>{
  // this is to retrieve all the tweets.
  const tweetAccounts = await program.account.tweet.all();
  
  assert.equal(tweetAccounts.length,4);
})

it("can filter tweets by author",async ()=>{
  const authorPublicKey = program.provider.wallet.publicKey;
  // this is to retrieve all the tweets.
  const tweetAccounts = await program.account.tweet.all([{
    memcmp: {
      offset: 8,
      bytes:authorPublicKey.toBase58(),
    }
  }]);

  assert.equal(tweetAccounts.length,3);
  assert.ok(tweetAccounts.every(tweetAccount => {
    return tweetAccount.account.author.toBase58() === authorPublicKey.toBase58();
  }))
})

it("can filter tweets by topic",async ()=>{
  const authorPublicKey = program.provider.wallet.publicKey;
  // this is to retrieve all the tweets.
  const tweetAccounts = await program.account.tweet.all([{
    memcmp: {
      offset: 8 + 32 + 8 + 4,
      bytes:bs58.encode(Buffer.from('vegan')),
    }
  }]);
  console.log(tweetAccounts);
  assert.equal(tweetAccounts.length,2);
  assert.ok(tweetAccounts.every(tweetAccount => {
    return tweetAccount.account.topic === 'vegan';
  }))
})
});
