import { Address, GetLogsReturnType, isAddress} from "viem"
import _ from 'lodash'
import { KhizaABI } from "./khiza_abi";
import { client, address, transfer_event } from "./constants";


async function getHoldersBalance() {
    const logs = await getLogs()

    const holders = getHolders(logs)

    const unsorted_holders: any[] = []

    await Promise.all(holders.map(async (holder) => {
        const balance: any = await client.readContract({
            address,
            abi: KhizaABI,
            functionName: 'balanceOf',
            args: [holder]
        })

        if(balance > 1n) {
            unsorted_holders.push([holder, balance])
        }
    }))

    const holders_balance = sortHoldersBalance(unsorted_holders)

    console.log(holders_balance)
    console.log(Object.keys(holders_balance).length)
}

function sortHoldersBalance(array: any[]) {
    const holders_balance: Record<string, any> = {}

    array.sort((a, b) => {
        if(a[1] > b[1]) {
            return -1;
          } else if (a[1] < b[1]){
            return 1;
          } else {
            return 0;
          }
    })

    array.forEach((pair) => {
        holders_balance[pair[0]] = pair[1]
    })

    return holders_balance
}

async function getLogs(): Promise<GetLogsReturnType> {
    const logs = await client.getLogs({
        address,
        fromBlock: 1n,
        events: [
            transfer_event
        ],
    })

    return logs
}

function getHolders(logs: GetLogsReturnType) {
    const chunks = _.chunk(logs, 50)

    const holders: Set<string> = new Set()

    chunks.forEach((chunk) => {
        chunk.forEach((log) => {
            const from = formatAddress(log.topics[1] as string)

            const to = formatAddress(log.topics[2] as string)
                        
            if(log.topics[1])
                isAddress(from) ? holders.add(from) : null
            
            if(log.topics[2])
                isAddress(to) ? holders.add(to) : null
        })
    })

    const holders_array = Array.from(holders)

    return holders_array
}

function formatAddress(address: string) {
    return _.split(address, "000000000000000000000000").join("") as Address
}

getHoldersBalance()