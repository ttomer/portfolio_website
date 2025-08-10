// Three.js Scene Setup and Animation
function initThreeScene() {
    // Three.js Animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#hero-canvas'),
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable shadows for more realistic rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.5, // Much more subtle particles
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add stronger ambient light for the astronaut
    const ambientLight = new THREE.AmbientLight(0x606060, 1.2);
    scene.add(ambientLight);
    
    // Add brighter directional light for better astronaut visibility
    const directionalLight = new THREE.DirectionalLight(0x00f3ff, 1.5);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add additional rim lighting to make astronaut pop
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // Load the astronaut model
    let astronaut = null;
    let astronautBaseY = -1; // Default base Y position
    let mixer = null; // Animation mixer
    
    // Check if GLTFLoader is available
    console.log('THREE.GLTFLoader available:', typeof THREE.GLTFLoader !== 'undefined');
    
    if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        
        console.log('Attempting to load astronaut model...');
        
        loader.load(
            'assets/models/astronaut.glb',
            (gltf) => {
                console.log('GLTF loaded:', gltf);
                astronaut = gltf.scene;
                
                // Scale the astronaut (bigger size as requested)
                astronaut.scale.set(3, 3, 3); // Reduced scale to see full model
                
                // Position astronaut fully in viewport - ensure head doesn't cut off
                astronaut.position.set(0, -5.2, -4); // Move down more for full head visibility
                console.log('🚀 Initial positioning at y=-5.2');
                
                // Enhance materials to make astronaut stand out
                astronaut.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Make it much more visible and prominent
                        if (child.material) {
                            // Clone the material to avoid affecting other instances
                            child.material = child.material.clone();
                            
                            // Add subtle glow/emissive
                            child.material.emissive = new THREE.Color(0x444444);
                            
                            // Increase metalness and roughness for better lighting response
                            if (child.material.metalness !== undefined) {
                                child.material.metalness = 0.8;
                                child.material.roughness = 0.3;
                            }
                            
                            // Ensure it's not transparent
                            child.material.transparent = false;
                            child.material.opacity = 1.0;
                            
                            // Add slight bloom effect
                            child.material.emissiveIntensity = 0.3;
                        }
                    }
                });
                
                scene.add(astronaut);
                console.log('✅ Astronaut loaded and added to scene!');
                console.log('Astronaut position:', astronaut.position);
                console.log('Astronaut scale:', astronaut.scale);
                
                // Setup animations
                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(astronaut);
                    console.log('🎭 Found animations:', gltf.animations.length);
                    
                    // Log all available animations
                    gltf.animations.forEach((clip, index) => {
                        console.log(`🎭 Animation ${index}:`, clip.name, `(${clip.duration}s)`);
                    });
                    
                    // Play the first animation (or find a floating/idle animation)
                    const floatingAnim = gltf.animations.find(anim => 
                        anim.name.toLowerCase().includes('float') || 
                        anim.name.toLowerCase().includes('idle') ||
                        anim.name.toLowerCase().includes('hover')
                    ) || gltf.animations[0];
                    
                    if (floatingAnim) {
                        const action = mixer.clipAction(floatingAnim);
                        action.play();
                        console.log('🎭 Playing animation:', floatingAnim.name);
                    }
                } else {
                    console.log('❌ No animations found in model');
                }
                
                // Debug: Log the bounding box to understand the model dimensions
                const box = new THREE.Box3().setFromObject(astronaut);
                console.log('📏 Model bounding box:', box);
                console.log('📏 Model height:', box.max.y - box.min.y);
                console.log('📏 Model center Y:', (box.max.y + box.min.y) / 2);
                
                // Store the actual position for animation
                astronautBaseY = -5.2; 
                console.log('🎯 Using position y =', astronautBaseY);
            },
            (progress) => {
                if (progress.total > 0) {
                    const percent = Math.round((progress.loaded / progress.total * 100));
                    console.log('📦 Loading astronaut:', percent + '%');
                }
            },
            (error) => {
                console.error('❌ Error loading astronaut model:', error);
                console.error('Make sure the file exists at: assets/models/astronaut.glb');
                
                // Create a simple cube as fallback to test positioning
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(0, 0, -2);
                cube.scale.set(2, 2, 2);
                scene.add(cube);
                astronaut = cube; // Use cube for animation testing
                console.log('📦 Added green cube as fallback');
            }
        );
    } else {
        console.error('❌ GLTFLoader not available');
        
        // Create a simple cube as fallback
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, -2);
        cube.scale.set(2, 2, 2);
        scene.add(cube);
        astronaut = cube;
        console.log('📦 Added red cube as GLTFLoader fallback');
    }

    camera.position.z = 2;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Scroll tracking for astronaut animation
    let scrollProgress = 0;
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress = Math.min(scrollTop / documentHeight, 1);
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update astronaut animations
        if (mixer) {
            mixer.update(0.016); // ~60fps
        }
        
        // Animate particles
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;

        // Responsive to mouse movement
        particlesMesh.rotation.y += mouseX * 0.001;
        particlesMesh.rotation.x += mouseY * 0.001;

        // Animate astronaut based on scroll and time
        if (astronaut) {
            const time = Date.now() * 0.001; // Current time in seconds
            
            // Calculate zoom factor for head-focused positioning
            const zoomFactor = scrollProgress * 2; // How much closer we're getting
            
            // Gentle unpredictable floating animation - multiple overlapping sine waves
            const float1 = Math.sin(time * 0.3) * 0.2;           // Slow large movement
            const float2 = Math.sin(time * 0.5) * 0.1;           // Medium speed movement  
            const float3 = Math.sin(time * 0.8) * 0.05;          // Fast small movement
            const float4 = Math.cos(time * 0.25) * 0.08;         // Cosine wave for variation
            
            const complexFloating = astronautBaseY + float1 + float2 + float3 + float4;
            
            // As we zoom in, move the astronaut down more so we focus on head area
            // The more we zoom, the more we shift focus to the upper body
            const headFocusOffset = zoomFactor * 1.2; // Adjust this to control head focus
            astronaut.position.y = complexFloating - headFocusOffset;
            
            // Rotation based on scroll progress
            astronaut.rotation.y = scrollProgress * Math.PI * 4; // Multiple rotations
            astronaut.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.2;
            
            // Position change based on scroll (moves across screen) + gentle drift
            const scrollMovement = Math.sin(scrollProgress * Math.PI * 2) * 1.5;
            const driftX = Math.sin(time * 0.2) * 0.1; // Gentle X drift
            astronaut.position.x = scrollMovement + driftX;
            
            astronaut.position.z = -4 + zoomFactor; // Moves closer as you scroll
            
            // Gentle rotation bobbing (not chaotic spinning)
            const bobZ = Math.sin(time * 0.25) * 0.05;  // Very gentle tilting
            astronaut.rotation.z = bobZ; // Use = instead of += to prevent accumulation
        }

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize Three.js scene when DOM is loaded
document.addEventListener('DOMContentLoaded', initThreeScene);