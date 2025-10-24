// CONFIGURACIÓN EMAILJS CON TUS DATOS REALES
const currentConfig = {
    PUBLIC_KEY: "svoVJvVfVFs5kcSDl",
    SERVICE_ID: "service_g6eersq", 
    TEMPLATE_ID: "template_tcuw0sr"
};

let emailjsReady = false;

// INICIALIZAR EMAILJS
function initializeEmailJS() {
    if (!currentConfig.PUBLIC_KEY) {
        console.error("❌ Public Key no configurada");
        showError("Configuración de EmailJS incompleta.");
        return false;
    }
    
    try {
        emailjs.init(currentConfig.PUBLIC_KEY);
        emailjsReady = true;
        console.log("✅ EmailJS inicializado correctamente");
        return true;
    } catch (error) {
        console.error("❌ Error inicializando EmailJS:", error);
        showError("Error al inicializar el servicio de email.");
        return false;
    }
}

// VERIFICAR CONFIGURACIÓN
function testEmailJSConfiguration() {
    const required = ['PUBLIC_KEY', 'SERVICE_ID', 'TEMPLATE_ID'];
    const missing = required.filter(key => !currentConfig[key]);
    
    if (missing.length > 0) {
        console.error("❌ Configuración faltante:", missing);
        showError("Configuración de EmailJS incompleta. Verifica los IDs.");
        return false;
    }
    
    console.log("✅ Configuración EmailJS verificada");
    console.log("🔑 Public Key:", currentConfig.PUBLIC_KEY);
    console.log("🏢 Service ID:", currentConfig.SERVICE_ID);
    console.log("📄 Template ID:", currentConfig.TEMPLATE_ID);
    return true;
}

// CUANDO LA PÁGINA CARGUE
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Página cargada - Centro Psicológico de Especialidades");
    
    // Verificar configuración primero
    if (!testEmailJSConfiguration()) {
        return;
    }
    
    // Configurar componentes
    setupFormHandler();
    setupSmoothScrolling();
    
    // Inicializar EmailJS
    if (!initializeEmailJS()) {
        showConfigurationInstructions();
    }
});

// CONFIGURAR FORMULARIO
function setupFormHandler() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
        console.log("✅ Formulario configurado");
    }
}

