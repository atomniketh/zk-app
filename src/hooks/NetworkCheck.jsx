import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function useEtherNetwork() {
  this.state = {
    currentNetwork: "",
  };
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    async function detectNetwork() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      setCurrentNetwork(network);
    }

    // Detect network on initial mount
    detectNetwork();

    // Listen to network changes
    window.ethereum.on('chainChanged', detectNetwork);

    // Clean up the event listener
    return () => {
      window.ethereum.removeListener('chainChanged', detectNetwork);
    };
  }, []);

  return currentNetwork;
}
export default useEtherNetwork;