// Project Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const detailButtons = document.querySelectorAll('.project-link');
    
    detailButtons.forEach(button => {
        if (button.textContent.trim() === 'Details') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find the closest parent project card
                const projectCard = button.closest('.project-card');
                if (!projectCard) return;
                
                // Get the video source
                const video = projectCard.querySelector('.project-video');
                const videoSrc = video ? (video.getAttribute('data-src') || video.src) : '';
                
                // Get the project title
                const titleElement = projectCard.querySelector('.project-title');
                const projectTitle = titleElement ? titleElement.textContent.trim() : '';

                console.log('Opening modal for:', projectTitle); // Debug log
                console.log('Video source:', videoSrc); // Debug log
                
                showProjectDetails(projectTitle, videoSrc);
            });
        }
    });
});

function getProjectDetails(projectTitle) {
    const details = {
        'First-Person Shooter': `
            <div class="modal-details">
                <h3>Project Overview</h3>
                <p>A challenging FPS game built with Unreal Engine 5, featuring dynamic combat.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>AI-driven enemy behavior system</li>
                    <li>Multiple weapon types with unique characteristics</li>
                    <li>Custom particle effects</li>
                    <li>Fluid blended movement animations with death animations</li>
                </ul>
                
                <h3>Technical Details</h3>
                <ul>
                    <li>Built with Unreal Engine 5</li>
                    <li>C++ for core gameplay mechanics</li>
                    <li>Blueprint Visual Scripting for game modes and character mechanics</li>
                    <li>AI behaviour trees for enemies</li>
                </ul>
            </div>
        `,
        'Toon Tanks': `
            <div class="modal-details">
                <h3>Project Overview</h3>
                <p>A third-person tank combat game featuring stylized graphics and engaging gameplay mechanics.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Intuitive tank control system</li>
                    <li>AI-controlled enemy turrets</li>
                    <li>Dynamic health system</li>
                    <li>Particle effects for impacts and explosions</li>
                </ul>
                
                <h3>Technical Details</h3>
                <ul>
                    <li>Unreal Engine 5</li>
                    <li>C++ for gameplay systems</li>
                    <li>Blueprint Visual Scripting for game modes and character mechanics</li>
                </ul>
            </div>
        `,
        'Crypt Raider': `
            <div class="modal-details">
                <h3>Project Overview</h3>
                <p>An atmospheric puzzle-adventure game set in a mysterious ancient crypt.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Physics-based puzzle mechanics</li>
                    <li>Interactive environment elements</li>
                    <li>Atmospheric lighting and sound design</li>
                    <li>Progressive puzzle complexity</li>
                </ul>
                
                <h3>Technical Details</h3>
                <ul>
                    <li>Unreal Engine 5</li>
                    <li>C++ for gameplay systems</li>
                    <li>Dynamic lighting system</li>
                </ul>
            </div>
        `,
        'Obstacle Assault': `
            <div class="modal-details">
                <h3>Project Overview</h3>
                <p>A challenging obstacle course game that tests players' timing and platforming skills.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Dynamic moving obstacles</li>
                    <li>Progressive difficulty system</li>
                </ul>
                
                <h3>Technical Details</h3>
                <ul>
                    <li>Unreal Engine 5</li>
                    <li>C++ for gameplay systems</li>
                </ul>
            </div>
        `,
        'Unoptimized Load Time': `
            <div class="modal-details">
                <h3>Performance Analysis</h3>
                <p>Initial loading performance before optimization implementations.</p>
                
                <h3>Key Metrics</h3>
                <ul>
                    <li>Android average load time: ~50 seconds</li>
                    <li>iOS average load time: ~22 seconds</li>
                </ul>
                
                <h3>Identified Issues</h3>
                <ul>
                    <li>Sequential asset loading</li>
                    <li>Unoptimized resource management</li>
                    <li>Eager Loading</li>
                </ul>
            </div>
        `,
        'Async Load Time': `
            <div class="modal-details">
                <h3>First Optimization Phase</h3>
                <p>Implementation of asynchronous loading strategies.</p>
                
                <h3>Improvements</h3>
                <ul>
                    <li>Android load time reduced to under ~25 seconds</li>
                    <li>iOS load time reduced to under ~12 seconds</li>
                    <li>50% average improvement across platforms</li>
                </ul>
                
                <h3>Implemented Solutions</h3>
                <ul>
                    <li>Asynchronous asset loading</li>
                    <li>Optimized lazy loading strategy</li>
                    <li>Caching of whatever assets are available and have been downloaded</li>
                </ul>
            </div>
        `,
        'Cached Async Load Time': `
            <div class="modal-details">
                <h3>Final Optimization Phase</h3>
                <p>Implementation of caching system combined with asynchronous loading.</p>
                
                <h3>Final Results</h3>
                <ul>
                    <li>Android final load time: under ~17 seconds</li>
                    <li>iOS final load time: under ~7 seconds</li>
                    <li>66-68% total improvement from original</li>
                </ul>
                
                <h3>Technical Solutions</h3>
                <ul>
                    <li>Asynchronous asset bundle download combined with caching </li>
                </ul>
            </div>
        `
    };
    
    return details[projectTitle] || '<p>Project details coming soon!</p>';
}

