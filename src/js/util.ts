import Scene = BABYLON.Scene;
import SceneLoader = BABYLON.SceneLoader;
import AssetContainer = BABYLON.AssetContainer;


export type TLoadSceneOptions = {
    oldContainer?: AssetContainer
    scene: Scene
    sceneFilePath: string
};


export async function loadScene(options: TLoadSceneOptions): Promise<AssetContainer> {
    const {oldContainer, scene, sceneFilePath} = options;
    const newContainer: AssetContainer = await SceneLoader.LoadAssetContainerAsync('./', sceneFilePath, scene);

    if (newContainer.cameras.length == 0) {
        throw new Error('Scene does not contain any cameras! It needs at least one.');
    }

    if (oldContainer) {
        oldContainer.scene = scene;
        oldContainer.removeAllFromScene();
    }

    newContainer.addAllToScene();

    if (!scene.activeCamera) {
        scene.setActiveCameraByID(scene.cameras[0].id);
    }

    return newContainer;
}

