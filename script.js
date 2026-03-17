document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const birthdateInput = document.getElementById('birthdate');
    const calculateBtn = document.getElementById('calculateBtn');
    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    const nextBirthdayElement = document.getElementById('nextBirthday');
    const daysUntilBirthdayElement = document.getElementById('daysUntilBirthday');
    const totalDaysElement = document.getElementById('totalDays');
    const resultSection = document.getElementById('resultSection');

    // Establecer fecha máxima (hoy)
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    birthdateInput.setAttribute('max', maxDate);

    // Cargar última fecha guardada
    const savedDate = localStorage.getItem('lastBirthdate');
    if (savedDate) {
        birthdateInput.value = savedDate;
        calculateAge();
    }

    // Event listeners
    calculateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calculateAge();
        
        // Efecto de click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });

    birthdateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateAge();
        }
    });

    function calculateAge() {
        const birthdate = birthdateInput.value;
        
        if (!birthdate) {
            showError('Por favor, selecciona tu fecha de nacimiento');
            return;
        }

        // Guardar en localStorage
        localStorage.setItem('lastBirthdate', birthdate);

        // Calcular edad
        const birth = new Date(birthdate);
        const now = new Date();

        // Validar fecha futura
        if (birth > now) {
            showError('La fecha no puede ser futura');
            return;
        }

        // Calcular años, meses y días
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        // Ajustar días negativos
        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days = lastMonth.getDate() + days;
        }

        // Ajustar meses negativos
        if (months < 0) {
            years--;
            months = 12 + months;
        }

        // Animar los números
        animateNumber(yearsElement, years);
        animateNumber(monthsElement, months);
        animateNumber(daysElement, days);

        // Calcular información adicional
        calculateExtraInfo(birth, now);

        // Mostrar resultados con animación
        resultSection.style.opacity = '0';
        setTimeout(() => {
            resultSection.style.opacity = '1';
        }, 100);
    }

    function animateNumber(element, finalValue) {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function calculateExtraInfo(birthDate, currentDate) {
        // Edad total en días
        const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        animateNumber(totalDaysElement, totalDays);

        // Próximo cumpleaños
        const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday < currentDate) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        // Formatear fecha del próximo cumpleaños
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        nextBirthdayElement.textContent = nextBirthday.toLocaleDateString('es-ES', options);

        // Días hasta el próximo cumpleaños
        const daysUntil = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));
        animateNumber(daysUntilBirthdayElement, daysUntil);
    }

    function showError(message) {
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;

        // Insertar error
        const inputSection = document.querySelector('.input-section');
        inputSection.insertBefore(errorDiv, inputSection.firstChild);

        // Remover error después de 3 segundos
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 3000);
    }

    // Agregar animaciones adicionales al CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(-20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
