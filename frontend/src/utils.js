

export const GetIpfsUrlFromPinata = (pinataUrl) => {
    var IPFSUrl = pinataUrl.split("/");
    const lastIndex = IPFSUrl.length;
    IPFSUrl = "https://cloudflare-ipfs.com/ipfs/"+IPFSUrl[lastIndex-1];
    return IPFSUrl;
};