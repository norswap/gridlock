const GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
const GATEWAY_KEY = process.env.NEXT_PUBLIC_PINATA_GATEWAY_KEY

export function pinataURL(cid: string) {
    return `${GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${GATEWAY_KEY}`
}
