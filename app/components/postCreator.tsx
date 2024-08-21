import { SendTweets } from '@/app/Typp';
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import idl from "../app/idl.json"
import { Keypair, PublicKey } from '@solana/web3.js';
import {web3} from "@project-serum/anchor"

const idl_object = JSON.parse(JSON.stringify(idl))
const program_id  = new PublicKey(idl.address);

const PostCreator = () => {
  const [postContent, setPostContent] = useState('');
  const [tweetTitle, setTweetTitle] = useState('');
  const ourWallet = useWallet();
  const {connection} = useConnection();

  const getProvider = () => {
    const provider = new AnchorProvider(connection, ourWallet, AnchorProvider.defaultOptions());
    setProvider(provider);
    return provider;
  }



  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPostContent(content);
    console.log(content)
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setTweetTitle(title);
    console.log(title, title.length)
  };

  const handlePost = async () => {
      // Here you would typically send the post to your backend
      console.log('Posting:', { title: tweetTitle, content: postContent });

      if (postContent.length > 280 || tweetTitle.length > 50) {
        alert("Invalid length of topic or content")
        return
      }

      const provider = getProvider();
      const program = new Program<SendTweets>(idl_object, provider);
      const tweet = web3.Keypair.generate();
      await program.methods.sendTweet(tweetTitle, postContent)
      .accountsStrict({
        author: provider.publicKey,
        tweets: tweet.publicKey,
        systemProgram: web3.SystemProgram.programId
      })    
      .signers([tweet])
      .rpc();

      console.log("Yeppie!, you posted your tweet to the devnet")

      // Reset the input fields after posting
      setPostContent('');
      setTweetTitle('');
    
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0"></div>
        <div className="flex-grow">
          <input
            type="text"
            className="w-full bg-transparent text-white text-sm mb-2 outline-none"
            placeholder="Title"
            value={tweetTitle}
            onChange={handleTitleChange}
          />
          <textarea
            className="w-full bg-transparent text-white text-xl resize-none outline-none"
            placeholder="What is happening?"
            rows={3}
            value={postContent}
            onChange={handleContentChange}
          />
         
        </div>
        <div className="mt-8">
          <button onClick={() => {
            handlePost();
          }} disabled={tweetTitle.length > 50 ||postContent.length > 280} className="w-full bg-twitter-blue text-white py-3 px-4 rounded-full hover:bg-blue-600 font-bold">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
