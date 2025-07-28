let selectedCipher = "Caesar";

document.addEventListener("DOMContentLoaded", () => {
  toggleExtraInput(selectedCipher);
  setupCipherMenu();
  document.getElementById("decryptBtn").addEventListener("click", decrypt);
  document.getElementById("bruteForceBtn").addEventListener("click", bruteForceCaesar);
});

function setupCipherMenu() {
  document.querySelectorAll("#cipherMenu .dropdown-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      selectedCipher = item.dataset.cipher;
      document.getElementById("dropdownCipher").textContent = selectedCipher;

      document.querySelectorAll("#cipherMenu .dropdown-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      toggleExtraInput(selectedCipher);
    });
  });
}

function toggleExtraInput(cipher) {
  const container = document.getElementById("extraInputContainer");
  const bruteBtn = document.getElementById("bruteForceBtn");
  container.innerHTML = "";

  if (cipher === "Caesar") {
    bruteBtn.style.display = "block";
    const shiftDropdown = Array.from({ length: 25 }, (_, i) => 
      `<li><a class="dropdown-item ${i === 0 ? 'active' : ''}" href="#" data-shift="${i + 1}">${i + 1}</a></li>`
    ).join("");

    container.innerHTML = `
      <label class="form-label">Shift:</label>
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle w-100" id="dropdownShift" data-bs-toggle="dropdown">1</button>
        <ul class="dropdown-menu w-100" id="shiftMenu">${shiftDropdown}</ul>
      </div>
    `;

    document.querySelectorAll("#shiftMenu .dropdown-item").forEach(item => {
      item.addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("dropdownShift").textContent = item.dataset.shift;
        document.querySelectorAll("#shiftMenu .dropdown-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
      });
    });

  } else if (cipher === "Vigenere") {
    bruteBtn.style.display = "none";
    container.innerHTML = `
      <label class="form-label">Kunci:</label>
      <input type="text" id="key" class="form-control bg-dark text-light" placeholder="Masukkan kunci huruf..." />
    `;
  } else {
    bruteBtn.style.display = "none";
  }
}

function decrypt() {
  const text = document.getElementById("encryptedText").value.trim();
  if (!text) return showNotification("Masukkan teks yang akan didekripsi!", "error");

  let result = "";
  try {
    if (selectedCipher === "Caesar") {
      const shift = parseInt(document.getElementById("dropdownShift").textContent);
      result = decryptCaesar(text, shift);
    } else if (selectedCipher === "ROT13") {
      result = decryptCaesar(text, 13);
    } else if (selectedCipher === "Atbash") {
      result = decryptAtbash(text);
    } else if (selectedCipher === "Vigenere") {
      const key = document.getElementById("key").value.trim();
      if (!/^[a-zA-Z]+$/.test(key)) {
        return showNotification("Kunci harus huruf saja!", "error");
      }
      result = decryptVigenere(text, key);
    }
    document.getElementById("outputText").value = result;
  } catch (e) {
    showNotification("Terjadi kesalahan: " + e.message, "error");
  }
}

function bruteForceCaesar() {
  const text = document.getElementById("encryptedText").value.trim();
  if (!text) return showNotification("Masukkan teks terlebih dahulu!", "error");

  let result = "🔍 Brute-force Caesar:\n\n";
  for (let i = 1; i < 26; i++) {
    result += `Shift ${i}: ${decryptCaesar(text, i)}\n`;
  }
  document.getElementById("outputText").value = result;
}

function copyResult(button) {
  const output = document.getElementById("outputText").value.trim();
  if (!output) return showNotification("Tidak ada hasil untuk disalin!", "error");

  navigator.clipboard.writeText(output).then(() => {
    button.innerHTML = "✅ Disalin!";
    showNotification("Teks berhasil disalin!");
    setTimeout(() => button.innerHTML = "📋 Copy", 2000);
  }).catch(err => {
    showNotification("Gagal menyalin teks: " + err, "error");
  });
}

function decryptCaesar(text, shift) {
  return [...text].map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const base = c === c.toLowerCase() ? 97 : 65;
      return String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
    }
    return c;
  }).join('');
}

function decryptAtbash(text) {
  return [...text].map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const base = c === c.toLowerCase() ? 97 : 65;
      return String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
    }
    return c;
  }).join('');
}

function decryptVigenere(text, key) {
  key = key.toLowerCase();
  let result = "", j = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-zA-Z]/.test(c)) {
      const base = c === c.toLowerCase() ? 97 : 65;
      const shift = key.charCodeAt(j % key.length) - 97;
      result += String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
      j++;
    } else {
      result += c;
    }
  }
  return result;
}

function showNotification(msg, type = "info") {
  const container = document.getElementById("notification-container");
  const div = document.createElement("div");
  div.className = `notification ${type}`;
  div.textContent = msg;
  container.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}