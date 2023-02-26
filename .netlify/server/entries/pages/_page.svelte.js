import { c as create_ssr_component, b as add_attribute, d as each, e as escape, f as createEventDispatcher, i as is_promise, n as noop, v as validate_component, a as subscribe, h as add_styles } from "../../chunks/index2.js";
import MetaMaskOnBoarding from "@metamask/onboarding";
import { ethers } from "ethers";
import { r as readable } from "../../chunks/index.js";
var Mode = /* @__PURE__ */ ((Mode2) => {
  Mode2[Mode2["Whisper"] = 0] = "Whisper";
  Mode2[Mode2["Shout"] = 1] = "Shout";
  return Mode2;
})(Mode || {});
var OasisNetworkStatus = /* @__PURE__ */ ((OasisNetworkStatus2) => {
  OasisNetworkStatus2[OasisNetworkStatus2["INITIALIZING"] = 0] = "INITIALIZING";
  OasisNetworkStatus2[OasisNetworkStatus2["WALLET_NOT_CONNECTED"] = 1] = "WALLET_NOT_CONNECTED";
  OasisNetworkStatus2[OasisNetworkStatus2["PROVIDER_NOT_FOUND"] = 2] = "PROVIDER_NOT_FOUND";
  OasisNetworkStatus2[OasisNetworkStatus2["ON_DIFFERENT_NETWORK"] = 3] = "ON_DIFFERENT_NETWORK";
  OasisNetworkStatus2[OasisNetworkStatus2["ON_EMERALD_PARATIME"] = 4] = "ON_EMERALD_PARATIME";
  OasisNetworkStatus2[OasisNetworkStatus2["ON_SAPPHIRE_PARATIME"] = 5] = "ON_SAPPHIRE_PARATIME";
  return OasisNetworkStatus2;
})(OasisNetworkStatus || {});
const ModeToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { mode } = $$props;
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  return `<div class="${"btn-group w-100"}" role="${"group"}"><input type="${"radio"}" class="${"btn-check"}"${add_attribute("value", Mode.Whisper, 0)} name="${"btnradio"}" id="${"whisper"}" autocomplete="${"off"}"${Mode.Whisper === mode ? add_attribute("checked", true, 1) : ""}>
    <label class="${"btn btn-outline-primary"}" for="${"whisper"}"><i class="${"bi bi-suit-diamond-fill me-2"}"></i>Whisper</label>
  
    <input type="${"radio"}" class="${"btn-check"}"${add_attribute("value", Mode.Shout, 0)} name="${"btnradio"}" id="${"shout"}" autocomplete="${"off"}"${Mode.Shout === mode ? add_attribute("checked", true, 1) : ""}>
    <label class="${"btn btn-outline-success"}" for="${"shout"}"><i class="${"bi bi-gem me-2"}"></i>Shout</label></div>`;
});
const OASIS_EMERALD_TESTNET = {
  name: "Oasis Emerald Testnet",
  chainIdHex: "0xa515",
  chainIdDecimal: 42261,
  rpcUrls: ["https://testnet.emerald.oasis.dev"],
  blockExplorerUrls: ["https://testnet.explorer.emerald.oasis.dev"],
  nativeCurrency: {
    name: "TEST",
    symbol: "TEST",
    decimals: 18
  }
};
const OASIS_SAPPHIRE_TESTNET = {
  name: "Oasis Sapphire Testnet",
  chainIdHex: "0x5aff",
  chainIdDecimal: 23295,
  rpcUrls: ["https://testnet.sapphire.oasis.dev"],
  blockExplorerUrls: ["https://testnet.explorer.sapphire.oasis.dev"],
  nativeCurrency: {
    name: "TEST",
    symbol: "TEST",
    decimals: 18
  }
};
async function getOasisNetworkConnectionStatus() {
  try {
    if (!MetaMaskOnBoarding.isMetaMaskInstalled()) {
      return OasisNetworkStatus.PROVIDER_NOT_FOUND;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    if (!window.ethereum.selectedAddress) {
      return OasisNetworkStatus.WALLET_NOT_CONNECTED;
    }
    if (network.chainId.toString() === OASIS_EMERALD_TESTNET.chainIdDecimal.toString()) {
      return OasisNetworkStatus.ON_EMERALD_PARATIME;
    }
    if (network.chainId.toString() === OASIS_SAPPHIRE_TESTNET.chainIdDecimal.toString()) {
      return OasisNetworkStatus.ON_SAPPHIRE_PARATIME;
    }
    return OasisNetworkStatus.ON_DIFFERENT_NETWORK;
  } catch (error) {
    console.error(`An error occurred while trying to connect to the Oasis network: ${error}`);
    return OasisNetworkStatus.PROVIDER_NOT_FOUND;
  }
}
function createOasisNetworkWatcherStore() {
  const store = readable(OasisNetworkStatus.INITIALIZING, (set) => {
    const interval = setInterval(async () => {
      set(await getOasisNetworkConnectionStatus());
    }, 1e3);
    return () => clearInterval(interval);
  });
  return store;
}
function createAccountWatcherStore() {
  const store = readable("Connecting...", (set) => {
    const interval = setInterval(async () => {
      if (window.ethereum) {
        set(window.ethereum.selectedAddress);
      }
    }, 1e3);
    return () => clearInterval(interval);
  });
  return store;
}
const NetworkButton_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "@keyframes svelte-u2hr4o-glow{0%{filter:brightness(1)}100%{filter:brightness(1.3)}}.glow.svelte-u2hr4o{animation:svelte-u2hr4o-glow 3s alternate infinite;cursor:default;pointer-events:none}",
  map: null
};
const NetworkButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { mode } = $$props;
  let { networkStatus } = $$props;
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.networkStatus === void 0 && $$bindings.networkStatus && networkStatus !== void 0)
    $$bindings.networkStatus(networkStatus);
  $$result.css.add(css$2);
  return `${networkStatus === OasisNetworkStatus.INITIALIZING ? `<button class="${"btn btn-secondary"}" disabled><span class="${"spinner-border spinner-border-sm me-2"}" role="${"status"}" aria-hidden="${"true"}"></span>Initializing...</button>` : `${networkStatus === OasisNetworkStatus.PROVIDER_NOT_FOUND ? `<a href="${"https://metamask.io/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"btn btn-outline-warning"}">Install MetaMask</a>` : `${networkStatus === OasisNetworkStatus.WALLET_NOT_CONNECTED ? `<button class="${"btn btn-secondary"}"><i class="${"bi bi-gem me-2"}"></i>Connect Wallet
    </button>` : `${mode === Mode.Shout ? `${networkStatus === OasisNetworkStatus.ON_EMERALD_PARATIME ? `<button class="${"btn btn-success glow svelte-u2hr4o"}"><i class="${"bi bi-gem me-2"}"></i>Connected to Emerald Testnet
            </button>` : `<button class="${"btn btn-outline-success"}"><i class="${"bi bi-gem me-2"}"></i>Connect to Emerald Testnet
            </button>`}` : ``}

    ${mode === Mode.Whisper ? `${networkStatus === OasisNetworkStatus.ON_SAPPHIRE_PARATIME ? `<button class="${"btn btn-primary glow svelte-u2hr4o"}"><i class="${"bi bi-suit-diamond-fill me-2"}"></i>Connected to Sapphire Testnet
            </button>` : `<button class="${"btn btn-outline-primary"}"><i class="${"bi bi-suit-diamond-fill me-2"}"></i>Connect to Sapphire Testnet
            </button>`}` : ``}`}`}`}`;
});
const MessageBox_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".from.svelte-davjxw{display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:gray}",
  map: null
};
function convertToDate(timestamp) {
  const asNumber = Number(timestamp);
  return new Date(asNumber * 1e3).toDateString();
}
const MessageBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { messages } = $$props;
  let { emptyMessage = "No messages yet..." } = $$props;
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  if ($$props.emptyMessage === void 0 && $$bindings.emptyMessage && emptyMessage !== void 0)
    $$bindings.emptyMessage(emptyMessage);
  $$result.css.add(css$1);
  return `<div class="${"card"}"><div class="${"card-header d-flex align-items-center justify-content-between"}">${slots.default ? slots.default({}) : ``}</div>
    <ul class="${"list-group list-group-flush"}">${messages.length ? `${each(messages, (message) => {
    return `<li class="${"list-group-item d-flex flex-column"}"><div class="${"from svelte-davjxw"}"><span>FROM: ${escape(message.from)}</span> 
                        <small>${escape(convertToDate(message.timestamp))}</small></div>
                    <b>${escape(message.text)}</b>
                </li>`;
  })}` : `<li class="${"list-group-item fst-italic"}">${escape(emptyMessage)}</li>`}</ul>
</div>`;
});
const Shout_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { networkStatus } = $$props;
  let { currentAccount } = $$props;
  function reset() {
    messages = [];
    refreshing = false;
    sending = false;
    message = "";
    address = "";
    tx = void 0;
  }
  createEventDispatcher();
  let connectedToEmerald;
  let address = "";
  let message = "";
  let messages = [];
  let refreshing = false;
  let sending = false;
  let tx;
  if ($$props.networkStatus === void 0 && $$bindings.networkStatus && networkStatus !== void 0)
    $$bindings.networkStatus(networkStatus);
  if ($$props.currentAccount === void 0 && $$bindings.currentAccount && currentAccount !== void 0)
    $$bindings.currentAccount(currentAccount);
  currentAccount && reset();
  connectedToEmerald = networkStatus === OasisNetworkStatus.ON_EMERALD_PARATIME;
  return `<div class="${"card mb-3"}"><div class="${"card-body"}"><div class="${"mb-3"}"><input autocomplete="${"new-password"}" id="${"address"}" class="${"form-control"}" type="${"text"}" placeholder="${"Address"}"${add_attribute("value", address, 0)}></div>
        <div class="${"mb-3"}"><textarea autocomplete="${"new-password"}" id="${"message"}" class="${"form-control"}" rows="${"4"}" cols="${"33"}" placeholder="${"Write something... (everyone can see)"}">${message || ""}</textarea>
            ${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
                <div class="${"tx-pending"}"><span class="${"spinner-grow spinner-grow-sm text-secondary"}" role="${"status"}"></span>
                    Transaction pending...
                </div>
            `;
    }
    return function() {
      return ``;
    }();
  }(tx)}</div>

        <div class="${"d-flex justify-content-between"}"><img src="${"emerald-certified.png"}" alt="${"emerald-certified"}" class="${"gem"}" height="${"56"}">
            ${connectedToEmerald ? `<div class="${"send-container"}"><a href="${"https://faucet.testnet.oasis.dev/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"text-success"}">Get Testnet Tokens<i class="${"bi bi-droplet-fill ms-1"}"></i></a>
                    ${sending ? `<button class="${"btn btn-success"}" type="${"button"}" disabled><span class="${"spinner-border spinner-border-sm"}" role="${"status"}" aria-hidden="${"true"}"></span>
                            Sending...
                        </button>` : `<button class="${"btn btn-success btn-send"}">Send</button>`}</div>` : `<span class="${"network-button"}">${validate_component(NetworkButton, "NetworkButton").$$render($$result, { mode: Mode.Shout, networkStatus }, {}, {})}</span>`}</div></div></div>

