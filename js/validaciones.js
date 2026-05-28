document.addEventListener('DOMContentLoaded', function(){
    const medicosPorEspecialidad = {
        clinica: ["Dr. Gomez, Carlos", "Dra. Lopez, Maria"],
        cardio: ["Dr. Perez, Juan", "Dra. Torres, Ana"],
        pediatria: ["Dra. Diaz, Laura", "Dr. Soto, Pablo"],
        ginecologia: ["Dra. Romero, Valeria", "Dra. Castro, Elena"],
        trauma: ["Dr. Ramos, Sergio", "Dr. Herrera, Diego"],
        neuro: ["Dr. Molina, Andres", "Dra. Vargas, Cecilia"]
    };

    // Elements
    const form = document.getElementById('turnoForm');
    const especialidad = document.getElementById('especialidad');
    const medico = document.getElementById('medico');
    const modalidad = document.getElementById('modalidad');
    const plataformaLabel = document.getElementById('plataformaLabel');
    const plataforma = document.getElementById('plataforma');
    const cobertura = document.getElementById('cobertura');
    const credencialLabel = document.getElementById('credencialLabel');
    const credencial = document.getElementById('credencial');
    const planLabel = document.getElementById('planLabel');
    const plan = document.getElementById('plan');
    const primera = document.getElementById('primera');
    const comoNosConocioLabel = document.getElementById('comoNosConocioLabel');
    const comoNosConocio = document.getElementById('comoNosConocio');
    const estudiosPrevios = document.getElementById('estudiosPrevios');
    const descripcionEstudiosLabel = document.getElementById('descripcionEstudiosLabel');
    const descripcionEstudios = document.getElementById('descripcionEstudios');

    // Helper: add/remove message
    function clearMessage(el){
        const next = el.parentElement.querySelector('.mensaje-error');
        if(next) next.remove();
    }
    function showMessage(el, msg){
        clearMessage(el);
        const span = document.createElement('div');
        span.className = 'mensaje-error';
        span.textContent = msg;
        el.parentElement.appendChild(span);
    }
    function setError(el, msg){
        el.classList.remove('campo-ok');
        el.classList.add('campo-error');
        showMessage(el, msg);
    }
    function setOk(el){
        el.classList.remove('campo-error');
        el.classList.add('campo-ok');
        clearMessage(el);
    }

    // Populate medicos
    function poblarMedicos(key){
        medico.innerHTML = '';
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = '-- Seleccione --';
        medico.appendChild(optionDefault);
        if(!key || !medicosPorEspecialidad[key]){
            medico.disabled = true;
            medico.required = false;
            return;
        }
        medicosPorEspecialidad[key].forEach(function(nombre){
            const opt = document.createElement('option');
            opt.value = nombre;
            opt.textContent = nombre;
            medico.appendChild(opt);
        });
        medico.disabled = false;
        medico.required = true;
    }

    especialidad.addEventListener('change', function(){
        poblarMedicos(this.value);
    });

    // Conditional visibility handlers
    modalidad.addEventListener('change', function(){
        if(this.value === 'videoconsulta'){
            plataformaLabel.style.display = '';
            plataforma.disabled = false;
            plataforma.required = true;
        } else {
            plataformaLabel.style.display = 'none';
            plataforma.disabled = true;
            plataforma.required = false;
            plataforma.value = '';
        }
    });

    cobertura.addEventListener('change', function(){
        if(this.value === 'Particular' || this.value === ''){
            credencialLabel.style.display = 'none';
            planLabel.style.display = 'none';
            credencial.disabled = true;
            plan.disabled = true;
            credencial.required = false;
            plan.required = false;
            credencial.value = '';
            plan.value = '';
        } else {
            credencialLabel.style.display = '';
            planLabel.style.display = '';
            credencial.disabled = false;
            plan.disabled = false;
            credencial.required = true;
            plan.required = true;
        }
    });

    primera.addEventListener('change', function(){
        if(this.checked){
            comoNosConocioLabel.style.display = '';
            comoNosConocio.disabled = false;
            comoNosConocio.required = true;
        } else {
            comoNosConocioLabel.style.display = 'none';
            comoNosConocio.disabled = true;
            comoNosConocio.required = false;
            comoNosConocio.value = '';
        }
    });

    estudiosPrevios.addEventListener('change', function(){
        if(this.checked){
            descripcionEstudiosLabel.style.display = '';
            descripcionEstudios.disabled = false;
            descripcionEstudios.required = true;
        } else {
            descripcionEstudiosLabel.style.display = 'none';
            descripcionEstudios.disabled = true;
            descripcionEstudios.required = false;
            descripcionEstudios.value = '';
        }
    });

    // Validation helpers
    function validarNombre(value){
        if(!value) return 'Campo obligatorio';
        const re = /^[A-Za-zÀ-ÿÑñ\s]+$/;
        if(!re.test(value)) return 'Solo letras y espacios';
        return '';
    }
    function validarDNI(value){
        if(!value) return 'Campo obligatorio';
        if(!/^\d{7,8}$/.test(value)) return 'DNI debe tener 7 u 8 dígitos';
        return '';
    }
    function validarEmail(value){
        if(!value) return 'Campo obligatorio';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!re.test(value)) return 'Email no válido';
        return '';
    }
    function validarTelefono(value){
        if(!value) return 'Campo obligatorio';
        const digits = value.replace(/\D/g,'');
        if(digits.length < 8) return 'Teléfono debe tener al menos 8 dígitos';
        if(!/^[0-9+\-\s()]+$/.test(value)) return 'Teléfono contiene caracteres inválidos';
        return '';
    }
    function validarNacimiento(value){
        if(!value) return 'Campo obligatorio';
        const hoy = new Date();
        const fecha = new Date(value + 'T00:00:00');
        if(isNaN(fecha)) return 'Fecha inválida';
        if(fecha > hoy) return 'La fecha no puede ser futura';
        // edad
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const m = hoy.getMonth() - fecha.getMonth();
        if(m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
        if(edad < 0 || edad > 120) return 'Edad fuera de rango (0-120)';
        return '';
    }

    function validarFechaTurno(fechaValue, horaValue){
        if(!fechaValue) return 'Campo obligatorio';
        if(!horaValue) return 'Campo obligatorio';
        const now = new Date();
        const turno = new Date(fechaValue + 'T' + horaValue + ':00');
        if(isNaN(turno)) return 'Fecha u hora inválida';
        // must be at least 24 hours ahead
        const diffMs = turno - now;
        if(diffMs < 24 * 60 * 60 * 1000) return 'El turno debe solicitarse con al menos 24 horas de anticipación';
        // weekday (1-5)
        const day = turno.getDay(); // 0=domingo,6=sab
        if(day === 0 || day === 6) return 'Los turnos solo se asignan de lunes a viernes';
        return '';
    }

    function validarHoraHorario(horaValue){
        if(!horaValue) return 'Campo obligatorio';
        const parts = horaValue.split(':');
        if(parts.length < 2) return 'Hora inválida';
        const hh = parseInt(parts[0],10);
        const mm = parseInt(parts[1],10);
        if(isNaN(hh) || isNaN(mm)) return 'Hora inválida';
        if(hh < 8 || hh > 20) return 'Horario de atención: 08:00 a 20:00';
        // if hh==20, mm must be 0 (allow 20:00 exactly)
        if(hh === 20 && mm > 0) return 'Horario de atención: hasta las 20:00';
        return '';
    }

    function validarCredencial(value){
        if(!value) return 'Campo obligatorio';
        const v = value.replace(/\s/g,'');
        if(!/^[A-Za-z0-9]{5,}$/.test(v)) return 'Número de credencial debe tener al menos 5 caracteres alfanuméricos';
        return '';
    }

    // On submit
    form.addEventListener('submit', function(e){
        e.preventDefault();
        // remove previous confirmation
        const prevConfirm = document.getElementById('confirmMessage');
        if(prevConfirm) prevConfirm.remove();

        let errors = [];

        // Section 1
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const dni = document.getElementById('dni');
        const email = document.getElementById('email');
        const telefono = document.getElementById('telefono');
        const nacimiento = document.getElementById('nacimiento');

        // validate nombre
        let msg = validarNombre(nombre.value.trim());
        if(msg) { setError(nombre, msg); errors.push(nombre); } else setOk(nombre);

        msg = validarNombre(apellido.value.trim());
        if(msg) { setError(apellido, msg); errors.push(apellido); } else setOk(apellido);

        msg = validarDNI(dni.value.trim());
        if(msg) { setError(dni, msg); errors.push(dni); } else setOk(dni);

        msg = validarEmail(email.value.trim());
        if(msg) { setError(email, msg); errors.push(email); } else setOk(email);

        msg = validarTelefono(telefono.value.trim());
        if(msg) { setError(telefono, msg); errors.push(telefono); } else setOk(telefono);

        msg = validarNacimiento(nacimiento.value);
        if(msg) { setError(nacimiento, msg); errors.push(nacimiento); } else setOk(nacimiento);

        // Section 2
        const tipo_consulta = document.getElementById('tipo_consulta');
        const fecha_turno = document.getElementById('fecha_turno');
        const hora_turno = document.getElementById('hora_turno');
        const modalidadEl = document.getElementById('modalidad');

        if(!especialidad.value){ setError(especialidad, 'Seleccione una especialidad'); errors.push(especialidad); } else setOk(especialidad);

        if(!medico.disabled){
            if(!medico.value){ setError(medico, 'Seleccione un médico'); errors.push(medico); } else setOk(medico);
        }

        if(!tipo_consulta.value){ setError(tipo_consulta, 'Seleccione el tipo de consulta'); errors.push(tipo_consulta); } else setOk(tipo_consulta);

        msg = validarFechaTurno(fecha_turno.value, hora_turno.value);
        if(msg){ setError(fecha_turno, msg); errors.push(fecha_turno); } else setOk(fecha_turno);

        msg = validarHoraHorario(hora_turno.value);
        if(msg){ setError(hora_turno, msg); errors.push(hora_turno); } else setOk(hora_turno);

        if(!modalidadEl.value){ setError(modalidadEl, 'Seleccione la modalidad'); errors.push(modalidadEl); } else setOk(modalidadEl);

        if(modalidadEl.value === 'videoconsulta'){
            if(!plataforma.value){ setError(plataforma, 'Seleccione la plataforma'); errors.push(plataforma); } else setOk(plataforma);
        }

        // Section 3
        if(!cobertura.value){ setError(cobertura, 'Seleccione una cobertura'); errors.push(cobertura); } else setOk(cobertura);

        if(cobertura.value && cobertura.value !== 'Particular'){
            msg = validarCredencial(credencial.value.trim());
            if(msg){ setError(credencial, msg); errors.push(credencial); } else setOk(credencial);

            if(!plan.value.trim()){ setError(plan, 'Ingrese el nombre del plan'); errors.push(plan); } else setOk(plan);
        }

        // Section 4
        if(primera.checked){
            if(!comoNosConocio.value){ setError(comoNosConocio, 'Indique cómo nos conoció'); errors.push(comoNosConocio); } else setOk(comoNosConocio);
        }

        const motivo = document.getElementById('motivo');
        if(!motivo.value || motivo.value.trim().length < 20){ setError(motivo, 'El motivo debe tener al menos 20 caracteres'); errors.push(motivo); } else setOk(motivo);

        if(estudiosPrevios.checked){
            if(!descripcionEstudios.value || descripcionEstudios.value.trim().length < 20){ setError(descripcionEstudios, 'Describa los estudios (mínimo 20 caracteres)'); errors.push(descripcionEstudios); } else setOk(descripcionEstudios);
        }

        if(errors.length){
            // scroll to first
            const first = errors[0];
            first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // All valid -> show confirmation
        const turnoNum = 'TURN-' + String(Math.floor(10000 + Math.random() * 90000));
        const nombrePaciente = nombre.value.trim() + ' ' + apellido.value.trim();
        const especialidadTexto = especialidad.options[especialidad.selectedIndex].text;
        const fechaTexto = fecha_turno.value;
        const horaTexto = hora_turno.value;

        const div = document.createElement('div');
        div.id = 'confirmMessage';
        div.style.background = '#ecfdf5';
        div.style.border = '1px solid #16a34a';
        div.style.padding = '16px';
        div.style.borderRadius = '8px';
        div.style.marginBottom = '16px';
        div.innerHTML = `<strong>Turno solicitado: ${turnoNum}</strong><br>
            Paciente: ${nombrePaciente}<br>
            Especialidad: ${especialidadTexto}<br>
            Fecha: ${fechaTexto} Hora: ${horaTexto}`;

        form.parentElement.insertBefore(div, form);
        // Optionally clear form
        form.reset();
        // hide conditional fields after reset
        medico.innerHTML = '<option value="">-- Seleccione especialidad --</option>';
        medico.disabled = true;
        plataformaLabel.style.display = 'none'; plataforma.disabled = true;
        credencialLabel.style.display = 'none'; planLabel.style.display = 'none';
        credencial.disabled = true; plan.disabled = true; comoNosConocio.disabled = true; descripcionEstudios.disabled = true;
    });

    // Initialize: ensure conditional fields hidden/disabled
    (function init(){
        medico.disabled = true; medico.required = false;
        plataformaLabel.style.display = 'none'; plataforma.disabled = true;
        credencialLabel.style.display = 'none'; planLabel.style.display = 'none';
        credencial.disabled = true; plan.disabled = true; comoNosConocio.disabled = true; descripcionEstudios.disabled = true;
    })();

});
