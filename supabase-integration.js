// Supabase Integration for Jacque Jeme
// This file handles saving/loading configurations and uploading images

// Wait for DOM and Supabase to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabaseFeatures();
});

function initializeSupabaseFeatures() {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
        console.log('ℹ️ Supabase not configured yet. Some features will be disabled.');
        disableSupabaseFeatures();
        return;
    }

    // Save Configuration Button
    const saveBtn = document.getElementById('save-config');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveConfiguration);
    }

    // Load Configurations Button
    const loadBtn = document.getElementById('load-configs');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadConfigurations);
    }

    // Enhanced File Upload with Supabase
    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('change', handleFileUploadWithSupabase);
    }

    console.log('✅ Supabase features initialized');
}

// Disable Supabase features if not configured
function disableSupabaseFeatures() {
    const saveBtn = document.getElementById('save-config');
    const loadBtn = document.getElementById('load-configs');

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.title = 'Configure Supabase first (see config.js)';
        saveBtn.style.opacity = '0.5';
    }

    if (loadBtn) {
        loadBtn.disabled = true;
        loadBtn.title = 'Configure Supabase first (see config.js)';
        loadBtn.style.opacity = '0.5';
    }
}

// Save current configuration to Supabase
async function saveConfiguration() {
    if (!supabase) {
        alert('Please configure Supabase first. Check config.js file.');
        return;
    }

    const configName = document.getElementById('config-name').value.trim();

    if (!configName) {
        alert('Please enter a name for your design!');
        return;
    }

    // Gather current configuration
    const config = {
        name: configName,
        gender: currentGender,
        pose: currentPose || 'standing',
        measurements: { ...measurements },
        colors: {
            color1: document.getElementById('color1').value,
            color2: document.getElementById('color2').value
        },
        texture: document.getElementById('texture').value,
        timestamp: new Date().toISOString()
    };

    try {
        // Show loading state
        const saveBtn = document.getElementById('save-config');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '💾 Saving...';
        saveBtn.disabled = true;

        // Save to Supabase
        const { data, error } = await supabase
            .from('model_configurations')
            .insert([config])
            .select();

        if (error) throw error;

        // Success!
        saveBtn.textContent = '✅ Saved!';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);

        // Clear the input
        document.getElementById('config-name').value = '';

        // Show success message
        showNotification('Configuration saved successfully!', 'success');
        console.log('Saved configuration:', data);

    } catch (error) {
        console.error('Error saving configuration:', error);
        alert('Error saving configuration: ' + error.message);

        const saveBtn = document.getElementById('save-config');
        saveBtn.textContent = '💾 Save Configuration';
        saveBtn.disabled = false;
    }
}

// Load saved configurations from Supabase
async function loadConfigurations() {
    if (!supabase) {
        alert('Please configure Supabase first. Check config.js file.');
        return;
    }

    try {
        const loadBtn = document.getElementById('load-configs');
        const originalText = loadBtn.textContent;
        loadBtn.textContent = '📂 Loading...';
        loadBtn.disabled = true;

        // Fetch all configurations
        const { data, error } = await supabase
            .from('model_configurations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        loadBtn.textContent = originalText;
        loadBtn.disabled = false;

        if (!data || data.length === 0) {
            alert('No saved configurations found. Save one first!');
            return;
        }

        // Display configurations in a modal
        displayConfigurationsModal(data);

    } catch (error) {
        console.error('Error loading configurations:', error);
        alert('Error loading configurations: ' + error.message);

        const loadBtn = document.getElementById('load-configs');
        loadBtn.textContent = '📂 Load Saved Designs';
        loadBtn.disabled = false;
    }
}

// Display configurations in a modal
function displayConfigurationsModal(configs) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'config-modal';
    modal.innerHTML = `
        <div class="config-modal-content">
            <div class="config-modal-header">
                <h2>Saved Designs</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="config-list">
                ${configs.map(config => `
                    <div class="config-item" data-config='${JSON.stringify(config)}'>
                        <div class="config-info">
                            <h3>${config.name || 'Unnamed Design'}</h3>
                            <p>
                                <strong>Gender:</strong> ${config.gender} |
                                <strong>Pose:</strong> ${config.pose || 'standing'} |
                                <strong>Texture:</strong> ${config.texture || 'solid'}
                            </p>
                            <small>Saved: ${new Date(config.created_at).toLocaleString()}</small>
                        </div>
                        <button class="load-config-btn" onclick="applyConfiguration('${config.id}')">
                            Load Design
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal handlers
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Store configs for later use
    window.savedConfigs = configs;
}

