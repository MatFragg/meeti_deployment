import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', () => {
    const deleteForms = document.querySelectorAll('.eliminar-comentario');

    // Check if there are deleteForms
    if (deleteForms.length > 0) {
        deleteForms.forEach(form => {
            form.addEventListener('submit', deleteComment);
        });
    }
})

function deleteComment(e) {
    e.preventDefault();
    Swal.fire({
        title: "Are you sure you want to Delete this comment?",
        text: "A deleted comment can't be recovered!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const commentId = this.children[0].value;

                const data = {
                    commentId
                }

                axios.post(this.action,data).then(response => {
                    Swal.fire({
                        title: "Deleted!",
                        text: response.data,
                        icon: "success"
                    });

                    this.parentElement.parentElement.remove();
                }).catch(error => {
                    if(error.response.status === 403 || error.response.status === 404){
                        Swal.fire({
                            title: "Error",
                            text: error.response.data,
                            icon: "error"
                        });
                    }
                });
            }
    });

    console.log(this.action);
    
}