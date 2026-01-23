import {
  ConnectOptions,
  MP_SDK,
  MpSdk,
  ShowcaseBundleWindow,
} from "../bundle/sdk";
/**
 * augment window with the MP_SDK property
 */
declare global {
  interface Window {
    MP_SDK: MP_SDK;
  }
}

/**
 * Set Model Id and SDK Key
 */
const container = document.querySelector(".container") as HTMLDivElement;
const showcaseIframe = document.getElementById("showcase") as HTMLIFrameElement;
const SDK_KEY = process.env.SDK_KEY || "";
const modelId = "";
let mpSdk: MpSdk;
const fullscreenBtn = document.querySelector('#fullscreenBtn') as HTMLButtonElement;
let isFullscreen = false;

// Set the iframe src to load the Showcase bundle
showcaseIframe.setAttribute(
  "src",
  `/bundle/showcase.html?m=${modelId}&play=1&qs=1&log=0&applicationKey=${SDK_KEY}&ss=18&sr=-2.05,1.26`
);

// Exit fullscreen 
const exitFullscreen = async () => {
  await document.exitFullscreen();
  isFullscreen = false;
};

// Fullscreen event listener
const fullscreenEventListener = () => {
  // Fullscreen toggle
  fullscreenBtn.addEventListener('click', () => {
    if(isFullscreen){
      exitFullscreen();
    } else {
      container.requestFullscreen();
      isFullscreen = true;
    }
  });
};

/**
 * Connect to the Showcase SDK
 */ 
showcaseIframe.addEventListener("load", async function () {
  const bundle = showcaseIframe.contentWindow as ShowcaseBundleWindow;

  try {
    const options: Partial<ConnectOptions> = {
      auth: "", // if your using PME
    };
    // Connect to the SDK
    mpSdk = await showcaseIframe.contentWindow.MP_SDK.connect(bundle, options);

    // Initialize fullscreen event listener
    fullscreenEventListener();

  } catch (e) {
    console.error(e);
  }

  console.log(
    "%c  Hello Bundle SDK! ",
    "background: #333333; color: #00dd00",
    mpSdk
  );
});

// declare this file is a module
export {};
