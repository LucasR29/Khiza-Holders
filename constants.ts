import { createPublicClient, http } from "viem"
import { polygon } from "viem/chains"

export const transport = "https://polygon-mainnet.infura.io/v3/3ed770669de449cdb904f374c46f1a1d"

export const address = "0x25856d46748ee959f99a0fbbb5312c73473cb533"

export const client = createPublicClient({
    chain: polygon,
    transport: http(transport)
})

export const transfer_event = {
    name: "Transfer",
    inputs: [
        { type: 'address', indexed: true, name: "from" },
        { type: 'address', indexed: true, name: "to" },
        { type: 'uint256', indexed: true, name: "value" },
    ],
    type: 'event',
}