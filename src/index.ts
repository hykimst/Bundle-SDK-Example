import { Dictionary, MP_SDK, MpSdk, ShowcaseBundleWindow, Vector3 } from "../bundle/sdk";
import { myClickListener } from "./components/MyClickListener";
import male02Obj from "../public/male02.obj";
import male02Material from "../public/male02.mtl";
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
const showcase = document.getElementById("showcase") as HTMLIFrameElement;
const SDK_KEY = process.env.SDK_KEY || "";
const modelId = "76VYD7xqkCb";
showcase.setAttribute(
  "src",
  `/bundle/showcase.html?m=${modelId}&play=1&qs=1&log=0&applicationKey=${SDK_KEY}&ss=18&sr=-2.05,1.26`
);
let mpSdk: MpSdk;

/**
 * DOM Elements
 * Copilot Suggestion: Load version.txt at runtime to avoid importing .txt as a module that TypeScript can't type-check
 */
(async () => {
  try {
    const res = await fetch("/bundle/version.txt");
    if (!res.ok) return;
    const heading = document.getElementsByClassName(
      "heading"
    )[0] as HTMLElement;
    const h1 = document.createElement("h1");
    heading.appendChild(h1);
    const version = (await res.text()).trim();
    h1.textContent = `Bundle SDK v${version}`;
  } catch (e) {
    console.warn("Could not load version.txt", e);
  }
})();

/**
 * Setup My Scene, Compoment, Node
 * @param mpSdk
 */
const sceneComponentTest = async (SDK: MpSdk) => {
  // 1 - SCENE OBJECT
  const [sceneObject] = await SDK.Scene.createObjects(1);

  // 2 - SCENE NODE
  const node = sceneObject.addNode();
  const position: MpSdk.Vector3 = {
    x: -2.6879119873046875,
    y: 3.8319289684295654,
    z: 0.180706024169922
  }
  // Set this Node's positon
  node.position.set(position.x,position.y,position.z);

  // 3 - Add Components
  // Add Ambient Light Component
  node.addComponent("mp.ambientLight", { enabled: true });

  // 3a - Add Directional Light Component
  node.addComponent("mp.directionalLight", {
    enabled: true,
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
    intensity: 0.8,
    position: {
      x: 0,
      y: 1,
      z: 0,
    },
    target: {
      x: 0,
      y: 0,
      z: 0,
    },
    debug: false,
  });

  // 3b- Add OBJ Loader Component -  https://matterport.github.io/showcase-sdk/sdkbundle_components_objloader.html
  const objLoader = node.addComponent("mp.objLoader", {
    url: male02Obj,
    material: male02Material,
    visible: true,
    localScale: {
      x: 0.005,
      y: 0.005,
      z: 0.005,
    },
    localPosition: {
      x:0,
      y:0,
      z:0
    },
    localRotation: {
      x: 0,
      y: 0,
      z: 0
    },
    colliderEnabled: true,
  }, 
  "obj");
  console.log("OBJ Loader Component:", objLoader);
  
  // 4 - Create a Rotation Node
  const rotateNode = sceneObject.addNode();

  // 4a - Add your rotation component
  rotateNode.addComponent("mp.transformControls", {
    mode: "rotate",
    selection: node,
    showX: true,
    showY: true,
    showZ: true,
    size: 1.0,
    visible: true,
  });
  // 4b - Set your rotation
  rotateNode.position.set(
    -2.6879119873046875,
    3.8319289684295654,
    0.180706024169922
  );
  // 4c - Set your rotation scale
  rotateNode.scale.set(0.2, 0.2, 0.2);

  // 5 - Start Node & Scene 
  node.start();
  rotateNode.start();
  sceneObject.start();
};

/**
 * Connect to the Showcase SDK
 */
showcase.addEventListener("load", async function () {
  const bundle = showcase.contentWindow as ShowcaseBundleWindow;
  try {
    mpSdk = await showcase.contentWindow.MP_SDK.connect(bundle);
    sceneComponentTest(mpSdk);
  } catch (e) {
    console.error(e);
    return;
  }

  console.log(
    "%c  Hello Bundle SDK! ",
    "background: #333333; color: #00dd00",
    mpSdk
  );
});

// declare this file is a module
export {};