// MANEJAR ENVÍO DEL FORMULARIO
function handleFormSubmit(form) {
    console.log("📝 Procesando solicitud de cita...");
    
    if (!validateForm()) {
        return;
    }
    
    if (!emailjsReady) {
        showError("⚠️ El servicio de email no está listo. Recargue la página.");
        return;
    }
    
    // Preparar datos para el email
    const formData = {
        from_name: document.getElementById('name').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim(),
        date: new Date().toLocaleString('es-EC'),
        to_email: "williamfernando1981@gmail.com",
        subject: "Nueva Cita - Centro Psicológico"
    };
    
    console.log("📤 Enviando datos a EmailJS...", formData);
    
    // Mostrar estado de carga
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO SOLICITUD...';
    
    hideAllMessages();
    
    // ENVIAR EMAIL CON EMAILJS
    emailjs.send(currentConfig.SERVICE_ID, currentConfig.TEMPLATE_ID, formData)
        .then(function(response) {
            console.log("✅ ÉXITO - Email enviado:", response);
            showSuccess();
            form.reset();
            
            // Mostrar información en consola para WhatsApp
            mostrarInfoWhatsApp(formData);
            
        })
        .catch(function(error) {
            console.error("❌ ERROR EmailJS:", error);
            
            let errorMsg = "No se pudo enviar la solicitud. ";
            
            if (error?.status === 400) {
                errorMsg += "Error en la configuración. Verifica Service ID y Template ID.";
            } else if (error?.status === 401) {
                errorMsg += "Error de autenticación. Verifica tu Public Key.";
            } else if (error?.status === 429) {
                errorMsg += "Límite de envíos excedido. Intenta más tarde.";
            } else {
                errorMsg += "Por favor, contáctanos directamente por WhatsApp.";
            }
            
            showError(errorMsg);
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
}

// MOSTRAR INFORMACIÓN PARA WHATSAPP EN CONSOLA
function mostrarInfoWhatsApp(formData) {
    const mensajeWhatsApp = `🚨 *NUEVA SOLICITUD DE CITA* 🚨

*👤 PACIENTE:* ${formData.from_name}
*📧 EMAIL:* ${formData.from_email}
*📞 TELÉFONO:* ${formData.phone}
*🎯 SERVICIO:* ${formData.service}
*⏰ FECHA SOLICITUD:* ${formData.date}

*💬 MOTIVO DE CONSULTA:*
${formData.message}

*📍 CENTRO PSICOLÓGICO DE ESPECIALIDADES*
*⚡ CONTACTAR DENTRO DE 24 HORAS*`;

    const telefonoWhatsApp = "593984001305";
    const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
    const enlaceWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${mensajeCodificado}`;
    
    console.log("📲 ===== INFORMACIÓN PARA WHATSAPP =====");
    console.log("🔗 Enlace directo para notificar:");
    console.log(enlaceWhatsApp);
    console.log("📝 Mensaje para copiar:");
    console.log(mensajeWhatsApp);
    console.log("=========================================");
}

// MOSTRAR INSTRUCCIONES DE CONFIGURACIÓN
function showConfigurationInstructions() {
    const instructions = `
🔧 CONFIGURACIÓN EMAILJS - VERIFICAR

Datos actuales:
• Public Key: ${currentConfig.PUBLIC_KEY}
• Service ID: ${currentConfig.SERVICE_ID}  
• Template ID: ${currentConfig.TEMPLATE_ID}

Si el formulario no funciona:
1. Verifica que los IDs sean correctos en EmailJS
2. Confirma que el template esté publicado
3. Revisa que el servicio de email esté conectado
    `;
    
    console.warn(instructions);
}

// VALIDACIÓN DEL FORMULARIO
function validateForm() {
    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        service: document.getElementById('service'),
        message: document.getElementById('message')
    };
    
    // Limpiar estilos de error
    Object.values(fields).forEach(field => {
        if (field) field.style.borderColor = '';
    });
    
    let isValid = true;
    let errorMessage = "";
    
    if (!fields.name.value.trim()) {
        fields.name.style.borderColor = '#dc2626';
        errorMessage = "Por favor ingresa tu nombre completo";
        isValid = false;
    }
    else if (!fields.email.value.trim()) {
        fields.email.style.borderColor = '#dc2626';
        errorMessage = "Por favor ingresa tu email";
        isValid = false;
    }
    else if (!isValidEmail(fields.email.value.trim())) {
        fields.email.style.borderColor = '#dc2626';
        errorMessage = "Por favor ingresa un email válido";
        isValid = false;
    }
    else if (!fields.phone.value.trim()) {
        fields.phone.style.borderColor = '#dc2626';
        errorMessage = "Por favor ingresa tu teléfono";
        isValid = false;
    }
    else if (!fields.service.value) {
        fields.service.style.borderColor = '#dc2626';
        errorMessage = "Por favor selecciona un servicio";
        isValid = false;
    }
    else if (!fields.message.value.trim()) {
        fields.message.style.borderColor = '#dc2626';
        errorMessage = "Por favor ingresa tu mensaje o motivo de consulta";
        isValid = false;
    }
    
    if (!isValid) {
        showError(errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccess() {
    const element = document.getElementById('confirmationMessage');
    if (element) {
        element.style.display = 'flex';
        element.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>¡Solicitud Enviada Exitosamente! ✅</h4>
                <p>Hemos recibido tu solicitud de cita. Te contactaremos en menos de 24 horas.</p>
                <div style="background: #e8f5e8; padding: 10px; border-radius: 5px; margin-top: 10px; font-size: 14px;">
                    <strong>📞 Teléfono de contacto:</strong> +593 98 400 1305<br>
                    <strong>📧 Email:</strong> williamfernando1981@gmail.com
                </div>
            </div>
        `;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => element.style.display = 'none', 8000);
    }
}

function showError(message) {
    const element = document.getElementById('errorMessage');
    const textElement = document.getElementById('errorText');
    
    if (element && textElement) {
        textElement.textContent = message;
        element.style.display = 'flex';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => element.style.display = 'none', 5000);
    }
}

function hideAllMessages() {
    const success = document.getElementById('confirmationMessage');
    const error = document.getElementById('errorMessage');
    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// FUNCIÓN PARA DEBUG - VER ESTADO ACTUAL
window.checkEmailStatus = function() {
    console.log("=== 🔍 ESTADO ACTUAL EMAILJS ===");
    console.log("✅ SDK Disponible:", typeof emailjs !== 'undefined');
    console.log("✅ Inicializado:", emailjsReady);
    console.log("🔑 Public Key:", currentConfig.PUBLIC_KEY);
    console.log("🏢 Service ID:", currentConfig.SERVICE_ID);
    console.log("📄 Template ID:", currentConfig.TEMPLATE_ID);
    console.log("================================");
};

// Mensaje de bienvenida en consola
console.log('%c¡Centro Psicológico de Especialidades!', 'color: #b84a39; font-size: 16px; font-weight: bold;');
console.log('%cSistema de citas activo ✅', 'color: #25D366; font-weight: bold;');
console.log('Usa checkEmailStatus() para ver el estado de EmailJS');