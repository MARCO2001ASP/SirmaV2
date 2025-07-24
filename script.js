// DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const mechanicDashboard = document.getElementById('mechanic-dashboard');
    const clientDashboard = document.getElementById('client-dashboard');
    const appointmentsDashboard = document.getElementById('appointments-dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const mechanicLogout = document.getElementById('mechanic-logout');
    const clientLogout = document.getElementById('client-logout');
    const addNoteBtn = document.getElementById('add-note-btn');
    const goToAppointmentsBtn = document.getElementById('go-to-appointments');
    const noteModal = document.getElementById('note-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelNoteBtn = document.getElementById('cancel-note');
    const saveNoteBtn = document.getElementById('save-note');
    const noteForm = document.getElementById('note-form');
    const modalTitle = document.getElementById('modal-title');
    const noteIdInput = document.getElementById('note-id');
    const noteTitleInput = document.getElementById('note-title');
    const noteCarInput = document.getElementById('note-car');
    const noteClientInput = document.getElementById('note-client');
    const noteMechanicInput = document.getElementById('note-mechanic');
    const noteDescriptionInput = document.getElementById('note-description');
    const mechanicNotesContainer = document.getElementById('mechanic-notes-container');
    const clientNotesContainer = document.getElementById('client-notes-container');
    const emptyNotes = document.getElementById('empty-notes');
    const emptyClientNotes = document.getElementById('empty-client-notes');
    const credentialsModal = document.getElementById('credentials-modal');
    const credentialsModalClose = document.getElementById('credentials-modal-close');
    const confirmCredentialsBtn = document.getElementById('confirm-credentials');
    const generatedUsername = document.getElementById('generated-username');
    const generatedPassword = document.getElementById('generated-password');
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalClose = document.getElementById('delete-modal-close');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const appointmentModal = document.getElementById('appointment-modal');
    const appointmentModalClose = document.getElementById('appointment-modal-close');
    const cancelAppointmentBtn = document.getElementById('cancel-appointment');
    const saveAppointmentBtn = document.getElementById('save-appointment');
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentClientInput = document.getElementById('appointment-client');
    const appointmentCostInput = document.getElementById('appointment-cost');
    const clientAppointmentNotices = document.getElementById('client-appointment-notices');
    const appointmentNoticesContainer = document.getElementById('appointment-notices-container');
    
    // App State
    let currentUser = null;
    let currentNoteId = null;
    let notesToDelete = null;
    let currentCalendarDate = new Date();
    let calendarView = 'month'; // 'month' or 'week'

    // Initialize the app
    function init() {
      // Initial setup
      setupEventListeners();
      checkLoginStatus();
      initializeDatabase();
    }

    // Event Listeners
    function setupEventListeners() {
      // Login form
      loginForm.addEventListener('submit', handleLogin);
      passwordToggle.addEventListener('click', togglePasswordVisibility);
      
      // Logout buttons
      mechanicLogout.addEventListener('click', handleLogout);
      clientLogout.addEventListener('click', handleLogout);
      
      // Note modal
      addNoteBtn.addEventListener('click', openAddNoteModal);
      modalClose.addEventListener('click', closeNoteModal);
      cancelNoteBtn.addEventListener('click', closeNoteModal);
      saveNoteBtn.addEventListener('click', saveNote);
      
      // Credentials modal
      credentialsModalClose.addEventListener('click', closeCredentialsModal);
      confirmCredentialsBtn.addEventListener('click', closeCredentialsModal);
      
      // Delete modal
      deleteModalClose.addEventListener('click', closeDeleteModal);
      cancelDeleteBtn.addEventListener('click', closeDeleteModal);
      confirmDeleteBtn.addEventListener('click', confirmDeleteNote);
      
      // Appointment related listeners - Add existence checks
      if (goToAppointmentsBtn) {
        goToAppointmentsBtn.addEventListener('click', showAppointmentsDashboard);
      }
      
      // Add the back button listener
      const backToMechanicBtn = document.getElementById('back-to-mechanic');
      if (backToMechanicBtn) {
        backToMechanicBtn.addEventListener('click', showMechanicDashboard);
      }
      
      if (document.getElementById('appointments-logout')) {
        document.getElementById('appointments-logout').addEventListener('click', handleLogout);
      }
      
      if (document.getElementById('add-appointment-btn')) {
        document.getElementById('add-appointment-btn').addEventListener('click', openAddAppointmentModal);
      }
      
      if (appointmentModalClose) {
        appointmentModalClose.addEventListener('click', closeAppointmentModal);
      }
      
      if (cancelAppointmentBtn) {
        cancelAppointmentBtn.addEventListener('click', closeAppointmentModal);
      }
      
      if (saveAppointmentBtn) {
        saveAppointmentBtn.addEventListener('click', saveAppointment);
      }

      // Client notification bell
      const bellContainer = document.getElementById('bell-container');
      if (bellContainer) {
        bellContainer.addEventListener('click', openClientNotifModal);
      }
      
      // Notification modal close buttons
      const notifModalClose = document.getElementById('notif-modal-close');
      const closeNotifBtn = document.getElementById('close-notif-btn');
      if (notifModalClose) {
        notifModalClose.addEventListener('click', closeClientNotifModal);
      }
      if (closeNotifBtn) {
        closeNotifBtn.addEventListener('click', closeClientNotifModal);
      }
    }

    // Database Initialization
    function initializeDatabase() {
      // Check if default mechanic user exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Add default mechanic user if not exists
      if (!users.find(user => user.username === 'usermarco')) {
        users.push({
          username: 'usermarco',
          password: 'admin',
          role: 'mechanic'
        });
        
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Initialize notes if not exists
      if (!localStorage.getItem('notes')) {
        localStorage.setItem('notes', JSON.stringify([]));
      }

      // Initialize appointments if not exists
      if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify([]));
      }
    }

    // Authentication
    function handleLogin(e) {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.username === username && user.password === password);
      
      if (user) {
        // Set current user
        currentUser = {
          username: user.username,
          role: user.role
        };
        
        // Store in session
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Navigate to appropriate dashboard
        if (user.role === 'mechanic') {
          showMechanicDashboard();
        } else if (user.role === 'client') {
          showClientDashboard();
        }
        
        // Clear form
        loginForm.reset();
        showToast('Inicio de sesión exitoso', 'success');
      } else {
        showToast('Usuario o contraseña incorrectos', 'error');
      }
    }

    function checkLoginStatus() {
      const user = JSON.parse(sessionStorage.getItem('currentUser'));
      
      if (user) {
        currentUser = user;
        
        if (user.role === 'mechanic') {
          showMechanicDashboard();
        } else if (user.role === 'client') {
          showClientDashboard();
        }
      }
    }

    function handleLogout() {
      // Clear session
      sessionStorage.removeItem('currentUser');
      currentUser = null;
      
      // Show login screen
      hideAllScreens();
      loginScreen.classList.add('active');
      
      showToast('Sesión cerrada correctamente', 'success');
    }

    // Password Toggle
    function togglePasswordVisibility() {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.classList.remove('fa-eye');
        passwordToggle.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        passwordToggle.classList.remove('fa-eye-slash');
        passwordToggle.classList.add('fa-eye');
      }
    }

    // Navigation
    function hideAllScreens() {
      loginScreen.classList.remove('active');
      mechanicDashboard.classList.remove('active');
      clientDashboard.classList.remove('active');
      if (document.getElementById('appointments-dashboard')) {
        document.getElementById('appointments-dashboard').classList.remove('active');
      }
    }

    function showMechanicDashboard() {
      hideAllScreens();
      mechanicDashboard.classList.add('active');
      loadMechanicNotes();
    }

    function showClientDashboard() {
      hideAllScreens();
      clientDashboard.classList.add('active');
      loadClientNotes();
      loadClientAppointments();
    }

    // Note Management
    function loadMechanicNotes() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      mechanicNotesContainer.innerHTML = '';
      
      if (notes.length === 0) {
        emptyNotes.style.display = 'block';
      } else {
        emptyNotes.style.display = 'none';
        
        notes.forEach(note => {
          const noteCard = createNoteCard(note, true);
          mechanicNotesContainer.appendChild(noteCard);
        });
      }
    }

    function loadClientNotes() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      const clientNotes = notes.filter(note => note.client.toLowerCase() === currentUser.username.toLowerCase());
      clientNotesContainer.innerHTML = '';
      
      if (clientNotes.length === 0) {
        emptyClientNotes.style.display = 'block';
      } else {
        emptyClientNotes.style.display = 'none';
        
        clientNotes.forEach(note => {
          const noteCard = createNoteCard(note, false);
          clientNotesContainer.appendChild(noteCard);
        });
      }
    }

    function createNoteCard(note, isMechanic) {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p class="note-detail"><i class="fas fa-car"></i> <span>Carro:</span> ${note.car}</p>
        <p class="note-detail"><i class="fas fa-user"></i> <span>Cliente:</span> ${note.client}</p>
        <p class="note-detail"><i class="fas fa-user-cog"></i> <span>Mecánico:</span> ${note.mechanic || 'N/A'}</p>
        <p class="note-detail"><i class="fas fa-align-left"></i> <span>Descripción:</span> ${note.description || 'N/A'}</p>
        <p class="note-detail"><i class="fas fa-clock"></i> <span>Fecha:</span> ${note.timestamp || 'N/A'}</p>
      `;
      
      if (isMechanic) {
        const actions = document.createElement('div');
        actions.className = 'note-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-action btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditNoteModal(note));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-action btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => openDeleteModal(note.id));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
      }
      
      return card;
    }

    function openAddNoteModal() {
      modalTitle.textContent = 'Nueva Nota';
      noteForm.reset();
      noteIdInput.value = '';
      currentNoteId = null;
      
      noteModal.classList.add('active');
    }

    function openEditNoteModal(note) {
      modalTitle.textContent = 'Editar Nota';
      
      noteIdInput.value = note.id;
      noteTitleInput.value = note.title;
      noteCarInput.value = note.car;
      noteClientInput.value = note.client;
      noteMechanicInput.value = note.mechanic || '';
      noteDescriptionInput.value = note.description || '';
      currentNoteId = note.id;
      
      noteModal.classList.add('active');
    }

    function closeNoteModal() {
      noteModal.classList.remove('active');
    }

    function saveNote() {
      const id = noteIdInput.value || generateId();
      const title = noteTitleInput.value.trim();
      const car = noteCarInput.value.trim();
      const client = noteClientInput.value.trim().toLowerCase();
      const mechanic = noteMechanicInput.value.trim();
      const description = noteDescriptionInput.value.trim();
      const timestamp = new Date().toLocaleString();
      
      if (!title || !car || !client || !mechanic || !description) {
        showToast('Por favor complete todos los campos', 'error');
        return;
      }
      
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      
      // Check if this is a new note
      const isNewNote = !currentNoteId;
      
      if (isNewNote) {
        // Generate password for new client user
        const password = generatePassword();
        
        // Add or update user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if client user already exists
        const clientExists = users.find(user => user.username === client);
        
        if (!clientExists) {
          // Add new client user
          users.push({
            username: client,
            password: password,
            role: 'client'
          });
          
          localStorage.setItem('users', JSON.stringify(users));
          
          // Show generated credentials
          generatedUsername.textContent = client;
          generatedPassword.textContent = password;
          
          // Add new note with new fields
          const newNote = { id, title, car, client, mechanic, description, timestamp };
          notes.push(newNote);
          localStorage.setItem('notes', JSON.stringify(notes));
          
          closeNoteModal();
          credentialsModal.classList.add('active');
        } else {
          // Client already exists, just add the note with new fields
          const newNote = { id, title, car, client, mechanic, description, timestamp };
          notes.push(newNote);
          localStorage.setItem('notes', JSON.stringify(notes));
          
          closeNoteModal();
          showToast('Nota creada correctamente', 'success');
        }
      } else {
        // Update existing note with new fields
        const updatedNotes = notes.map(note => {
          if (note.id === currentNoteId) {
            return { id, title, car, client, mechanic, description, timestamp };
          }
          return note;
        });
        
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        closeNoteModal();
        showToast('Nota actualizada correctamente', 'success');
      }
      
      // Reload notes
      loadMechanicNotes();
    }

    function openDeleteModal(noteId) {
      notesToDelete = noteId;
      deleteModal.classList.add('active');
    }

    function closeDeleteModal() {
      deleteModal.classList.remove('active');
      notesToDelete = null;
    }

    function confirmDeleteNote() {
      if (!notesToDelete) return;
      
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      const updatedNotes = notes.filter(note => note.id !== notesToDelete);
      
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      
      closeDeleteModal();
      loadMechanicNotes();
      showToast('Nota eliminada correctamente', 'success');
    }

    function closeCredentialsModal() {
      credentialsModal.classList.remove('active');
      showToast('Nota creada correctamente', 'success');
    }

    // Appointment Management
    function showAppointmentsDashboard() {
      hideAllScreens();
      appointmentsDashboard.classList.add('active');
      
      try {
        initializeCalendar();
      } catch (error) {
        console.error("FullCalendar failed to load:", error);
        initializeCustomCalendar();
      }
    }

    function initializeCalendar() {
      const calendarEl = document.getElementById('calendar');
      
      try {
        // Check if FullCalendar is available
        if (typeof FullCalendar === 'undefined') {
          throw new Error('FullCalendar is not loaded');
        }
        
        let calendarInstance = null;
        
        if (calendarEl.classList.contains('fc')) {
          // If calendar was already initialized, destroy it
          calendarInstance = calendarEl._calendar;
          if (calendarInstance) {
            calendarInstance.destroy();
          }
        }
        
        calendarInstance = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          themeSystem: 'standard',
          events: loadAppointmentsForCalendar(),
          eventClick: function(info) {
            // Could add functionality to edit appointments here
            alert(`Cita: ${info.event.title}`);
          },
          eventContent: function(arg) {
            if (arg.event.extendedProps.confirmed) {
              // Create container and add check icon for confirmed appointments
              const container = document.createElement('div');
              const icon = document.createElement('i');
              icon.className = 'fas fa-check-circle';
              icon.style.marginRight = '4px';
              icon.style.color = '#4caf50';
              container.appendChild(icon);
              
              const title = document.createElement('span');
              title.innerHTML = arg.event.title;
              container.appendChild(title);
              
              return { domNodes: [container] };
            }
            return;
          }
        });
        
        calendarInstance.render();
        calendarEl._calendar = calendarInstance;
        
        // Hide custom calendar if it was shown
        document.getElementById('custom-calendar').style.display = 'none';
        calendarEl.style.display = 'block';
        
      } catch (error) {
        console.error("Error initializing FullCalendar:", error);
        initializeCustomCalendar();
      }
    }

    function initializeCustomCalendar() {
      console.log("Initializing custom calendar...");
      
      // Hide original calendar and show custom calendar
      document.getElementById('calendar').style.display = 'none';
      document.getElementById('custom-calendar').style.display = 'block';
      
      // Setup event listeners for calendar controls
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      const todayBtn = document.getElementById('today-btn');
      const monthViewBtn = document.getElementById('month-view-btn');
      const weekViewBtn = document.getElementById('week-view-btn');
      
      prevBtn.addEventListener('click', navigatePrevious);
      nextBtn.addEventListener('click', navigateNext);
      todayBtn.addEventListener('click', navigateToday);
      monthViewBtn.addEventListener('click', () => switchView('month'));
      weekViewBtn.addEventListener('click', () => switchView('week'));
      
      // Initial render based on current view
      updateCalendarView();
    }

    function updateCalendarView() {
      if (calendarView === 'month') {
        renderMonthView();
      } else {
        renderWeekView();
      }
      
      // Update title
      updateCalendarTitle();
    }

    function updateCalendarTitle() {
      const titleEl = document.getElementById('calendar-title');
      const options = { year: 'numeric', month: 'long' };
      
      if (calendarView === 'week') {
        // For week view, show range of dates
        const weekStart = getStartOfWeek(currentCalendarDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const startMonth = weekStart.toLocaleDateString('es', { month: 'short' });
        const endMonth = weekEnd.toLocaleDateString('es', { month: 'short' });
        
        if (startMonth === endMonth) {
          titleEl.textContent = `${startMonth} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        } else {
          titleEl.textContent = `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        }
      } else {
        // For month view, show month and year
        titleEl.textContent = currentCalendarDate.toLocaleDateString('es', options);
      }
    }

 


function renderMonthView() {
  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth(),
    1
  );

  // Get the first day of the calendar grid (might be from previous month)
  const firstDayOfGrid = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  firstDayOfGrid.setDate(firstDayOfMonth.getDate() - dayOfWeek);

  renderCalendarHeader();

  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const calendarGrid = document.getElementById('calendar-grid');
  calendarGrid.innerHTML = '';
  calendarGrid.className = 'calendar-grid month-view';

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(firstDayOfGrid);
    currentDate.setDate(firstDayOfGrid.getDate() + i);

    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';

    if (currentDate.getMonth() !== currentCalendarDate.getMonth()) {
      dayEl.classList.add('inactive');
    }

    const today = new Date();
    if (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    ) {
      dayEl.classList.add('today');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = currentDate.getDate();
    dayEl.appendChild(dayNumber);

    const dayEvents = document.createElement('div');
    dayEvents.className = 'day-events';

    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getDate() === currentDate.getDate()
      );
    });

    dayAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      const weekday = appointmentDate.toLocaleDateString('es', { weekday: 'short' });
      const appointmentTime = appointmentDate.toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const eventEl = document.createElement('div');
      eventEl.className = `calendar-event${appointment.confirmed ? ' confirmed' : ''}`;

      // Main content
      if (appointment.confirmed) {
        eventEl.innerHTML = `<i class="fas fa-check-circle"></i>${weekday} ${appointmentTime} – ${appointment.client} - ${appointment.cost}`;
      } else {
        eventEl.textContent = `${weekday} ${appointmentTime} – ${appointment.client} - ${appointment.cost}`;
      }
      eventEl.title = `${weekday} ${appointmentTime} – ${appointment.client} - ${appointment.cost}`;
      eventEl.dataset.id = appointment.id;

      // Compact action buttons (icons only)
      const actionsContainer = document.createElement('span');
      actionsContainer.className = 'calendar-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'calendar-action-btn edit-btn';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.title = 'Editar cita';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editAppointment(appointment.id);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'calendar-action-btn delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.title = 'Eliminar cita';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Seguro que deseas eliminar esta cita?')) {
          deleteAppointment(appointment.id);
        }
      });

      actionsContainer.appendChild(editBtn);
      actionsContainer.appendChild(deleteBtn);
      eventEl.appendChild(actionsContainer);

      dayEvents.appendChild(eventEl);
    });

    dayEl.appendChild(dayEvents);
    calendarGrid.appendChild(dayEl);
  }
}

function renderWeekView() {
  const firstDayOfWeek = getStartOfWeek(currentCalendarDate);

  renderCalendarHeader();

  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const calendarGrid = document.getElementById('calendar-grid');
  calendarGrid.innerHTML = '';
  calendarGrid.className = 'calendar-grid week-view';

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(firstDayOfWeek);
    currentDate.setDate(firstDayOfWeek.getDate() + i);

    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';

    const today = new Date();
    if (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    ) {
      dayEl.classList.add('today');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    if (currentDate.getDate() === 1) {
      const month = currentDate.toLocaleDateString('es', { month: 'short' });
      dayNumber.textContent = `${currentDate.getDate()} ${month}`;
    } else {
      dayNumber.textContent = currentDate.getDate();
    }
    dayEl.appendChild(dayNumber);

    const dayEvents = document.createElement('div');
    dayEvents.className = 'day-events';

    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getDate() === currentDate.getDate()
      );
    });

    dayAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      const weekday = appointmentDate.toLocaleDateString('es', { weekday: 'short' });
      const appointmentTime = appointmentDate.toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const eventEl = document.createElement('div');
      eventEl.className = `calendar-event${appointment.confirmed ? ' confirmed' : ''}`;

      if (appointment.confirmed) {
        eventEl.innerHTML = `<i class="fas fa-check-circle"></i>${weekday} ${appointmentTime} – ${appointment.client} - ${appointment.cost}`;
      } else {
        eventEl.textContent = `${weekday} ${appointmentTime} – ${appointment.client} - ${appointment.cost}`;
      }
      eventEl.title = `${weekday} ${appointmentTime} – ${appointment.client} - ${appointment.cost}`;
      eventEl.dataset.id = appointment.id;

      // Compact action buttons (icons only)
      const actionsContainer = document.createElement('span');
      actionsContainer.className = 'calendar-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'calendar-action-btn edit-btn';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.title = 'Editar cita';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editAppointment(appointment.id);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'calendar-action-btn delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.title = 'Eliminar cita';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Seguro que deseas eliminar esta cita?')) {
          deleteAppointment(appointment.id);
        }
      });

      actionsContainer.appendChild(editBtn);
      actionsContainer.appendChild(deleteBtn);
      eventEl.appendChild(actionsContainer);

      dayEvents.appendChild(eventEl);
    });

    dayEl.appendChild(dayEvents);
    calendarGrid.appendChild(dayEl);
  }
}


   
    function renderCalendarHeader() {
      const headerEl = document.getElementById('calendar-header');
      headerEl.innerHTML = '';
      
      // Day names in Spanish
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      
      // Add each day name to the header
      dayNames.forEach(dayName => {
        const dayEl = document.createElement('div');
        dayEl.textContent = dayName;
        headerEl.appendChild(dayEl);
      });
    }

    function getStartOfWeek(date) {
      const result = new Date(date);
      result.setDate(result.getDate() - result.getDay());
      return result;
    }

    function navigatePrevious() {
      if (calendarView === 'month') {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      } else {
        currentCalendarDate.setDate(currentCalendarDate.getDate() - 7);
      }
      
      updateCalendarView();
    }

    function navigateNext() {
      if (calendarView === 'month') {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      } else {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + 7);
      }
      
      updateCalendarView();
    }

    function navigateToday() {
      currentCalendarDate = new Date();
      updateCalendarView();
    }

    function switchView(view) {
      if (view === calendarView) return;
      
      calendarView = view;
      const monthViewBtn = document.getElementById('month-view-btn');
      const weekViewBtn = document.getElementById('week-view-btn');
      
      if (view === 'month') {
        monthViewBtn.classList.add('active');
        weekViewBtn.classList.remove('active');
      } else {
        monthViewBtn.classList.remove('active');
        weekViewBtn.classList.add('active');
      }
      
      updateCalendarView();
    }

    function loadAppointmentsForCalendar() {
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      
      return appointments.map(appointment => {
        // Get appointment date
        const appointmentDate = new Date(appointment.date);
        
        // Get weekday name and format time
        const weekday = appointmentDate.toLocaleDateString('es', { weekday: 'short' });
        const appointmentTime = appointmentDate.toLocaleTimeString('es', { 
          hour: '2-digit', 
          minute: '2-digit'
        });
        
        return {
          id: appointment.id,
          title: `${weekday} ${appointmentTime} – ${appointment.client} - $${appointment.cost}`,
          start: appointment.date,
          backgroundColor: appointment.confirmed ? '#4caf50' : '#AA1620',
          borderColor: appointment.confirmed ? '#4caf50' : '#AA1620',
          extendedProps: {
            confirmed: appointment.confirmed
          }
        };
      });
    }

    function openAddAppointmentModal() {
      appointmentForm.reset();
      
      // Set minimum date to today
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 16);
      appointmentDateInput.min = formattedDate;
      
      // Load client options
      loadClientOptions();
      
      appointmentModal.classList.add('active');
    }

    function loadClientOptions() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const clients = users.filter(user => user.role === 'client');
      
      // Clear existing options except the first one
      while (appointmentClientInput.options.length > 1) {
        appointmentClientInput.remove(1);
      }
      
      // Add client options
      clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.username;
        option.textContent = client.username;
        appointmentClientInput.appendChild(option);
      });
    }

    function closeAppointmentModal() {
      appointmentModal.classList.remove('active');
    }

    
function saveAppointment() {
  const editingId = appointmentForm.dataset.editingId;
  const date = appointmentDateInput.value;
  const client = appointmentClientInput.value;
  const cost = appointmentCostInput.value;

  if (!date || !client || !cost) {
    showToast('Por favor complete todos los campos', 'error');
    return;
  }

  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  if (editingId) {
    // Editar cita existente
    appointments = appointments.map(appt => {
      if (appt.id === editingId) {
        // Si el cliente cambió, reinicia 'confirmed'
        const wasClientChanged = appt.client !== client;
        return {
          ...appt,
          date,
          client,
          cost,
          confirmed: wasClientChanged ? false : appt.confirmed
        };
      }
      return appt;
    });
    appointmentForm.dataset.editingId = '';
    showToast('Cita editada correctamente', 'success');
  } else {
    // Nueva cita
    const appointment = {
      id: generateId(),
      date: date,
      client: client,
      cost: cost,
      confirmed: false
    };
    appointments.push(appointment);
    showToast('Cita agregada correctamente', 'success');
  }

  localStorage.setItem('appointments', JSON.stringify(appointments));
  closeAppointmentModal();
  initializeCalendar();
}


    
function deleteAppointment(appointmentId) {
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const updatedAppointments = appointments.filter(appt => appt.id !== appointmentId);

  localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  showToast('Cita eliminada correctamente', 'success');

  // Refresca el calendario y las notificaciones
  initializeCalendar();
  loadClientAppointments();
  populateClientAppointmentsList();
}


function editAppointment(appointmentId) {
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const appointment = appointments.find(appt => appt.id === appointmentId);

  if (!appointment) {
    showToast('Cita no encontrada', 'error');
    return;
  }
  
  loadClientOptions();

  // Rellena el formulario de cita con los datos actuales
  appointmentDateInput.value = appointment.date;
  appointmentClientInput.value = appointment.client;
  appointmentCostInput.value = appointment.cost;

  // Guarda el id de la cita que se está editando
  appointmentForm.dataset.editingId = appointmentId;

  appointmentModal.classList.add('active');
}




function loadClientAppointments() {
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const clientAppointments = appointments.filter(
    appt => appt.client.toLowerCase() === currentUser.username.toLowerCase() && !appt.confirmed
  );

  if (clientAppointments.length === 0) {
    clientAppointmentNotices.style.display = 'none';

    // Remove bell badge if exists
    const bellBadge = document.querySelector('.bell-badge');
    if (bellBadge) bellBadge.remove();
  } else {
    clientAppointmentNotices.style.display = 'block';
    appointmentNoticesContainer.innerHTML = '';

    // Add bell badge
    const bellContainer = document.getElementById('bell-container');
    if (bellContainer && !document.querySelector('.bell-badge')) {
      const badge = document.createElement('div');
      badge.className = 'bell-badge';
      bellContainer.appendChild(badge);
    }

    clientAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      // Día largo y hora
      const weekday = appointmentDate.toLocaleDateString('es', { weekday: 'long' });
      const day = appointmentDate.getDate();
      const month = appointmentDate.toLocaleDateString('es', { month: 'long' });
      const year = appointmentDate.getFullYear();
      const appointmentTime = appointmentDate.toLocaleTimeString('es', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      const formattedDate = `${weekday}, ${day} de ${month} ${year} - ${appointmentTime}`;

      const notice = document.createElement('div');
      notice.className = 'appointment-notice';
      notice.innerHTML = `
        <div class="appointment-details">
          <div class="appointment-date">
            <i class="fas fa-calendar"></i> <b>${formattedDate}</b>
          </div>
          <div class="appointment-cost">
            <i class="fas fa-user"></i> Cliente: <b>${appointment.client}</b><br>
            <i class="fas fa-dollar-sign"></i> Costo: <b>$${appointment.cost}</b>
          </div>
        </div>
        <div>
          <button class="btn btn-primary btn-appointment" data-id="${appointment.id}">Enterado</button>
        </div>
      `;
      const confirmBtn = notice.querySelector('button');
      confirmBtn.addEventListener('click', () => confirmAppointment(appointment.id));

      appointmentNoticesContainer.appendChild(notice);
    });
  }
}



    function confirmAppointment(appointmentId) {
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      
      const updatedAppointments = appointments.map(appointment => {
        if (appointment.id === appointmentId) {
          return { ...appointment, confirmed: true };
        }
        return appointment;
      });
      
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      showToast('Cita confirmada correctamente', 'success');
      
      // Reload client appointments
      loadClientAppointments();
      
      // Re-render client appointments list if notification modal is open
      const notifModal = document.getElementById('notif-modal');
      if (notifModal && notifModal.classList.contains('active')) {
        populateClientAppointmentsList();
      }
      
      // Refresh the mechanic calendar if it's currently displayed
      if (appointmentsDashboard.classList.contains('active')) {
        initializeCalendar();
      }
    }

    function openClientNotifModal() {
      const notifModal = document.getElementById('notif-modal');
      if (notifModal) {
        // Just populate the appointment list without calendar
        populateClientAppointmentsList();
        notifModal.classList.add('active');
      }
    }




// ...existing code...
function populateClientAppointmentsList() {
  const clientAppointmentsList = document.getElementById('client-appointments-list');

  // Get the client's appointments
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const clientAppointments = appointments.filter(
    appt => appt.client.toLowerCase() === currentUser.username.toLowerCase()
  );

  // Clear any previous content
  clientAppointmentsList.innerHTML = '';

  // Show the appointments list
  if (clientAppointments.length === 0) {
    clientAppointmentsList.innerHTML = '<p>No tienes citas programadas.</p>';
  } else {
    clientAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      const weekday = appointmentDate.toLocaleDateString('es', { weekday: 'long' });
      const day = appointmentDate.getDate();
      const month = appointmentDate.toLocaleDateString('es', { month: 'long' });
      const year = appointmentDate.getFullYear();
      const appointmentTime = appointmentDate.toLocaleTimeString('es', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      const formattedDate = `${weekday}, ${day} de ${month} ${year} - ${appointmentTime}`;

      // Mostrar el costo tal cual viene del formulario
      const costText = appointment.cost.toString();

      const appointmentItem = document.createElement('div');
      appointmentItem.className = 'credential-item';
      appointmentItem.innerHTML = `
        <div>
          <div class="credential-label"><i class="fas fa-calendar"></i> ${formattedDate}</div>
          <div class="credential-label"><i class="fas fa-user"></i> Cliente: <b>${appointment.client}</b></div>
        </div>
        <div class="credential-value">
          <i class="fas fa-dollar-sign"></i> ${costText}<br>
          <span>${appointment.confirmed ? 'Confirmada' : 'Pendiente'}</span>
        </div>
      `;

      clientAppointmentsList.appendChild(appointmentItem);
    });
  }
}



    function closeClientNotifModal() {
      const notifModal = document.getElementById('notif-modal');
      if (notifModal) {
        notifModal.classList.remove('active');
      }
    }

    // Helper Functions
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function generatePassword() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return password;
    }

    function showToast(message, type) {
      const toastContainer = document.getElementById('toast-container');
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
      `;
      
      toastContainer.appendChild(toast);
      
      // Animate toast in
      setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s forwards';
      }, 10);
      
      // Add event listener to close button
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
          toast.remove();
        }, 300);
      });
      
      // Automatically remove toast after 5 seconds
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = 'slideOut 0.3s forwards';
          setTimeout(() => {
            if (toast.parentNode) {
              toast.remove();
            }
          }, 300);
        }
      }, 5000);
    }

    // Initialize app
    document.addEventListener('DOMContentLoaded', init);