// Apply a selected configuration
window.applyConfiguration = async function(configId) {
    const config = window.savedConfigs.find(c => c.id === configId);

    if (!config) {
        alert('Configuration not found!');
        return;
    }

    try {
        // Apply gender
        if (config.gender) {
            const genderBtn = document.querySelector(`[data-gender="${config.gender}"]`);
            if (genderBtn) genderBtn.click();
        }

        // Apply pose
        if (config.pose && typeof setPose === 'function') {
            setPose(config.pose);
        }

        // Apply measurements
        if (config.measurements) {
            Object.assign(measurements, config.measurements);
            updateMeasurements();
        }

        // Apply colors
        if (config.colors) {
            document.getElementById('color1').value = config.colors.color1 || '#00474F';
            document.getElementById('color2').value = config.colors.color2 || '#C2F0F7';
            document.getElementById('apply-gradient').click();
        }

        // Apply texture
        if (config.texture) {
            document.getElementById('texture').value = config.texture;
            document.getElementById('texture').dispatchEvent(new Event('change'));
        }

        // Close modal
        document.querySelector('.config-modal').remove();

        showNotification('Design loaded successfully!', 'success');

    } catch (error) {
        console.error('Error applying configuration:', error);
        alert('Error loading design: ' + error.message);
    }
};

// Enhanced file upload with Supabase Storage
async function handleFileUploadWithSupabase(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file!');
        return;
    }

    // If Supabase is configured, upload to cloud storage
    if (supabase && isSupabaseConfigured()) {
        try {
            showNotification('Uploading image to cloud...', 'info');

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `designs/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('design-uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase
                .storage
                .from('design-uploads')
                .getPublicUrl(filePath);

            const publicURL = urlData.publicUrl;

            // Save to database
            const { error: dbError } = await supabase
                .from('uploaded_designs')
                .insert([{
                    file_name: file.name,
                    file_url: publicURL,
                    file_type: file.type
                }]);

            if (dbError) throw dbError;

            showNotification('Image uploaded successfully!', 'success');
            console.log('Image uploaded to:', publicURL);

            // Continue with local preview (existing functionality)
            previewUploadedFile(file);

        } catch (error) {
            console.error('Error uploading to Supabase:', error);
            showNotification('Upload failed, using local preview', 'warning');
            // Fall back to local preview
            previewUploadedFile(file);
        }
    } else {
        // No Supabase, just use local preview
        previewUploadedFile(file);
    }
}

// Preview uploaded file locally
function previewUploadedFile(file) {
    const reader = new FileReader();
    const uploadPreview = document.getElementById('upload-preview');

    reader.onload = function(event) {
        uploadPreview.style.display = 'block';
        uploadPreview.style.backgroundImage = `url(${event.target.result})`;

        // Apply to model (existing functionality)
        const svg = document.getElementById('human-model');
        const defs = svg.querySelector('defs');

        const existingPattern = document.getElementById('uploaded-pattern');
        if (existingPattern) {
            existingPattern.remove();
        }

        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', 'uploaded-pattern');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('width', '100');
        pattern.setAttribute('height', '100');

        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('href', event.target.result);
        image.setAttribute('width', '100');
        image.setAttribute('height', '100');

        pattern.appendChild(image);
        defs.appendChild(pattern);

        const outfits = document.querySelectorAll('.outfit');
        outfits.forEach(outfit => {
            outfit.setAttribute('fill', 'url(#uploaded-pattern)');
        });
    };

    reader.readAsDataURL(file);
}

// Show notification to user
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
