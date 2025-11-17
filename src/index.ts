import { Dictionary, MP_SDK, MpSdk, ShowcaseBundleWindow } from "../bundle/sdk";

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
const showcase = document.getElementById('showcase') as HTMLIFrameElement;
const SDK_KEY = process.env.SDK_KEY || "";
const modelId = "76VYD7xqkCb";
showcase.setAttribute("src", `/bundle/showcase.html?m=${modelId}&play=1&qs=1&log=0&applicationKey=${SDK_KEY}&ss=18&sr=-1.29,.92`);
let mpSdk:MpSdk;

/**
 * DOM Elements
 * Copilot Suggestion: Load version.txt at runtime to avoid importing .txt as a module that TypeScript can't type-check
 */
(async () => {
  try {
    const res = await fetch("/bundle/version.txt");
    if (!res.ok) return;
    const heading = document.getElementsByClassName("heading")[0] as HTMLElement;
    const h1 = document.createElement("h1");
    heading.appendChild(h1);
    const version = (await res.text()).trim();
    h1.textContent = `Bundle SDK v${version}`;
  } catch (e) {
    console.warn("Could not load version.txt", e);
  }
})();

/**
 * Add Video to all tags
 * @param mpSdk 
 * @param tagId 
 */
const addVideoToAllTags = async (mpSdk: MpSdk, tagId: string) => {
  // Register Attachment
  mpSdk.Tag.registerAttachment(
    'https://www.youtube.com/watch?v=577BMAWbf_o'
  )
    .then((attachmentId: string[]) => {
      // Attach Video
      mpSdk.Tag.attach(tagId, attachmentId[0]);
    })
    .catch((e: Error) => {
      console.error('Error with tag attachment', e);
    });
};

/**
 * Connect to the Showcase SDK
 */
showcase.addEventListener('load', async function() {
  const bundle = showcase.contentWindow as ShowcaseBundleWindow;
  try {
    mpSdk = await showcase.contentWindow.MP_SDK.connect(bundle);
    mpSdk.Tag.data.subscribe({
      onAdded(tagId:string, item:MpSdk.Tag.TagData, collection:Dictionary<any>) {
        console.log('== [TAG] onAdded', tagId, item, collection);
        addVideoToAllTags(mpSdk,tagId);
      },
    });
  }
  catch(e) {
    console.error(e);
    return;
  }

  console.log('%c  Hello Bundle SDK! ', 'background: #333333; color: #00dd00',mpSdk);
});

// declare this file is a module
export {};