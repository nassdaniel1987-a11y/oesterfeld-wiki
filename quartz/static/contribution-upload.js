const contributionForm = document.querySelector("[data-drive-upload-form]")
const contributionStatus = document.querySelector("[data-contribution-status]")
const contributionSessionKey = "contentSuggestionSent"

const setContributionStatus = (message) => {
  if (contributionStatus) {
    contributionStatus.textContent = message
  }
}

const submitContributionToNetlify = async (form) => {
  const formData = new FormData(form)
  formData.delete("attachment")
  const body = new URLSearchParams()

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      body.append(key, value)
    }
  }

  const response = await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  if (!response.ok) {
    throw new Error("Netlify form submission failed")
  }
}

const uploadContributionFile = async (file) => {
  const uploadData = new FormData()
  uploadData.append("attachment", file)

  const response = await fetch("/api/upload-to-drive", {
    method: "POST",
    body: uploadData,
  })
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.error || "Upload fehlgeschlagen")
  }

  return result
}

if (contributionForm instanceof HTMLFormElement) {
  contributionForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const submitButton = contributionForm.querySelector("button[type='submit']")
    const linkInput = contributionForm.elements.namedItem("article_url")
    const fileInput = contributionForm.elements.namedItem("attachment")
    const driveUrlInput = contributionForm.elements.namedItem("drive_file_url")
    const driveNameInput = contributionForm.elements.namedItem("drive_file_name")
    const linkValue = linkInput instanceof HTMLInputElement ? linkInput.value.trim() : ""
    const file = fileInput instanceof HTMLInputElement ? fileInput.files?.[0] : undefined

    if (!linkValue && !file) {
      setContributionStatus("Bitte fuege einen Link ein oder haenge ein Dokument an.")
      return
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true
    }

    try {
      if (file) {
        setContributionStatus("Dokument wird in Google Drive hochgeladen...")
        const uploadedFile = await uploadContributionFile(file)

        if (driveUrlInput instanceof HTMLInputElement) {
          driveUrlInput.value = uploadedFile.url || ""
        }
        if (driveNameInput instanceof HTMLInputElement) {
          driveNameInput.value = uploadedFile.name || file.name
        }
      }

      setContributionStatus("Vorschlag wird gesendet...")
      await submitContributionToNetlify(contributionForm)
      sessionStorage.setItem(contributionSessionKey, "1")
      window.location.href = "/danke"
    } catch (error) {
      console.error(error)
      setContributionStatus(
        "Das hat noch nicht geklappt. Bitte pruefe die Datei oder sende stattdessen einen Cloud-Link.",
      )

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false
      }
    }
  })
}
