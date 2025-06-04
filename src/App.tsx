import { sdk } from '@farcaster/frame-sdk'
import { useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { config } from './wagmi'
import { switchChain } from 'wagmi/actions'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { writeContract, isSuccess } = useWriteContract()

  // Connect wallet or switch chain
  useEffect(() => {
    if (isConnected) {
      switchChain(config, { chainId: config.chains[0].id })
    } else {
      connect({ connector: connectors[0] })
    }
  }, [isConnected])

  // Farcaster frame ready
  useEffect(() => {
    sdk.actions.ready()
  }, [])

  // Read balanceOf
  const { data: balanceOf, refetch: refetchBalanceOf } = useReadContract({
    address: '0xA14a8CA4655B8FB7De57Df22468c4B66c53b3e1d',
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: '', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  // Read totalSupply
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: '0xA14a8CA4655B8FB7De57Df22468c4B66c53b3e1d',
    abi: [
      {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'totalSupply',
    args: [],
  })

  // Refresh supply every 7s
  useEffect(() => {
    if (!totalSupply) return
    const id = setInterval(refetchTotalSupply, 7000)
    return () => clearInterval(id)
  }, [totalSupply])

  // Success alert
  useEffect(() => {
    if (!isSuccess) return
    alert('You minted your NFT!')
    refetchBalanceOf()
    refetchTotalSupply()
  }, [isSuccess])

  // Optional: auto-reconnect inside iframe
  useEffect(() => {
    let id: number
    if (!isConnected && window.self !== window.top) {
      id = setInterval(() => {
        connect({ connector: connectors[0] })
      }, 1500)
    }
    return () => clearInterval(id)
  }, [isConnected])

  // Mint handler
  const handleMint = async (amount: number) => {
    await switchChain(config, { chainId: config.chains[0].id })
    writeContract({
      abi: [
        {
          type: 'function',
          name: 'mint',
          inputs: [{ name: 'quantity', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
      address: '0xA14a8CA4655B8FB7De57Df22468c4B66c53b3e1d',
      functionName: 'mint',
      args: [BigInt(amount)],
    })
  }

  return (
    <>
      <main className='flex flex-col gap-10 w-full sm:max-w-xs flex-1'>
        <div className='flex-col flex gap-6'>
          <h1 className='font-bold text-center text-5xl'>WTF </h1>

          <h3 className='font-bold text-2xl text-center tabular-nums'>
            {(totalSupply ?? 0).toLocaleString()} minted
          </h3>

          <div className='flex px-4'>
            <img
              className='rounded-2xl aspect-square drop-shadow-[0px_0px_1rem_#2d235acc]'
              src='/warpcast-to-farcaster.avif'
            />
          </div>

          <h3 className='font-bold text-2xl text-center tabular-nums'>
            Youe WTF minted: x{balanceOf?.toString() || '?'}
          </h3>
        </div>

        {isConnected ? (
  <>
    <div className='flex flex-col gap-3'>
      {[1, 10, 100, 1000, 3000].map((amount) => (
        <button
          key={amount}
          onClick={() => handleMint(amount)}
          className='bg-[#362e6f] text-white font-semibold text-2xl h-14 px-7 rounded-2xl drop-shadow-[0px_0px_1rem_#2d235acc]'
        >
          Mint {amount}
        </button>
      ))}
    </div>

    <a
      href="https://warpcast-to-farcaster.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#362e6f] text-white text-center font-semibold text-lg h-12 px-5 mt-4 rounded-xl drop-shadow-[0px_0px_0.5rem_#2d235acc] hover:bg-[#4b3fa3]"
    >
      Share on Farcaster
    </a>
  </>
) : (
  <div className='flex px-4 flex-col'>
    <a
      href='https://warpcast-to-farcaster.vercel.app'
      className='bg-[#362e6f] text-white flex justify-center items-center font-semibold text-2xl h-14 px-7 rounded-2xl drop-shadow-[0px_0px_1rem_#2d235acc]'
    >
      Open in Warpcast
    </a>
  </div>
)}
      </main>

      <footer className='flex flex-col gap-12 w-full items-center text-center'>
        <div className='flex items-center gap-6'>
          <a
  href="https://x.com/Dkumar_19"
  target="_blank"
  rel="noopener noreferrer"
  className="w-8 h-8 text-black hover:text-gray-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.03 3H17.3l-4.55 5.82L8.64 3H3.97l6.86 9.28L3.42 21h2.72l5.07-6.46 4.99 6.46h4.73l-7.3-9.91L20.03 3z" />
  </svg>
</a>
        </div>
      </footer>
    </>
  )
}

export default App
