import * as THREE from 'three';
		import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
		import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
		let camera, scene, renderer, animation, animationState;

		const clock = new THREE.Clock();

		let mixer;

		init();
		animate();
        initControls();


		function init() {

			const container = document.getElementById("model_container");
			document.body.appendChild(container);
			// Camera Parameteres ->  FOV, (Aspect ratio),near, far           
			camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);
			//position is a vector3 position
			camera.position.set(300, 200, 700);

			scene = new THREE.Scene();
			scene.background = new THREE.Color(0xa0a0a0);



			const dirLight = new THREE.DirectionalLight(0xffffff, 5);
			dirLight.position.set(0, 200, 100);
			dirLight.castShadow = true;
			dirLight.shadow.camera.top = 180;
			dirLight.shadow.camera.bottom = - 100;
			dirLight.shadow.camera.left = - 120;
			dirLight.shadow.camera.right = 120;
			scene.add(dirLight);

			// model
			const loader = new FBXLoader();
			loader.load('models/Waving.fbx', function (object) {
                // console.log("object ",object.animations)
				mixer = new THREE.AnimationMixer(object);
                animation = mixer.clipAction(object.animations[0]);
                //0 -> once, 1 -> infinite
                animation.setLoop(1)

                animation.setEffectiveTimeScale(2);
                animation.play();
				object.traverse(function (child) {

					if (child.isMesh) {

						child.castShadow = true;
						child.receiveShadow = true;

					}

				});

				scene.add(object);
			});

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			//dimensions of the canvas which will contain the model redered (width, height)
			renderer.setSize(600, 400);
			renderer.shadowMap.enabled = true;
			container.appendChild(renderer.domElement);

			const controls = new OrbitControls(camera, renderer.domElement);
			controls.target.set(0, 100, 0);
			controls.update();

			window.addEventListener('resize', onWindowResize);



		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

		}

		//

		function animate() {

			requestAnimationFrame(animate);

			const delta = clock.getDelta();

			if (mixer) mixer.update(delta);

			renderer.render(scene, camera);


		}
        function initControls(){
            const play = document.getElementById("play");
            const pause = document.getElementById("pause");
            const stop = document.getElementById("stop");

            play.addEventListener("click", function(){
                animation.paused= false;
                animation.play();
            });
            pause.addEventListener("click", function(){
                animation.paused= true;
            });
            stop.addEventListener("click", function(){
                animation.stop();
            });
        }