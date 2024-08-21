"use client"

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PostCreator from '@/components/postCreator';
import idl from "./idl.json"
import {SendTweets} from "./Typp"
import { Provider, AnchorProvider, web3, utils, BN, Wallet, setProvider, Program,  } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface Tweets {
  publicKey: PublicKey,
  account: {
    author: PublicKey,
    timestamp: BN,
    topic: string,
    content: string
  }
}

const idl_object = JSON.parse(JSON.stringify(idl))

export default function Home() {
  const ourWallet = useWallet();
  const {connection} = useConnection();
  const [tweets, setTweets] = useState<Tweets[]|null>(null)

  const getProvider = () => {
    const provider = new AnchorProvider(connection, ourWallet, AnchorProvider.defaultOptions());
    setProvider(provider);
    const program = new Program<SendTweets>(idl_object, provider);
    return program;
  }

  const fetchAllTweets = async () => {
        const program = getProvider();
        const tweets = await program.account.tweet.all();
        console.log(tweets)
        setTweets(tweets)
  }

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllTweets();
    setLoading(true)
  }, [])

  if (!loading) {
    return null
  }

  return (
    <Layout>
      <div className="border-b border-twitter-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">For you</h1>
          <button className="text-twitter-blue">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <g><path d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path></g>
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <PostCreator />
        </div>
        <div className="">
          {
            tweets &&
            tweets.map((tweet, ix) => {
              return (
                <div key={ix} className="p-4 bg-gray-800 rounded-lg mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <h1 className="text-white text-lg font-semibold">
                          {tweet.account.topic}
                        </h1>
                        <span className="text-gray-400 text-sm">• {new Date(tweet.account.timestamp * 1000).toLocaleString()}</span>
                      </div>
                      <p className="text-white text-sm">
                        {tweet.account.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
            
          }
        </div>
      </div>
      {/* Add tweet feed here */}
    </Layout>
  );
}