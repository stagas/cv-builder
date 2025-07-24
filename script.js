document.addEventListener('DOMContentLoaded', function() {
  const editor = document.getElementById('editor')
  const cvContainer = document.getElementById('cv-container')
  const exportPdfBtn = document.getElementById('export-pdf-btn')
  const previewWrapper = document.getElementById('preview-wrapper')

  let cvData

  function scalePreview() {
    const scale = previewWrapper.clientWidth / 1050
    cvContainer.style.transform = `scale(${scale})`
  }

  function saveState() {
    localStorage.setItem('cvBuilderData', JSON.stringify(cvData))
  }

  function loadState() {
    const data = JSON.parse(localStorage.getItem('cvBuilderData'))
    cvData = data || {
      personal: { name: '', email: '', phone: '', linkedin: '', github: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
    }

    // Populate simple fields
    Object.keys(cvData.personal).forEach(key => {
      const el = document.getElementById(key)
      if (el) el.value = cvData.personal[key]
    })
    document.getElementById('summary').value = cvData.summary
    document.getElementById('skills').value = cvData.skills.join(', ')

    // Populate dynamic fields
    document.getElementById('experience-list').innerHTML = ''
    cvData.experience.forEach(exp => addExperience(exp))

    document.getElementById('education-list').innerHTML = ''
    cvData.education.forEach(edu => addEducation(edu))
  }

  function renderCV() {
    if (
      Object.values(cvData.personal).every(x => x === '')
      && cvData.summary === '' && cvData.experience.length === 0
      && cvData.education.length === 0 && cvData.skills.length === 0
    ) {
      cvContainer.innerHTML = ''
      return
    }

    cvContainer.innerHTML = `
        <div class="p-16 h-full w-full">
            <div class="relative h-full w-full">
                <!-- Sophisticated Background Pattern -->
                <div class="absolute inset-0 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1200 1600" preserveAspectRatio="xMidYMid slice">
                        <!-- Geometric background pattern -->
                        <defs>
                            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1f2937" stroke-width="1"/>
                            </pattern>
                            <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
                                <circle cx="30" cy="30" r="2" fill="#374151"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)"/>
                        <rect width="100%" height="100%" fill="url(#dots)"/>

                        <!-- Subtle diagonal lines -->
                        <g stroke="#6b7280" stroke-width="0.5" opacity="0.3">
                            <line x1="0" y1="0" x2="1200" y2="400"/>
                            <line x1="0" y1="200" x2="1200" y2="600"/>
                            <line x1="0" y1="400" x2="1200" y2="800"/>
                            <line x1="0" y1="600" x2="1200" y2="1000"/>
                            <line x1="0" y1="800" x2="1200" y2="1200"/>
                            <line x1="0" y1="1000" x2="1200" y2="1400"/>
                            <line x1="0" y1="1200" x2="1200" y2="1600"/>
                        </g>
                    </svg>
                </div>

                <!-- Header with accent bar -->
                <div class="relative z-10">
                    <div class="border-l-8 border-slate-800 pl-8 mb-12">
                        <h1 class="text-5xl font-light text-slate-900 mb-2" style="font-family: 'Chivo', sans-serif; font-weight: 300;">${
      cvData.personal.name || 'Your Name'
    }</h1>
                        <div class="text-slate-600 text-lg space-y-1" style="font-family: 'Chivo', sans-serif; font-weight: 300;">
                            ${
      cvData.personal.email
        ? `<div class="text-blue-700"><a href="mailto:${cvData.personal.email}" target="_blank">${cvData.personal.email}</a></div>`
        : ''
    }
                            ${
      cvData.personal.phone ? `<div>${cvData.personal.phone}</div>` : ''
    }
                            ${
      cvData.personal.linkedin
        ? `<div class="text-blue-700">${cvData.personal.linkedin}</div>`
        : ''
    }
                            ${
      cvData.personal.github
        ? `<div class="text-blue-700"><a href="${cvData.personal.github}" target="_blank">${cvData.personal.github}</a></div>`
        : ''
    }
                        </div>
                    </div>

                    <!-- Professional Summary -->
                    ${
      cvData.summary
        ? `
                    <div class="mb-10">
                        <div class="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-300">
                            <p class="text-slate-700 leading-relaxed text-lg" style="font-family: 'Chivo', sans-serif; font-weight: 300;">${cvData.summary}</p>
                        </div>
                    </div>
                    `
        : ''
    }

                    <!-- Work Experience -->
                    ${
      cvData.experience.length > 0
        ? `
                    <div class="mb-10">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-slate-200" style="font-family: 'Crimson Text', serif;">Professional Experience</h2>
                        <div class="space-y-8">
                            ${
          cvData.experience.map(exp => `
                                <div class="relative pl-8 border-l-2 border-slate-200">
                                    <div class="absolute w-4 h-4 bg-slate-400 rounded-full -left-2 top-1"></div>
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 class="text-2xl -mt-1 font-semibold text-slate-900" style="font-family: 'Crimson Text', serif;">${
            exp.title || 'Job Title'
          }</h3>
                                            <h4 class="text-lg text-slate-700 font-medium" style="font-family: 'Chivo', sans-serif;">${
            exp.company || 'Company'
          }</h4>
                                        </div>
                                        <span class="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full" style="font-family: 'Chivo', sans-serif; font-weight: 300;">${
            exp.startDate || 'Start'
          } — ${exp.endDate || 'End'}</span>
                                    </div>
                                    <p class="text-slate-600 leading-relaxed" style="font-family: 'Chivo', sans-serif; font-weight: 300;">${
            exp.description || 'A description of your role and accomplishments.'
          }</p>
                                </div>
                            `).join('')
        }
                        </div>
                    </div>
                    `
        : ''
    }

                    <!-- Education -->
                    ${
      cvData.education.length > 0
        ? `
                    <div class="mb-10">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-slate-200" style="font-family: 'Crimson Text', serif;">Education</h2>
                        <div class="space-y-6">
                            ${
          cvData.education.map(edu => `
                                <div>
                                    <h3 class="text-xl font-semibold text-slate-900 mb-1" style="font-family: 'Crimson Text', serif;">${
            edu.degree || 'Degree'
          }${edu.field ? ` in ${edu.field}` : ''}</h3>
                                    <div class="flex justify-between items-center">
                                        <p class="text-slate-600 font-medium" style="font-family: 'Chivo', sans-serif;">${
            edu.school || 'Institution'
          }</p>
                                        <span class="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full" style="font-family: 'Chivo', sans-serif; font-weight: 300;">${
            edu.year || 'Year'
          }</span>
                                    </div>
                                </div>
                            `).join('')
        }
                        </div>
                    </div>
                    `
        : ''
    }

                    <!-- Skills -->
                    ${
      cvData.skills.length > 0
        ? `
                    <div class="mb-10">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-slate-200" style="font-family: 'Crimson Text', serif;">Skills</h2>
                        <div class="flex flex-wrap gap-3">
                            ${
          cvData.skills.map(skill =>
            `<span class="bg-slate-100 text-slate-800 font-thin px-4 py-0.5 rounded-xl border border-slate-200" style="font-family: 'Chivo', sans-serif;">${skill}</span>`
          ).join('')
        }
                        </div>
                    </div>
                    `
        : ''
    }
                </div>
            </div>
        </div>
    `
  }

  async function exportToPDF() {
    const twCSS = await fetch(
      'http://localhost:3000/fetch?url=https://cdn.tailwindcss.com',
    ).then(res => res.text())
    const fontCSS = await fetch(
      'http://localhost:3000/fetch?url=https://fonts.googleapis.com/css2?family=Chivo:wght@300;400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap',
    ).then(res => res.text())

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>CV</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>${fontCSS}</style>
            <style>
                body {
                    font-family: 'Chivo', sans-serif;
                    margin: 0;
                    padding: 0;
                    width: 1050px;
                    height: 1485px;
                }
                #cv-container {
                    width: 1050px !important;
                    height: 1485px !important;
                    transform: none !important;
                }
                .serif-font {
                    font-family: 'Crimson Text', serif;
                }
            </style>
        </head>
        <body class="bg-white">
            <div id="cv-container" class="bg-white" style="width: 1050px; height: 1485px;">
                ${cvContainer.innerHTML}
            </div>
        </body>
        </html>
    `

    try {
      const res = await fetch('http://localhost:3000/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      })

      if (!res.ok) {
        throw new Error('Failed to export PDF')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cv.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    catch (error) {
      console.error(error)
      alert('There was an error exporting your CV. Please try again.')
    }
  }

  function addExperience(expData = null) {
    const isNew = !expData
    const id = isNew ? Date.now() : expData.id

    if (isNew) {
      const newExp = {
        id,
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      }
      cvData.experience.push(newExp)
      expData = newExp
    }

    const experienceItem = document.createElement('div')
    experienceItem.className =
      'p-4 border border-gray-200 rounded-lg relative bg-white'
    experienceItem.setAttribute('data-id', id)
    experienceItem.innerHTML = `
            <input type="text" placeholder="Job Title" class="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500" data-field="title" value="${
      expData.title || ''
    }">
            <input type="text" placeholder="Company" class="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500" data-field="company" value="${
      expData.company || ''
    }">
            <div class="grid grid-cols-2 gap-2 mb-2">
                <input type="text" placeholder="Start Date" class="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" data-field="startDate" value="${
      expData.startDate || ''
    }">
                <input type="text" placeholder="End Date" class="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" data-field="endDate" value="${
      expData.endDate || ''
    }">
            </div>
            <textarea placeholder="Description" class="p-2 border border-gray-300 rounded-md w-full h-20 focus:ring-2 focus:ring-blue-500" data-field="description">${
      expData.description || ''
    }</textarea>
            <div class="absolute top-2 right-2 flex gap-1">
                <button class="text-blue-500 hover:text-blue-700 p-1" data-action="move-experience-up" title="Move up">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                    </svg>
                </button>
                <button class="text-blue-500 hover:text-blue-700 p-1" data-action="move-experience-down" title="Move down">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                </button>
                <button class="text-red-500 hover:text-red-700 font-bold text-xl" data-action="remove-experience">&times;</button>
            </div>
        `
    document.getElementById('experience-list').appendChild(experienceItem)

    if (isNew) {
      renderCV()
      saveState()
    }
  }

  function addEducation(eduData = null) {
    const isNew = !eduData
    const id = isNew ? Date.now() : eduData.id

    if (isNew) {
      const newEdu = { id, degree: '', field: '', school: '', year: '' }
      cvData.education.push(newEdu)
      eduData = newEdu
    }

    const educationItem = document.createElement('div')
    educationItem.className =
      'p-4 border border-gray-200 rounded-lg relative bg-white'
    educationItem.setAttribute('data-id', id)
    educationItem.innerHTML = `
            <input type="text" placeholder="Degree" class="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500" data-field="degree" value="${
      eduData.degree || ''
    }">
            <input type="text" placeholder="Field of Study" class="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500" data-field="field" value="${
      eduData.field || ''
    }">
            <input type="text" placeholder="School" class="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500" data-field="school" value="${
      eduData.school || ''
    }">
            <input type="text" placeholder="Year" class="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500" data-field="year" value="${
      eduData.year || ''
    }">
            <div class="absolute top-2 right-2 flex gap-1">
                <button class="text-blue-500 hover:text-blue-700 p-1" data-action="move-education-up" title="Move up">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                    </svg>
                </button>
                <button class="text-blue-500 hover:text-blue-700 p-1" data-action="move-education-down" title="Move down">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                </button>
                <button class="text-red-500 hover:text-red-700 font-bold text-xl" data-action="remove-education">&times;</button>
            </div>
        `
    document.getElementById('education-list').appendChild(educationItem)

    if (isNew) {
      renderCV()
      saveState()
    }
  }

  function moveExperienceUp(id) {
    const index = cvData.experience.findIndex(exp => exp.id == id)
    if (index > 0) {
      ;[cvData.experience[index], cvData.experience[index - 1]] = [
        cvData.experience[index - 1],
        cvData.experience[index],
      ]
      refreshExperienceList()
      renderCV()
      saveState()
    }
  }

  function moveExperienceDown(id) {
    const index = cvData.experience.findIndex(exp => exp.id == id)
    if (index < cvData.experience.length - 1) {
      ;[cvData.experience[index], cvData.experience[index + 1]] = [
        cvData.experience[index + 1],
        cvData.experience[index],
      ]
      refreshExperienceList()
      renderCV()
      saveState()
    }
  }

  function moveEducationUp(id) {
    const index = cvData.education.findIndex(edu => edu.id == id)
    if (index > 0) {
      ;[cvData.education[index], cvData.education[index - 1]] = [
        cvData.education[index - 1],
        cvData.education[index],
      ]
      refreshEducationList()
      renderCV()
      saveState()
    }
  }

  function moveEducationDown(id) {
    const index = cvData.education.findIndex(edu => edu.id == id)
    if (index < cvData.education.length - 1) {
      ;[cvData.education[index], cvData.education[index + 1]] = [
        cvData.education[index + 1],
        cvData.education[index],
      ]
      refreshEducationList()
      renderCV()
      saveState()
    }
  }

  function refreshExperienceList() {
    document.getElementById('experience-list').innerHTML = ''
    cvData.experience.forEach(exp => addExperience(exp))
  }

  function refreshEducationList() {
    document.getElementById('education-list').innerHTML = ''
    cvData.education.forEach(edu => addEducation(edu))
  }

  editor.addEventListener('input', function(e) {
    const { id, value } = e.target
    if (id in cvData.personal) {
      cvData.personal[id] = value
    }
    else if (id === 'summary') {
      cvData.summary = value
    }
    else if (id === 'skills') {
      cvData.skills = value.split(',').map(s => s.trim()).filter(Boolean)
    }
    else {
      const item = e.target.closest('[data-id]')
      if (!item) return

      const list = item.parentElement.id === 'experience-list'
        ? cvData.experience
        : cvData.education
      const entry = list.find(entry => entry.id == item.dataset.id)
      if (entry) {
        entry[e.target.dataset.field] = value
      }
    }
    renderCV()
    saveState()
  })

  editor.addEventListener('click', function(e) {
    if (e.target.id === 'add-experience-btn') {
      addExperience()
    }
    else if (e.target.id === 'add-education-btn') {
      addEducation()
    }
    else if (e.target.dataset.action === 'remove-experience') {
      const item = e.target.closest('[data-id]')
      cvData.experience = cvData.experience.filter(entry =>
        entry.id != item.dataset.id
      )
      item.remove()
      renderCV()
      saveState()
    }
    else if (e.target.dataset.action === 'remove-education') {
      const item = e.target.closest('[data-id]')
      cvData.education = cvData.education.filter(entry =>
        entry.id != item.dataset.id
      )
      item.remove()
      renderCV()
      saveState()
    }
    else if (
      e.target.dataset.action === 'move-experience-up'
      || e.target.closest('[data-action="move-experience-up"]')
    ) {
      const item = e.target.closest('[data-id]')
      moveExperienceUp(item.dataset.id)
    }
    else if (
      e.target.dataset.action === 'move-experience-down'
      || e.target.closest('[data-action="move-experience-down"]')
    ) {
      const item = e.target.closest('[data-id]')
      moveExperienceDown(item.dataset.id)
    }
    else if (
      e.target.dataset.action === 'move-education-up'
      || e.target.closest('[data-action="move-education-up"]')
    ) {
      const item = e.target.closest('[data-id]')
      moveEducationUp(item.dataset.id)
    }
    else if (
      e.target.dataset.action === 'move-education-down'
      || e.target.closest('[data-action="move-education-down"]')
    ) {
      const item = e.target.closest('[data-id]')
      moveEducationDown(item.dataset.id)
    }
  })

  exportPdfBtn.addEventListener('click', exportToPDF)

  window.addEventListener('resize', scalePreview)
  loadState()
  scalePreview()
  renderCV()
})
