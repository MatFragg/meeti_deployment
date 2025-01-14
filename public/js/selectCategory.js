document.addEventListener('DOMContentLoaded', () => {
    validateForm();
});

function validateForm() {
    const form = document.getElementById('newGroupForm');
    form.addEventListener('submit', function (event) {
        const checkboxes = document.querySelectorAll('input[name="category[]"]');
        const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        if (!isChecked) {
            event.preventDefault(); 
        }
    });
}