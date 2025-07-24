document.addEventListener('DOMContentLoaded', function() {
  const editor = document.getElementById('editor')
  const cvContainer = document.getElementById('cv-container')
  const exportPdfBtn = document.getElementById('export-pdf-btn')
  const previewWrapper = document.getElementById('preview-wrapper')
  const stylePicker = document.getElementById('style-picker')

  const templates = {
    formal: Handlebars.compile(
      document.getElementById('formal-template').innerHTML,
    ),
    modern: Handlebars.compile(
      document.getElementById('modern-template').innerHTML,
    ),
    creative: Handlebars.compile(
      document.getElementById('creative-template').innerHTML,
    ),
    minimalist: Handlebars.compile(
      document.getElementById('minimalist-template').innerHTML,
    ),
    academic: Handlebars.compile(
      document.getElementById('academic-template').innerHTML,
    ),
    professional: Handlebars.compile(
      document.getElementById('professional-template').innerHTML,
    ),
    elegant: Handlebars.compile(
      document.getElementById('elegant-template').innerHTML,
    ),
    impact: Handlebars.compile(
      document.getElementById('impact-template').innerHTML,
    ),
    refined: Handlebars.compile(
      document.getElementById('refined-template').innerHTML,
    ),
    airy: Handlebars.compile(
      document.getElementById('airy-template').innerHTML,
    ),
    executive: Handlebars.compile(
      document.getElementById('executive-template').innerHTML,
    ),
    vibrant: Handlebars.compile(
      document.getElementById('vibrant-template').innerHTML,
    ),
    'modern-serif': Handlebars.compile(
      document.getElementById('modern-serif-template').innerHTML,
    ),
  }

  Handlebars.registerHelper('join', function(arr, sep) {
    return arr.join(sep)
  })

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
      style: 'formal',
    }

    // Populate simple fields
    Object.keys(cvData.personal).forEach(key => {
      const el = document.getElementById(key)
      if (el) el.value = cvData.personal[key]
    })
    document.getElementById('summary').value = cvData.summary
    document.getElementById('skills').value = cvData.skills.join(', ')
    stylePicker.value = cvData.style

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

    const template = templates[cvData.style]
    if (template) {
      cvContainer.innerHTML = template(cvData)
    }
  }

  async function exportToPDF() {
    const twCSS = await fetch(
      'http://localhost:3000/fetch?url=https://cdn.tailwindcss.com',
    ).then(res => res.text())
    const fontCSS = await fetch(
      'http://localhost:3000/fetch?url=https://fonts.googleapis.com/css2?family=Chivo:wght@300;400;700&family=Cormorant+Garamond:wght@700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Fira+Sans:wght@400&family=Inter:wght@400;500;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Noto+Serif:wght@400&family=Open+Sans:wght@400&family=Oxygen:wght@300&family=Playfair+Display:wght@400;700&family=Raleway:wght@300&family=Roboto:wght@700&family=Source+Sans+Pro:wght@400&display=swap',
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
      'p-4 border border-gray-200 rounded-lg bg-white grid grid-cols-[1fr_auto] items-start gap-4'
    experienceItem.setAttribute('data-id', id)
    experienceItem.innerHTML = `
            <div>
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
                <textarea rows="4" placeholder="Description" class="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500" data-field="description">${
      expData.description || ''
    }</textarea>
            </div>
            <div class="flex flex-col gap-1">
                <button class="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors" data-action="move-experience-up" title="Move up">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
                    </svg>
                </button>
                <button class="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors" data-action="move-experience-down" title="Move down">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                </button>
                <button class="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors" data-action="remove-experience" title="Remove experience">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
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
      'p-4 border border-gray-200 rounded-lg bg-white grid grid-cols-[1fr_auto] items-start gap-4'
    educationItem.setAttribute('data-id', id)
    educationItem.innerHTML = `
            <div>
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
            </div>
            <div class="flex flex-col gap-1">
                <button class="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors" data-action="move-education-up" title="Move up">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
                    </svg>
                </button>
                <button class="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors" data-action="move-education-down" title="Move down">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                </button>
                <button class="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors" data-action="remove-education" title="Remove education">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
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
    else if (
      e.target.dataset.action === 'remove-experience'
      || e.target.closest('[data-action="remove-experience"]')
    ) {
      const item = e.target.closest('[data-id]')
      cvData.experience = cvData.experience.filter(entry =>
        entry.id != item.dataset.id
      )
      item.remove()
      renderCV()
      saveState()
    }
    else if (
      e.target.dataset.action === 'remove-education'
      || e.target.closest('[data-action="remove-education"]')
    ) {
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

  stylePicker.addEventListener('change', function(e) {
    cvData.style = e.target.value
    renderCV()
    saveState()
  })

  exportPdfBtn.addEventListener('click', exportToPDF)

  window.addEventListener('resize', scalePreview)
  loadState()
  scalePreview()
  renderCV()
})
