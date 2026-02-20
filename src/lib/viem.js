import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { POLYGON_RPC_URL } from "../constant/polymarket";

export const publicClient = createPublicClient({
    chain: polygon,
    transport: http(POLYGON_RPC_URL),
});