${validate_component(MessageBox, "MessageBox").$$render($$result, { messages, emptyMessage: "No shouts yet" }, {}, {
    default: () => {
      return `<span><i class="${"bi bi-megaphone-fill"}"></i> Shouts
    </span>
    ${connectedToEmerald ? `${refreshing ? `<button class="${"btn btn-sm btn-secondary"}" type="${"button"}" disabled><span class="${"spinner-border spinner-border-sm"}" role="${"status"}" aria-hidden="${"true"}"></span>
                Refreshing...
            </button>` : `<button class="${"btn btn-sm btn-secondary"}">Refresh</button>`}` : ``}`;
    }
  })}`;
});
const signatureTooltip = "On Sapphire, if you use msg.sender for access control in your contract, the call must be signed, otherwise msg.sender will be zeroed.";
const Whisper_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { networkStatus } = $$props;
  let { currentAccount } = $$props;
  function reset() {
    messages = [];
    refreshing = false;
    sending = false;
    message = "";
    address = "";
    tx = void 0;
  }
  createEventDispatcher();
  let connectedToSapphire;
  let signatureRefreshButton;
  let messages = [];
  let message = "";
  let address = "";
  let refreshing = false;
  let sending = false;
  let tx;
  if ($$props.networkStatus === void 0 && $$bindings.networkStatus && networkStatus !== void 0)
    $$bindings.networkStatus(networkStatus);
  if ($$props.currentAccount === void 0 && $$bindings.currentAccount && currentAccount !== void 0)
    $$bindings.currentAccount(currentAccount);
  currentAccount && reset();
  connectedToSapphire = networkStatus === OasisNetworkStatus.ON_SAPPHIRE_PARATIME;
  return `<div class="${"card mb-3"}"><div class="${"card-body"}"><div class="${"mb-3"}"><input autocomplete="${"new-password"}" id="${"address"}" class="${"form-control"}" type="${"text"}" placeholder="${"Address"}"${add_attribute("value", address, 0)}></div>
        <div class="${"mb-3"}"><textarea autocomplete="${"new-password"}" id="${"message"}" class="${"form-control"}" rows="${"4"}" cols="${"33"}" placeholder="${"Write something... (it's end-to-end encrypted)"}">${message || ""}</textarea>
            ${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
                <div class="${"tx-pending"}"><span class="${"spinner-grow spinner-grow-sm text-secondary"}" role="${"status"}"></span>
                    Transaction pending...
                </div>
            `;
    }
    return function() {
      return ``;
    }();
  }(tx)}</div>
        <div class="${"d-flex justify-content-between"}"><img src="${"sapphire-certified.png"}" alt="${"sapphire-certified"}" class="${"gem"}" height="${"56"}">
            ${connectedToSapphire ? `<div class="${"send-container"}"><a href="${"https://faucet.testnet.oasis.dev/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"text-primary"}">Get Testnet Tokens<i class="${"bi bi-droplet-fill ms-1"}"></i></a>        
                    ${sending ? `<button class="${"btn btn-primary"}" type="${"button"}" disabled><span class="${"spinner-border spinner-border-sm"}" role="${"status"}" aria-hidden="${"true"}"></span>
                            Sending...
                        </button>` : `<button class="${"btn btn-primary btn-send"}">Send</button>`}</div>` : `<span class="${"network-button"}">${validate_component(NetworkButton, "NetworkButton").$$render($$result, { mode: Mode.Whisper, networkStatus }, {}, {})}</span>`}</div></div></div>

${validate_component(MessageBox, "MessageBox").$$render(
    $$result,
    {
      messages,
      emptyMessage: "No whispers yet"
    },
    {},
    {
      default: () => {
        return `<span><i class="${"bi bi-incognito me-2"}"></i>Whispers
    </span>
    ${connectedToSapphire ? `${refreshing ? `<button class="${"btn btn-sm btn-secondary"}" type="${"button"}" disabled><span class="${"spinner-border spinner-border-sm"}" role="${"status"}" aria-hidden="${"true"}"></span>
                Signing (and Refreshing)...
            </button>` : `<button class="${"btn btn-sm btn-secondary"}"${add_attribute("title", signatureTooltip, 0)} data-bs-placement="${"bottom"}"${add_attribute("this", signatureRefreshButton, 0)}><i class="${"bi bi-pen me-2"}"></i>Sign To Refresh
            </button>`}` : ``}`;
      }
    }
  )}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".current-account.svelte-1hr8dyi.svelte-1hr8dyi{font-size:0.9rem}.powered-by-oasis.svelte-1hr8dyi.svelte-1hr8dyi{display:flex;gap:8px;align-items:center;font-style:italic;color:#65c1ff}.main.svelte-1hr8dyi.svelte-1hr8dyi{display:flex;flex-direction:column;gap:16px;max-width:600px;padding:2em;margin:0 auto}.right-controls.svelte-1hr8dyi.svelte-1hr8dyi{display:flex}.rosetan.svelte-1hr8dyi.svelte-1hr8dyi{display:flex;gap:14px}.rosetan.svelte-1hr8dyi img.svelte-1hr8dyi{align-self:flex-end}.tx-pending{display:flex;justify-content:end;gap:8px;font-size:0.8rem;align-items:center;padding-top:4px;color:gray;position:absolute;right:0;padding-right:1.5em}.send-container{display:flex;align-items:end;gap:14px;align-self:flex-end}.btn-send{width:100px}span.network-button{align-self:flex-end}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $oasisNetworkStatus, $$unsubscribe_oasisNetworkStatus;
  let $currentAccount, $$unsubscribe_currentAccount;
  let mode = Mode.Shout;
  let oasisNetworkStatus = createOasisNetworkWatcherStore();
  $$unsubscribe_oasisNetworkStatus = subscribe(oasisNetworkStatus, (value) => $oasisNetworkStatus = value);
  let currentAccount = createAccountWatcherStore();
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<nav class="${"navbar navbar-expand-lg bg-body-tertiary bg-dark"}" data-bs-theme="${"dark"}"><div class="${"container"}"><div class="${"navbar-brand d-flex gap-2"}"><i class="${"bi bi-incognito"}"></i> ||
            <i class="${"bi bi-megaphone-fill me-2"}"></i>
            <span class="${"collapse navbar-collapse"}">Whisper &amp; Shout
            </span></div>

        <span class="${"right-controls svelte-1hr8dyi"}"><div class="${"collapse navbar-collapse"}"><a href="${"https://oasisprotocol.org/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"navbar-brand powered-by-oasis svelte-1hr8dyi"}"><img src="${"oasis-logo.png"}" alt="${"Powered by Oasis"}" width="${"30"}" height="${"30"}" class="${"d-inline-block"}">
                    Powered by Oasis
                </a></div>
            ${validate_component(NetworkButton, "NetworkButton").$$render($$result, { mode, networkStatus: $oasisNetworkStatus }, {}, {})}</span></div></nav>

<nav class="${"navbar"}"><div class="${"container d-flex justify-content-end"}">${$currentAccount ? `<span class="${"badge rounded-pill text-bg-secondary current-account svelte-1hr8dyi"}"><i class="${"bi bi-person-circle me-1"}"></i>
                ${escape($currentAccount)}</span>` : ``}</div></nav>


<div class="${"main svelte-1hr8dyi"}"><div class="${"rosetan-box"}"><div class="${[
      "alert",
      (mode === Mode.Shout ? "alert-success" : "") + " " + (mode === Mode.Whisper ? "alert-primary" : "")
    ].join(" ").trim()}" role="${"alert"}"><div class="${"rosetan svelte-1hr8dyi"}"><div>${mode === Mode.Shout ? `<h3 class="${"alert-heading"}">Hey! I&#39;m Rosetan!</h3>
                        <p>This is the <b>Shout</b> mode.
                        </p>
                        <p>Messages you send in this mode are publicly visible to anyone, like most blockchains.
                            This mode uses the Oasis Network&#39;s <a href="${"https://docs.oasis.io/dapp/emerald/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"alert-link"}">Emerald</a> paratime.
                        </p>` : `<h3 class="${"alert-heading"}">Psssst!</h3>
                        <p>Hi, I&#39;m Rosetan, and this is the <b>Whisper</b> mode.
                        </p>
                        <p>Messages you send in this mode are <b>end-to-end encrypted</b> using the Oasis Network&#39;s <a href="${"https://docs.oasis.io/dapp/sapphire/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"alert-link"}">Sapphire</a> paratime, a confidential EVM.
                        </p>`}</div>
                <img src="${"comfy.png"}" alt="${"Comfy Rosetan"}" width="${"60"}" class="${"svelte-1hr8dyi"}"></div></div></div>
    <div>${validate_component(ModeToggle, "ModeToggle").$$render(
      $$result,
      { mode },
      {
        mode: ($$value) => {
          mode = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>
    
    <div${add_styles({
      "display": mode === Mode.Shout ? "" : "none"
    })}>${validate_component(Shout_1, "Shout").$$render(
      $$result,
      {
        networkStatus: $oasisNetworkStatus,
        currentAccount: $currentAccount
      },
      {},
      {}
    )}</div>
    <div${add_styles({
      "display": mode === Mode.Whisper ? "" : "none"
    })}>${validate_component(Whisper_1, "Whisper").$$render(
      $$result,
      {
        networkStatus: $oasisNetworkStatus,
        currentAccount: $currentAccount
      },
      {},
      {}
    )}</div>
</div>`;
  } while (!$$settled);
  $$unsubscribe_oasisNetworkStatus();
  $$unsubscribe_currentAccount();
  return $$rendered;
});
export {
  Page as default
};
