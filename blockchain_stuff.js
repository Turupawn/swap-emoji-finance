const NETWORK_ID = 534351

const DEX_ADDRESS = "0x6Ed6Aa6Cc32A302358F096Ad55dC484CB2622F93"
const DEX_ABI_PATH = "./json_abi/DEX.json"
var dex_contract

const ERC20A_ADDRESS = "0x6E1e71ABa2961264C3F80b86FEeE9758E98533e2"
const ERC20B_ADDRESS = "0x780ce8C009284F253505CCd53eb8f5477a84a988"
const ERC20_ABI_PATH = "./json_abi/ERC20.json"
var erc20a_contract
var erc20b_contract

var accounts
var web3

var liquidityA
var liquidityB

function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se cambió el account, refrescando...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se el network, refrescando...";
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        window.location.reload()
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Porfavor conéctate a Metamask";
      }
    }else
    {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

const getContract = async (web3, address, abi_path) => {
  const response = await fetch(abi_path);
  const data = await response.json();
  
  const netId = await web3.eth.net.getId();
  contract = new web3.eth.Contract(
    data,
    address
    );
  return contract
}

async function loadDapp() {
  metamaskReloadCallback()
  document.getElementById("web3_message").textContent="Please connect to Metamask"
  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        var awaitContract = async function () {
          dex_contract = await getContract(web3, DEX_ADDRESS, DEX_ABI_PATH)
          erc20a_contract = await getContract(web3, ERC20A_ADDRESS, ERC20_ABI_PATH)
          erc20b_contract = await getContract(web3, ERC20A_ADDRESS, ERC20_ABI_PATH)
          document.getElementById("web3_message").textContent="You are connected to Metamask"
          onContractInitCallback()
          web3.eth.getAccounts(function(err, _accounts){
            accounts = _accounts
            if (err != null)
            {
              console.error("An error occurred: "+err)
            } else if (accounts.length > 0)
            {
              onWalletConnectedCallback()
              document.getElementById("account_address").style.display = "block"
            } else
            {
              document.getElementById("connect_button").style.display = "block"
            }
          });
        };
        awaitContract();
      } else {
        document.getElementById("web3_message").textContent="Please connect to Goerli";
      }
    });
  };
  awaitWeb3();
}

async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" })
  accounts = await web3.eth.getAccounts()
  onWalletConnectedCallback()
}

loadDapp()

const onContractInitCallback = async () => {
  liquidityA = BigInt(await erc20a_contract.methods.balanceOf(DEX_ADDRESS).call())
  liquidityB = BigInt(await erc20b_contract.methods.balanceOf(DEX_ADDRESS).call())
  var k = liquidityA * liquidityB
  var contract_state = "Balance A: " + liquidityA
      + ", Balance B: " + liquidityB
      + ", k: " + k
  document.getElementById("contract_state").textContent = contract_state;
  return
  var last_writer = await my_contract.methods.count().call()

  
}

const onWalletConnectedCallback = async () => {

    return
}

async function onValueChanged(amountTokenOut) {
  amountTokenOut = BigInt(web3.utils.toWei(amountTokenOut))
  let amountTokenIn = (liquidityA * amountTokenOut)/(liquidityB - amountTokenOut)
  if(amountTokenOut>liquidityB)
  {
    document.getElementById("_A_AtoB").value = "Not enough liquidity for this trade";
    return;
  }
  document.getElementById("_A_AtoB").value = web3.utils.fromWei(""+amountTokenIn);
}


//// Functions ////

const swapAToB = async (amountTokenOut) => {
  amountTokenOut = BigInt(web3.utils.toWei(amountTokenOut))
  let amountTokenIn = (liquidityA * amountTokenOut)/(liquidityB - amountTokenOut)
  const slippage = BigInt(web3.utils.toWei("1.003")); // (0.1%)
  amountTokenIn = amountTokenIn*slippage/BigInt(web3.utils.toWei("1"));;
  console.log(amountTokenIn)
  console.log(amountTokenOut)
  const result = await dex_contract.methods.aButtonBButton(amountTokenIn, amountTokenOut)
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}