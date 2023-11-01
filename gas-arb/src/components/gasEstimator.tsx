import { utils, providers } from "ethers";
import { addDefaultLocalNetwork } from "@arbitrum/sdk";
import { NodeInterface__factory } from "@arbitrum/sdk/dist/lib/abi/factories/NodeInterface__factory";
import { NODE_INTERFACE_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";

interface GasEstimatorProps {
  destinationAddress: string;
  txData: string;
}

// ... (other imports and constants remain the same)

const GasEstimator: React.FC<GasEstimatorProps> = ({
  destinationAddress,
  txData,
}) => {
  const baseL2Provider = new providers.StaticJsonRpcProvider(
    "https://arb1.arbitrum.io/rpc"
  );

  //const destinationAddress = "0xae967d8b708dc981d74d6c2259295735077c8d9e";

  //const txData = "0x";

  const gasEstimator = async () => {
    //addDefaultLocalNetwork();

    // Instantiation of the NodeInterface object
    const nodeInterface = NodeInterface__factory.connect(
      NODE_INTERFACE_ADDRESS,
      baseL2Provider
    );

    // Getting the estimations from NodeInterface.GasEstimateComponents()
    // ------------------------------------------------------------------
    const gasEstimateComponents =
      await nodeInterface.callStatic.gasEstimateComponents(
        destinationAddress,
        false,
        txData,
        {
          blockTag: "latest",
        }
      );

    // Getting useful values for calculating the formula
    const l1GasEstimated = gasEstimateComponents.gasEstimateForL1;
    const l2GasUsed = gasEstimateComponents.gasEstimate.sub(
      gasEstimateComponents.gasEstimateForL1
    );
    const l2EstimatedPrice = gasEstimateComponents.baseFee;
    const l1EstimatedPrice = gasEstimateComponents.l1BaseFeeEstimate.mul(16);

    // Calculating some extra values to be able to apply all variables of the formula
    // -------------------------------------------------------------------------------
    // NOTE: This one might be a bit confusing, but l1GasEstimated (B in the formula) is calculated based on l2 gas fees
    const l1Cost = l1GasEstimated.mul(l2EstimatedPrice);
    // NOTE: This is similar to 140 + utils.hexDataLength(txData);
    const l1Size = l1Cost.div(l1EstimatedPrice);

    // Getting the result of the formula
    // ---------------------------------
    // Setting the basic variables of the formula
    const P = l2EstimatedPrice;
    const L2G = l2GasUsed;
    const L1P = l1EstimatedPrice;
    const L1S = l1Size;

    // L1C (L1 Cost) = L1P * L1S
    const L1C = L1P.mul(L1S);

    // B (Extra Buffer) = L1C / P
    const B = L1C.div(P);

    // G (Gas Limit) = L2G + B
    const G = L2G.add(B);

    // TXFEES (Transaction fees) = P * G
    const TXFEES = P.mul(G);

    console.log("Gas estimation components");
    console.log("-------------------");
    console.log(
      `Full gas estimation = ${gasEstimateComponents.gasEstimate.toNumber()} units`
    );
    console.log(`L2 Gas (L2G) = ${L2G.toNumber()} units`);
    console.log(`L1 estimated Gas (L1G) = ${l1GasEstimated.toNumber()} units`);

    console.log(`P (L2 Gas Price) = ${utils.formatUnits(P, "gwei")} gwei`);
    console.log(
      `L1P (L1 estimated calldata price per byte) = ${utils.formatUnits(
        L1P,
        "gwei"
      )} gwei`
    );
    console.log(`L1S (L1 Calldata size in bytes) = ${L1S} bytes`);

    console.log("-------------------");
    console.log(
      `Transaction estimated fees to pay = ${utils.formatEther(TXFEES)} ETH`
    );
  };

  

  return <p>1 unit of gas = </p>
};

export default GasEstimator;
