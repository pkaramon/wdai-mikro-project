function openPopup(title, message) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-message').innerHTML = message;
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
document.getElementById('close-button').addEventListener('click', closePopup)

const contactForm = document.getElementById('contact-form');
const inputFields = new Map([
    ["username", document.getElementById('username')],
    ["email", document.getElementById('email')],
    ["message", document.getElementById('message')],
])

function contactFormHandler(event) {
    event.preventDefault();

    const contactData = new Map();
    for (const [fieldName, field] of inputFields.entries()) {
        contactData.set(fieldName, field.value.trim());
    }

    const errors = validateContactData(contactData);

    if (errors.size === 0) {
        successfulSubmition();
    } else {
        unsuccessfulSubmition(errors);
    }

    applyFieldStylesBasedOnValidation(errors);

}

contactForm.addEventListener('submit', contactFormHandler);


function successfulSubmition() {
    openPopup("Sukces!", "Wiadomość została dostarczona, w najbliższym czasie odezwę się do Ciebie.")
    for (const field of inputFields.values()) {
        field.value = "";
    }
}

function unsuccessfulSubmition(errors) {
    const errorListItems = [];
    for (const [field, error] of errors.entries()) {
        errorListItems.push(`<li>${error}</li>`)
    }
    openPopup("Niestety niektóre dane nie są poprawne", `<ul>${errorListItems.join('\n')}</ul>`)
}

function applyFieldStylesBasedOnValidation(errors) {
    for (const [name, field] of inputFields.entries()) {
        if (errors.has(name)) {
            field.classList.add('field-invalid');
        } else {
            field.classList.remove('field-invalid');
        }
    }
}

// source: https://emailregex.com/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MESSAGE_MAX_LENGTH = 500;
function validateContactData(contactData) {
    const username = contactData.get("username"),
        email = contactData.get("email"),
        message = contactData.get("message");

    const errors = new Map();

    if (!username) {
        errors.set("username", "Twoje imię nie może być puste")
    }

    if (!email) {
        errors.set("email", "Adres email nie może być pusty");
    } else if (!EMAIL_REGEX.test(email)) {
        errors.set("email", "Proszę podać prawdziwy adres email");
    }

    if (!message) {
        errors.set("message", "Pusta wiadomość nie może być wysłana");
    } else if (message.length >= MESSAGE_MAX_LENGTH) {
        errors.set("message", "Wiadomość może mieć maksymalnie 500 znaków");
    }

    return errors;
}
