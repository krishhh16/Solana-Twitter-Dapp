import Link from 'next/link';
import WalletConnect from './WalletConnect';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#15202B] text-white">
      <aside className="w-64 border-r border-[#38444D] p-4">
        <nav className="space-y-4">
          <div className="mb-4">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
              <g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g>
            </svg>
          </div>
          <Link href="/" className="flex items-center space-x-4 p-2 hover:bg-#192734 rounded-full">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <g><path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.355-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path><path d="M8.22 12.184c0 2.084 1.695 3.78 3.78 3.78s3.78-1.696 3.78-3.78-1.695-3.78-3.78-3.78-3.78 1.696-3.78 3.78zm6.06 0c0 1.258-1.022 2.28-2.28 2.28s-2.28-1.022-2.28-2.28 1.022-2.28 2.28-2.28 2.28 1.022 2.28 2.28z"></path></g>
            </svg>
            <span>Home</span>
          </Link>
          {/* Add other menu items similarly */}
        </nav>
      </aside>
      <main className="flex-1">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>
      <aside className="w-80 p-4 border-l border-#38444D">
        <div className="mb-4">
          <input type="text" placeholder="Search" className="w-full bg-[#192734] text-white p-2 rounded-full" />
        </div>
        <div className="bg-#192734 rounded-xl p-4 mb-4">
          {<WalletConnect/>}
        </div>
        <div className="bg-#192734 rounded-xl p-4">
          <h2 className="font-bold mb-2">What's happening</h2>
          {/* Add trending topics here */}
        </div>
      </aside>
    </div>
  );
}