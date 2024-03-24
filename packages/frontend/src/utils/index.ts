/**
 * Truncates an address into a shorter representation by displaying the first `digits` character
 * and the last `digits` characters.
 */
export const shortenAddress = (address?: `0x${string}` | null, digits = 5) => {
    if (!address) return ""
    return address.substring(0, digits) + "..." + address.substring(address.length - digits)
}

export const secondsSinceEpoch = () => {
    return Math.floor(Date.now() / 1000)
}
