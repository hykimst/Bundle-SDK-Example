import { MP_SDK, MpSdk, ShowcaseBundleWindow } from "../bundle/sdk";
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
  node.quaternion.set(-0, 0.85, 0.75, .28);

  // 3 - Add Components
  // Add Ambient Light Component
  node.addComponent("mp.ambientLight", {
    enabled: true,
    color: {
      r: 1, g: 1, b: 1
    },
    intensity: 4, 
  });

  const obj = "../public/cat.obj";
  const material = "../public/cat.mtl";
  // 3b- Add OBJ Loader Component -  https://matterport.github.io/showcase-sdk/sdkbundle_components_objloader.html
  const objLoader = node.addComponent("mp.objLoader", {
    url: obj,
    materialUrl: material,
    visible: true,
    localScale: {
      x: 0.010,
      y: 0.010,
      z: 0.010,
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
  const rotateComponent =rotateNode.addComponent("mp.transformControls", {
    mode: "rotate",
    selection: node,
    showX: true,
    showY: true,
    showZ: true,
    size: 1.0,
    visible: true,
  });

  rotateComponent.onEvent = ((event:any, data:any) => {
    console.log("OBJLOADER Changed Event:", event, data);
  });
  
  // 4b - Set your rotation
  rotateNode.position.set(
    -2.6879119873046875,
    2.8319289684295654,
    0.180706024169922
  );
  // 4c - Set your rotation scale
  rotateNode.scale.set(0.5, 0.5, 0.5);

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