function getExpectedTime(title) {
    const times = {
        'Unoptimized Load Time': 'iOS: 16s',
        'Async Load Time': 'iOS: 12s',
        'Cached Async Load Time': 'iOS: 4s'
    };
    return times[title] || '';
}

function showProjectDetails(projectTitle, videoSrc) {
    // Check if this is an optimization video
    const isOptimizationVideo = ['Unoptimized Load Time', 'Async Load Time', 'Cached Async Load Time'].includes(projectTitle);
    
    // Create timer HTML if it's an optimization video
    const timerHTML = isOptimizationVideo ? `
        <div class="timer-container">
            <div class="timer">00:00.000</div>
            <div class="timer-controls">
                <button class="timer-btn reset-timer">Reset Timer</button>
                <div class="expected-time">Expected: ${getExpectedTime(projectTitle)}</div>
            </div>
        </div>
    ` : '';

    const modalHtml = `
        <div class="project-modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2 class="modal-title">${projectTitle}</h2>
                <div class="modal-video-container">
                    <video class="modal-video" controls playsinline>
                        <source src="${videoSrc}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                ${timerHTML}
                <div class="modal-body">
                    ${getProjectDetails(projectTitle)}
                </div>
            </div>
        </div>
    `;    
    // Insert modal into document
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Get modal elements
    const modal = document.querySelector('.project-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const video = modal.querySelector('.modal-video');
    
    // Declare timerInterval in the outer scope
    let timerInterval;
    
    // Timer elements and functionality for optimization videos
    if (isOptimizationVideo) {
        const timerDisplay = modal.querySelector('.timer');
        const resetTimerBtn = modal.querySelector('.reset-timer');
        let startTime;

        function startTimer() {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 10);
        }

        function stopTimer() {
            clearInterval(timerInterval);
        }

        function resetTimer() {
            stopTimer();
            timerDisplay.textContent = '00:00.000';
            if (!video.paused) {
                startTimer();
            }
        }

        function updateTimer() {
            const elapsedTime = Date.now() - startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            const milliseconds = elapsedTime % 1000;
            
            timerDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
        }

        // Add event listeners for video and timer controls
        video.addEventListener('play', startTimer);
        video.addEventListener('pause', stopTimer);
        resetTimerBtn.addEventListener('click', resetTimer);
    }

    // Show modal and handle video playback
    modal.style.display = 'block';
    video.play().catch(e => console.log('Auto-play prevented:', e));

    // Close modal functionality
    const closeModal = () => {
        if (isOptimizationVideo && timerInterval) {
            clearInterval(timerInterval);
        }
        video.pause();
        modal.remove();
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}