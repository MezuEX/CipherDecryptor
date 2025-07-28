let selectedCipher = "Caesar";
toggleExtraInput("Caesar");

// Dropdown selection handler
document.querySelectorAll("#cipherMenu .dropdown-item").forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    selectedCipher = this.getAttribute("data-cipher");
    document.getElementById("dropdownCipher").textContent = selectedCipher;

    document.querySelectorAll("#cipherMenu .dropdown-item").forEach(i => i.classList.remove("active"));
    this.classList.add("active");

    toggleExtraInput(selectedCipher);
  });
});

function toggleExtraInput(cipher) {
  const container = document.getElementById("extraInputContainer");
  const bruteBtn = document.getElementById("bruteForceBtn");
  container.innerHTML = "";

  if (cipher === "Caesar") {
    bruteBtn.style.display = "block";
    container.innerHTML = `
      <label class="form-label">Shift:</label>
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle w-100" type="button" id="dropdownShift" data-bs-toggle="dropdown" aria-expanded="false">
          1
        </button>
        <ul class="dropdown-menu w-100" id="shiftMenu">
          ${Array.from({ length: 25 }, (_, i) => `<li><a class="dropdown-item ${i === 0 ? 'active' : ''}" href="#" data-shift="${i + 1}">${i + 1}</a></li>`).join('')}
        </ul>
      </div>
    `;

    document.querySelectorAll("#shiftMenu .dropdown-item").forEach(item => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("dropdownShift").textContent = this.getAttribute("data-shift");
        document.querySelectorAll("#shiftMenu .dropdown-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");
      });
    });
  } else if (cipher === "Vigenere") {
    bruteBtn.style.display = "none";
    container.innerHTML = `
      <label for="key" class="form-label">Kunci:</label>
      <input type="text" id="key" class="form-control bg-dark text-light" placeholder="Masukkan kunci huruf..." />
    `;
  } else {
    bruteBtn.style.display = "none";
  }
}

function decrypt() {
  const text = document.getElementById("encryptedText").value;
  let result = "";

  if (!text.trim()) {
    alert("Masukkan teks yang akan didekripsi!");
    return;
  }

  try {
    if (selectedCipher === "Caesar") {
      const shift = parseInt(document.getElementById("dropdownShift").textContent);
      result = decryptCaesar(text, shift);
    } else if (selectedCipher === "ROT13") {
      result = decryptCaesar(text, 13);
    } else if (selectedCipher === "Atbash") {
      result = decryptAtbash(text);
    } else if (selectedCipher === "Vigenere") {
      const key = document.getElementById("key").value;
      if (!/^[a-zA-Z]+$/.test(key)) {
        alert("Kunci harus terdiri dari huruf saja!");
        return;
      }
      result = decryptVigenere(text, key);
    }

    document.getElementById("outputText").value = result;
  } catch (e) {
    alert("Terjadi kesalahan: " + e.message);
  }
}

function decryptCaesar(text, shift) {
  return [...text].map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toLowerCase() ? 97 : 65;
      return String.fromCharCode((char.charCodeAt(0) - base - shift + 26) % 26 + base);
    }
    return char;
  }).join('');
}

function decryptAtbash(text) {
  return [...text].map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toLowerCase() ? 97 : 65;
      return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
    }
    return char;
  }).join('');
}

function decryptVigenere(text, key) {
  key = key.toLowerCase();
  let keyIndex = 0;
  let result = "";

  for (let char of text) {
    if (/[a-zA-Z]/.test(char)) {
      const shift = key.charCodeAt(keyIndex % key.length) - 97;
      const base = char === char.toLowerCase() ? 97 : 65;
      result += String.fromCharCode((char.charCodeAt(0) - base - shift + 26) % 26 + base);
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

function bruteForceCaesar() {
  const text = document.getElementById("encryptedText").value;
  if (!text.trim()) {
    alert("Masukkan teks terlebih dahulu.");
    return;
  }

  let result = "🔍 Brute-force Caesar:\n\n";
  for (let shift = 1; shift < 26; shift++) {
    const decrypted = decryptCaesar(text, shift);
    result += `Shift ${shift}: ${decrypted}\n`;
  }

  document.getElementById("outputText").value = result;
}

function saveToFile() {
  const result = document.getElementById("outputText").value;
  if (!result.trim()) {
    alert("Tidak ada hasil untuk disimpan.");
    return;
  }

  const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hasil_dekripsi.txt";
  a.click();
}